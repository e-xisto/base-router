import * as express from 'express';
import * as baseRouter from './interfaces/base-router';

const fs    = require('fs');

import groups from './models/groups';


let app: any;
let idiomas: baseRouter.idiomas = { idiomas: false, lng: '', default: '', actives: {}, t: {}};
let map: any;
let mapName: string           = ''; // Nombre del fichero del mapa de rutas, por defecto map.json
let path: string              = '';	// Path de la aplicación
let pathLanguages: string     = '';	// Path de los idiomas
let pathRoutes: string        = '';	// Path de las rutas por defecto _path/routes
let routesFile: string        = '';	// Fichero con la declaración de rutas por defecto routes.js
let server: baseRouter.server = {};


	function alternate (ruta: any, info: baseRouter.route) {

		if (idiomas.idiomas) {
			info.alternate = [];
			info.link      = {};
			for (let lng in idiomas.actives) {
				if (ruta.languages [lng]) {
					info.alternate.push ({lang: lng, href: `${ server.serverName }/${ lng }${ urlToLink(ruta.languages [lng].url) }`});
					info.link [lng] = `/${ lng }${ urlToLink(ruta.languages [lng].url) }`;
				}
			}
		}
	}


	function breadcrumb (ruta: any): any [] {

		let result: any [] = [];

		result.push (breadcrumbData (ruta));
		while (ruta.parent) {
			ruta = contentById (ruta.parent);
			result.unshift (breadcrumbData (ruta));
		}
		return result;
	}


	function breadcrumbData (content: any): any {

		let result: any = {};

		if (content.languages && idiomas.idiomas && content.languages [idiomas.lng]) {
			result.description = content.languages [idiomas.lng].description;
			result.link = `/${ idiomas.lng }${ urlToLink(content.languages [idiomas.lng].url) }`;
		} else {
			result.description = content.description;
			result.link        = urlToLink(content.url);
		}
		return result;
	}


	function urlToLink (url: string): string {

		return url ? url.replace (/\/(\w+)?:(.*?)$/, '') : '';
	}


	function configure (options: any) {

		mapName    = options.map || 'map.yaml';
		path       = options.path || '';
		pathLanguages = options.pathLanguages || '/public/lang/';
		pathRoutes = options.pathRoutes || options.path + '/routes';
		routesFile = options.routes || 'routes.js';

		if (! path) {
			console.log ("\n\x1b[31mNo se puede cargar un mapa poque no se ha definido un path\x1b[0m\n");
			process.exit ();
		}

		app = require (path + '/server.js');
		setServer ();
		app.use (routes);
		loadRoutes ();
		loadMap ();
		setGroups ();
	}


	function contentById (id: number): any {

		return map.contents.find ((ruta: any) => { if (ruta.id == id) return ruta; });
	}


	function evalRuta (req: express.Request, res: express.Response, ruta: any, router: any) {

		let url = [];
		if (ruta.redirect) return res.redirect (ruta.redirect);
		if (! ruta.keysLength) return req.url = router.route;
		url.push (router.route);
		for (let i = 1; i <= ruta.keysLength; i++) {
			if (ruta.keys [i - 1] === undefined) break;
			url.push (ruta.args [i]);
		}
		req.url = url.join ('/');
	}


	function findRoute (req: express.Request, res: express.Response): any {

		if (req.url == '/map-reload') return mapReload (res);

		if (idiomas.idiomas) {
			if (! validarIdioma (req, res)) return false;
			// Eliminamos el idioma de la URL
			let url = req.url.substr (3);
			if (! url) url = '/';
			return map.contents.find ((ruta: any) => {
					if (findRouteOk (ruta.languages [idiomas.lng], url)) return ruta;
				});
		}

		return map.contents.find ((ruta: any) => {
				if (findRouteOk (ruta, req.url)) return ruta;
			});
	}


	function findRouteOk (ruta: any, url: string): boolean {

		if (ruta.path) {
			let res = ruta.path.exec (url);
			if (res) {
				ruta.args = res;
				return true;
			}
		}
		return false;
	}


	function idiomaNavegador (req: express.Request) {

		if (req.headers && req.headers ['accept-language']) {
			let accept: string = String (req.headers ['accept-language']).replace (/q=\d+(\.\d+)?(,|\b)/g, '');
			for (let lng of accept.split (';')) {
				if (lng && lng.length >=2) {
					lng = lng.substr (0,2).toLowerCase ();
					if (idiomas.actives [lng]) return lng;
				}
			}
		}
		return idiomas.default;
	}


	function lng (): string { return idiomas.lng; }


	function loadMap () {

		let mapFile = `${ path }/${ mapName }`;

		try {
			// Metodo asincrono
			if (mapFile.match (/\.YAML$/i)) map = require ('yamljs').parse (fs.readFileSync (mapFile, 'utf8'));
			else map = JSON.parse (fs.readFileSync (mapFile, 'utf8'));
		} catch (e) {
			if (e.code == 'MODULE_NOT_FOUND' || e.code == 'ENOENT') {
				console.log ("\n\x1b[31mNo se ha encontrado el mapa de rutas");
				console.log ("    \x1b[41m" + mapFile + "\x1b[0m\n");
			} else if (e.code == undefined) {
				console.log ("\n\x1b[31mError en el mapa de rutas");
				console.log ("    \x1b[41m" + mapFile + "\x1b[0m\n");
				console.log (e);
			} else console.log (e);
			process.exit ();
		}

		optimizedLanguages ();
		prepareRoutes ();
	}


	function loadRoutes () {

		let rutasFile = `${ pathRoutes }/${ routesFile }`;

		try {
			require (rutasFile);
		} catch (e) {
			console.log ("\n\x1b[31mNo se ha podido cargar el fichero de rutas");
			console.log ("    \x1b[41m" + rutasFile + "\x1b[0m\n");
			console.log (e);
			process.exit ();
		}
	}


	function mapReload (res: express.Response) {

		console.log ("\n\x1b[32mRecargando mapa de contenidos\x1b[0m\n");
		idiomas = { idiomas: false, lng: '', default: '', actives: {}, t: {}};
		loadMap ();
		setGroups ();
		res.redirect ('/');
		return false;
	}


	function optimizedLanguages () {

		if (map.languages) {
			for (let lng in map.languages) {
				let lang = map.languages [lng];
				if (lang.active) {
					idiomas.actives [lng] = true;
					//Por defecto el idioma por defecto es el primero.
					if (! idiomas.default) idiomas.default = lng;
					if (lang.default) idiomas.default = lng;

					let dictionary: string = `${path}${pathLanguages}${lng}.json`;
					if (fs.existsSync(dictionary)) idiomas.t[lng] = require(dictionary);
					else idiomas.t[lng] = {};
				}
			}
			if (idiomas.default) {
				idiomas.lng     = idiomas.default;
				idiomas.idiomas = true;
			}
		}
	}


	function prepareRoutes () {

		const pathToRegexp = require ('path-to-regexp');


		if (idiomas.idiomas) {
			for (let i in map.contents) {
				let route = map.contents [i];
				for (let lng in idiomas.actives) {

					if (route.languages [lng] && route.languages [lng].url) {
						route.languages [lng].keys = [];
						route.languages [lng].path = pathToRegexp (route.languages [lng].url, route.languages [lng].keys);
						route.languages [lng].keysLength = route.languages [lng].keys.length;
					} else	console.log (`\n\x1b[32mRuta ${ lng }/${ route.content } sin url definida\x1b[0m\n`);
				}
			}
		} else {
			for (let i in map.contents) {
				let route = map.contents [i];
				if (route.url) {
					route.keys       = [];
					route.path       = pathToRegexp (route.url, route.keys);
					route.keysLength = route.keys.length;
				} else	console.log (`\n\x1b[32mRuta ${ route.content } sin url definida\x1b[0m\n`);
			}
		}
	}


	function routes (req: express.Request, res: express.Response, next: express.NextFunction) {

		let url  = req.url;
		let ruta = findRoute (req, res);

		if (! ruta) {
			if (res.headersSent) return
			setRoute (req, res, ruta, url);
			return next ('route');
		}

		if (ruta) {
			if (idiomas.idiomas) evalRuta (req, res, ruta.languages [idiomas.lng], ruta.router);
			else evalRuta (req, res, ruta, ruta.router);
		}
		setRoute (req, res, ruta, url);
		next ('route');
	}


	function setData (parent: any, info: any, property: string): void {

		if (parent [property] !== undefined) info [property] = parent [property];
	}


	function setDefault (parent: any, property: string): object {

		let result = {};
		if (! parent) return result;
		if (parent [property]) result = parent [property];
		if (idiomas.idiomas && parent.languages && parent.languages [idiomas.lng][property])
			return {...result, ...parent.languages [idiomas.lng][property]};
		return result;
	}


	function setDefaultProperty (parent: any, property: string): string {

		if (! parent) return '';
		if (idiomas.idiomas && parent.languages && parent.languages [idiomas.lng][property])
			return parent.languages [idiomas.lng][property];
		if (parent [property]) return parent [property];
		return '';
	}


	function setGroups () {

		groups.clear ();
		if (map.groups) {
			for (let name in map.groups) {
				for (let item of map.groups [name]) {
					groups.addItem (name, item, idiomas.idiomas ? idiomas.actives : false);
				}
			}
		}
	}


	function setRoute (req: express.Request, res: express.Response, ruta: any, url: string) {

		let info: baseRouter.route = {};

		if (ruta) {
			info.content     = ruta.content;
			info.id          = ruta.id;
			info.parent      = ruta.parent || 0;
			info.description = setDefaultProperty (ruta, 'description');
			info.router      = {...ruta.router};
			info.breadcrumb  = breadcrumb (ruta);
			alternate (ruta, info);
		}
		info.url         = url;
		info.lng         = idiomas.lng;
		info.meta        = {...setDefault (map, 'meta'), ...setDefault (ruta, 'meta')}
		info.og          = {...setDefault (map, 'og'), ...setDefault (ruta, 'og')};
		info.twitter     = {...setDefault (map, 'twitter'), ...setDefault (ruta, 'twitter')};
		setData (map, info, 'xDefault');
		setData (map, info, 'dnsPrefetch');
		setData (map, info, 'scripts');
		res.locals.__route  = info;
		res.locals.__server = {...server};
		res.locals.__groups = groups;
		res.locals.__t = idiomas.t[idiomas.lng];
	}


	function setServer () {

		server.name      = app.__args.serverName;
		server.localPort = app.get('port');
		server.protocol  = app.__args.protocol;
		server.serverName = `${ server.protocol }://${ server.name }`;
	}


	function validarIdioma (req: express.Request, res: express.Response) {

		// Si la url no trae idioma lo añade y lo redirige habria que analizar mejor este comportamiento
		if (! req.url) {
			res.redirect ('/' + idiomaNavegador (req));
			return false;
		}

		if (! req.url.match (/^\/\w\w(\/|$)/)) {
			res.redirect ('/' + idiomaNavegador (req) + req.url);
			return false;
		}

		idiomas.lng  = req.url.substr (1,2);

		if (! idiomas.actives [idiomas.lng]) {
			res.redirect ('/' + idiomaNavegador (req));
			return false;
		}

		return true;
	}


	export { configure, contentById, lng, urlToLink };

	///////////////////////////////////
	///////////////////////////////////
	///////////////////////////////////

