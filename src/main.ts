import * as express from 'express';
import * as baseRouter from './interfaces/base-router';

const fs    = require('fs');
const chalk = require('chalk');

import groups from './models/groups';


let app: any;
let idiomas: baseRouter.idiomas = { idiomas: false, lng: '', default: '', actives: {}};
let map: any;
let mapName: string           = ''; // Nombre del fichero del mapa de rutas, por defecto map.json
let path: string              = '';	// Path de la aplicación
let pathRoutes: string        = '';	// Path de las rutas por defecto _path/routes
let routesFile: string        = '';	// Fichero con la declaración de rutas por defecto routes.js
let server: baseRouter.server = {};


	function alternate (ruta: any, info: baseRouter.route) {

		if (idiomas.idiomas) {
			info.alternate = [];
			info.link      = {};
			let serverName = `${ server.protocol }://${ server.name }`;
			for (let lng in idiomas.actives) {
				if (ruta.languages [lng]) {
					info.alternate.push ({lang: lng, href: `${ serverName }/${ lng }${ ruta.languages [lng].url}`});
					info.link [lng] = `/${ lng }${ ruta.languages [lng].url}`;
				}
			}
		}
	}


	function breadcrum (ruta: any): any [] {

		let result: any [] = [];

		result.push (breadcrumData (ruta));
		while (ruta.parent) {
			ruta = contentById (ruta.parent);
			result.unshift (breadcrumData (ruta));
		}
		return result;
	}


	function breadcrumData (content: any): any {

		let result: any = {};

		if (content.languages && idiomas.idiomas && content.languages [idiomas.lng]) {
			result.description = content.languages [idiomas.lng].description;
			result.link = `/${ idiomas.lng }${ content.languages [idiomas.lng].url }`;
		} else {
			result.description = content.description;
			result.link        = content.url;
		}
		return result;
	}


    function configure (options: any) {

		mapName    = options.map || 'map.yaml';
		path       = options.path || '';
		pathRoutes = options.pathRoutes || options.path + '/routes';
		routesFile = options.routes || 'routes.js';

		if (! path) {
			console.log (chalk.red ("\nNo se puede cargar un mapa poque no se ha definido un path\n"));
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

		return map.content.find ((ruta: any) => { if (ruta.id == id) return ruta; });
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
			return map.content.find ((ruta: any) => {
					if (findRouteOk (ruta.languages [idiomas.lng], url)) return ruta;
				});
		}

		return map.content.find ((ruta: any) => {
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


	function lng (): string { return idiomas.lng; }


	function loadMap () {

		let mapFile = `${ path }/${ mapName }`;

		try {
			// Metodo asincrono
			if (mapFile.match (/\.YAML$/i)) map = require ('yamljs').parse (fs.readFileSync (mapFile, 'utf8'));
			else map = JSON.parse (fs.readFileSync (mapFile, 'utf8'));
		} catch (e) {
			if (e.code == 'MODULE_NOT_FOUND' || e.code == 'ENOENT') {
				console.log ("\n" + chalk.red ('No se ha encontrado el mapa de rutas'));
				console.log ('    ' + chalk.red.inverse (mapFile) + "\n");
			} else if (e.code == undefined) {
				console.log ("\n" + chalk.red ('Error en el mapa de rutas'));
				console.log ('    ' + chalk.red.inverse (mapFile) + "\n");
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
			console.log ("\n" + chalk.red ('No se ha podido cargar el fichero de rutas'));
			console.log ('    ' + chalk.red.inverse (rutasFile) + "\n");
			console.log (e);
			process.exit ();
		}
	}


	function mapReload (res: express.Response) {

		console.log ("\n" + chalk.green ('Recargando mapa de contenidos') + "\n");
		idiomas = { idiomas: false, lng: '', default: '', actives: {}};
		loadMap ();
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
			for (let i in map.content) {
				let route = map.content [i];
				for (let lng in idiomas.actives) {
					if (route.languages [lng] && route.languages [lng].url) {
						route.languages [lng].keys = [];
						route.languages [lng].path = pathToRegexp (route.languages [lng].url, route.languages [lng].keys);
						route.languages [lng].keysLength = route.languages [lng].keys.length;
					} else	console.log (chalk.red (`\nRuta ${ lng }/${ route.content } sin url definida\n`));
				}
			}
		} else {
			for (let i in map.content) {
				let route = map.content [i];
				if (route.url) {
					route.keys       = [];
					route.path       = pathToRegexp (route.url, route.keys);
					route.keysLength = route.keys.length;
				} else	console.log (chalk.red (`\nRuta ${ route.content } sin url definida\n`));
			}
		}
	}


	function routes (req: express.Request, res: express.Response, next: express.NextFunction) {

		let url  = req.url;
		let ruta = findRoute (req, res);

		if (! ruta) {
			if (res.headersSent) return
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

		info.content     = ruta.content;
		info.id          = ruta.id;
		info.parent      = ruta.parent || 0;
		info.description = setDefaultProperty (ruta, 'description');
		info.url         = url;
		info.lng         = idiomas.lng;
		info.meta        = {...setDefault (map, 'meta'), ...setDefault (ruta, 'meta')}
		info.og          = {...setDefault (map, 'og'), ...setDefault (ruta, 'og')};
		info.twitter     = {...setDefault (map, 'twitter'), ...setDefault (ruta, 'twitter')};
		info.router      = {...ruta.router};
		info.breadcrum   = breadcrum (ruta);
		setData (map, info, 'xDefault');
		setData (map, info, 'dnsPrefetch');
		setData (map, info, 'scripts');
		alternate (ruta, info);
		res.locals.__route  = info;
		res.locals.__server = {...server};
		res.locals.__groups = groups;
	}


	function setServer () {

		server.name      = app.__args.serverName;
		server.localPort = app.get('port');
		server.protocol  = app.__args.protocol;
	}


	function validarIdioma (req: express.Request, res: express.Response) {

		// Si la url no trae idioma lo añade y lo redirige habria que analizar mejor este comportamiento
		if (! req.url) {
			res.redirect ('/' + idiomas.default);
			return false;
		}

		if (! req.url.match (/^\/\w\w(\/|$)/)) {
			res.redirect ('/' + idiomas.default + req.url);
			return false;
		}

		idiomas.lng  = req.url.substr (1,2);

		if (! idiomas.actives [idiomas.lng]) {
			res.redirect ('/' + idiomas.default);
			return false;
		}

		return true;
	}


	export { configure, contentById, lng };

	///////////////////////////////////
	///////////////////////////////////
	///////////////////////////////////

