import * as express from 'express';

const fs    = require('fs');
const chalk = require('chalk');


let idioma: string     = '';
let idiomas: string [] = [];
let map: any;
let mapName: string    = ''; 	// Nombre del fichero del mapa de rutas, por defecto map.json
let path: string       = '';	// Path de la aplicación
let pathRoutes: string = '';	// Path de las rutas por defecto _path/routes
let routesFile: string = '';	// Fichero con la declaración de rutas por defecto routes.js


exports.configure = (options: any) => {

	let app: any;

	mapName    = options.map || 'map.json';
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


function findRuta (req: express.Request, res: express.Response): any {

	if (req.url == '/map-reload') return mapReload (res);

	if (idiomas.length) {
		if (! req.url) {
			res.redirect ('/' + idiomas [0]);
			return false;
		}

		if (! req.url.match (/^\/\w\w(\/|$)/)) {
			res.redirect ('/' + idiomas [0] + req.url);
			return false;
		}

		idioma  = req.url.substr (1,2);
		let url = req.url.substr (3) || '/';
		if (url == '/') req.url = '/';

		return map.content.find ((ruta: any) => {
					if (ruta.languages [idioma].exp && new RegExp (ruta.languages [idioma].exp).test (url)) return ruta;
					else if (ruta.languages [idioma].url == url) return ruta;
			});
	}

	return map.content.find ((ruta: any) => {
					if (ruta.exp && new RegExp (ruta.exp).test (req.url)) return ruta;
					else if (ruta.url == req.url) return ruta;
			});
}


function loadMap () {

	let mapFile = `${ path }/${ mapName }`;

	idiomas = [];

	try {
		// Metodo asincrono
		map = JSON.parse (fs.readFileSync (mapFile, 'utf8'));
	} catch (e) {
		if (e.code == 'MODULE_NOT_FOUND') {
			console.log ("\n" + chalk.red ('No se ha encontrado el mapa de rutas'));
			console.log ('    ' + chalk.red.inverse (mapFile) + "\n");
		} else if (e.code == undefined) {
			console.log ("\n" + chalk.red ('Error en el mapa de rutas'));
			console.log ('    ' + chalk.red.inverse (mapFile) + "\n");
			console.log (e);
		} else console.log (e);
		process.exit ();
	}

	for (let lang of map.languages) if (lang.active) idiomas.push (lang.path);
}


function loadRoutes () {

	let rutasFile = `${ pathRoutes }/${ routesFile }`;

	try {
		require (rutasFile);
	} catch (e) {
		console.log ("\n" + chalk.red ('No se ha podido cargar el fichero de rutas'));
		console.log ('    ' + chalk.red.inverse (rutasFile) + "\n");
		process.exit ();
	}
}


function mapReload (res: express.Response) {

	console.log ("\n" + chalk.green ('Recargando mapa de contenidos') + "\n");
	loadMap ();
	res.redirect ('/');
	return false;
}


function routes (req: express.Request, res: express.Response, next: express.NextFunction) {

	let ruta = findRuta (req, res);

	if (ruta === false) return;

	if (ruta) {
		res.locals.__route = ruta;
		ruta.url = req.url;
		if (ruta.languages.es.exp) req.url = ruta.router.route + req.url.replace (/^\/[^\/]*/, '');
		else req.url = ruta.router.route;
	} else res.locals.__route = {url: req.url}
	if (idioma) res.locals.__route.lng = idioma;
	next ('route');
}



///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////


