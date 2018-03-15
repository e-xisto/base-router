"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const chalk = require('chalk');
let idioma = '';
let idiomas = [];
let map;
let mapName = ''; // Nombre del fichero del mapa de rutas, por defecto map.json
let path = ''; // Path de la aplicación
let pathRoutes = ''; // Path de las rutas por defecto _path/routes
let routesFile = ''; // Fichero con la declaración de rutas por defecto routes.js
exports.configure = (options) => {
    let app;
    mapName = options.map || 'map.yaml';
    path = options.path || '';
    pathRoutes = options.pathRoutes || options.path + '/routes';
    routesFile = options.routes || 'routes.js';
    if (!path) {
        console.log(chalk.red("\nNo se puede cargar un mapa poque no se ha definido un path\n"));
        process.exit();
    }
    app = require(path + '/server');
    app.use(routes);
    loadRoutes();
    loadMap();
};
function findRoute(req, res) {
    if (req.url == '/map-reload')
        return mapReload(res);
    if (idiomas.length) {
        if (!validarIdioma(req, res))
            return false;
        // Eliminamos el idioma de la URL
        let url = req.url.substr(3);
        return map.content.find((ruta) => {
            if (findRouteOk(ruta.languages[idioma], url))
                return ruta;
        });
    }
    return map.content.find((ruta) => {
        if (findRouteOk(ruta, req.url))
            return ruta;
    });
}
function findRouteOk(ruta, url) {
    if (ruta.path) {
        let res = ruta.path.exec(url);
        if (res) {
            ruta.args = res;
            return true;
        }
    }
    return false;
}
function loadMap() {
    let mapFile = `${path}/${mapName}`;
    idiomas = [];
    try {
        // Metodo asincrono
        if (mapFile.match(/\.YAML$/i))
            map = require('yamljs').parse(fs.readFileSync(mapFile, 'utf8'));
        else
            map = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
    }
    catch (e) {
        if (e.code == 'MODULE_NOT_FOUND' || e.code == 'ENOENT') {
            console.log("\n" + chalk.red('No se ha encontrado el mapa de rutas'));
            console.log('    ' + chalk.red.inverse(mapFile) + "\n");
        }
        else if (e.code == undefined) {
            console.log("\n" + chalk.red('Error en el mapa de rutas'));
            console.log('    ' + chalk.red.inverse(mapFile) + "\n");
            console.log(e);
        }
        else
            console.log(e);
        process.exit();
    }
    for (let lang of map.languages) {
        if (lang.active)
            idiomas.push(lang.path);
    }
    prepareRoutes();
}
function loadRoutes() {
    let rutasFile = `${pathRoutes}/${routesFile}`;
    try {
        require(rutasFile);
    }
    catch (e) {
        console.log("\n" + chalk.red('No se ha podido cargar el fichero de rutas'));
        console.log('    ' + chalk.red.inverse(rutasFile) + "\n");
        console.log(e);
        process.exit();
    }
}
function mapReload(res) {
    console.log("\n" + chalk.green('Recargando mapa de contenidos') + "\n");
    loadMap();
    res.redirect('/');
    return false;
}
function prepareRoutes() {
    const pathToRegexp = require('path-to-regexp');
    if (idiomas.length) {
        for (let i in map.content) {
            let route = map.content[i];
            for (let language of map.languages) {
                if (route.languages[language.path].url) {
                    route.languages[language.path].keys = [];
                    route.languages[language.path].path = pathToRegexp(route.languages[language.path].url, route.languages[language.path].keys);
                    route.languages[language.path].keysLength = route.languages[language.path].keys.length;
                }
                else
                    console.log(chalk.red(`\nRuta ${language.path}/${route.content} sin url definida\n`));
            }
        }
    }
    else {
        for (let i in map.content) {
            let route = map.content[i];
            if (route.url) {
                route.keys = [];
                route.path = pathToRegexp(route.url, route.keys);
                route.keysLength = route.keys.length;
            }
            else
                console.log(chalk.red(`\nRuta ${route.content} sin url definida\n`));
        }
    }
}
function routes(req, res, next) {
    let ruta = findRoute(req, res);
    if (ruta === false)
        return;
    if (ruta) {
        res.locals.__route = ruta;
        ruta.url = req.url;
        if (idioma) {
            traduceRuta(req, res, ruta.languages[idioma], ruta.router);
        }
        else if (!idioma) {
            traduceRuta(req, res, ruta, ruta.router);
        }
    }
    else
        res.locals.__route = { url: req.url };
    if (idioma)
        res.locals.__route.lng = idioma;
    next('route');
}
function traduceRuta(req, res, ruta, router) {
    let url = [];
    if (ruta.redirect)
        return res.redirect(ruta.redirect);
    if (!ruta.keysLength)
        return req.url = router.route;
    url.push(router.route);
    for (let i = 1; i <= ruta.keysLength; i++) {
        if (ruta.keys[i] === undefined)
            break;
        url.push(ruta.args[i]);
    }
    req.url = url.join('/');
}
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
function validarIdioma(req, res) {
    // Si la url no trae idioma lo añade y lo redirige habria que analizar mejor este comportamiento
    // Falta validar que el idioma este activado
    if (!req.url) {
        res.redirect('/' + idiomas[0]);
        return false;
    }
    if (!req.url.match(/^\/\w\w(\/|$)/)) {
        res.redirect('/' + idiomas[0] + req.url);
        return false;
    }
    idioma = req.url.substr(1, 2);
    return true;
}
