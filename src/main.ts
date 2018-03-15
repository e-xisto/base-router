import * as express from 'express';

const fs    = require('fs');
const chalk = require('chalk');


let idiomas: any = { idioma: false, default: false };
let map: any;
let mapName: string    = ''; 	// Nombre del fichero del mapa de rutas, por defecto map.json
let path: string       = '';	// Path de la aplicación
let pathRoutes: string = '';	// Path de las rutas por defecto _path/routes
let routesFile: string = '';	// Fichero con la declaración de rutas por defecto routes.js


exports.configure = (options: any) => {

	let app: any;

	mapName    = options.map || 'map.yaml';
	path       = options.path || '';
	pathRoutes = options.pathRoutes || options.path + '/routes';
	routesFile = options.routes || 'routes.js';

	if (! path) {
		console.log (chalk.red ("\nNo se puede cargar un mapa poque no se ha definido un path\n"));
		process.exit ();
	}

	app = require (path + '/server');

	app.use (routes);
	loadRoutes ();
	loadMap ();
}


function findRoute (req: express.Request, res: express.Response): any {

	if (req.url == '/map-reload') return mapReload (res);

	if (idiomas.idioma) {
		if (! validarIdioma (req, res)) return false;
		// Eliminamos el idioma de la URL
		let url = req.url.substr (3);
		return map.content.find ((ruta: any) => {
				if (findRouteOk (ruta.languages [idiomas.idioma], url)) return ruta;
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
	loadMap ();
	res.redirect ('/');
	return false;
}


function optimizedLanguages () {

	//Por defecto el idioma por defecto es el primero.
	for (let lang of map.languages) {
		if (lang.active) {
			idiomas [lang.path] = true;
			if (! idiomas.default) idiomas.default = lang.path;
			if (lang.default) idiomas.default = lang.path;
		}
	}
	if (idiomas.default) idiomas.idioma = idiomas.default;
}


function prepareRoutes () {

	const pathToRegexp = require ('path-to-regexp');

	if (idiomas.idioma) {
		for (let i in map.content) {
			let route = map.content [i];
			for (let language of map.languages) {
				if (route.languages [language.path].url) {
					route.languages [language.path].keys = [];
					route.languages [language.path].path = pathToRegexp (route.languages [language.path].url,
						                                                 route.languages [language.path].keys);
					route.languages [language.path].keysLength = route.languages [language.path].keys.length;
				} else	console.log (chalk.red (`\nRuta ${ language.path }/${ route.content } sin url definida\n`));
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

	let ruta = findRoute (req, res);
	if (ruta === false) return;

	if (ruta) {
		res.locals.__route = ruta;
		ruta.url = req.url;
		if (idiomas.idioma) {
			traduceRuta (req, res, ruta.languages [idiomas.idioma], ruta.router);
		} else if (! idiomas.idioma) {
			traduceRuta (req, res, ruta, ruta.router);
		}
	} else res.locals.__route = {url: req.url}

	if (idiomas.idioma) res.locals.__route.lng = idiomas.idioma;
	next ('route');
}


function traduceRuta (req: express.Request, res: express.Response, ruta: any, router: any) {

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

	idiomas.idioma  = req.url.substr (1,2);

	//
	if (! idiomas [idiomas.idioma]) {
		res.redirect ('/' + idiomas.default);
		return false;
	}

	return true;
}


///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////







