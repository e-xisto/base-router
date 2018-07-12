"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const groups_1 = __importDefault(require("./models/groups"));
const staticContent_1 = require("./models/staticContent");
const device_1 = require("./models/device");
// let app: any;
let idiomas = { idiomas: false, lng: '', default: '', actives: {}, t: {} };
let map;
let mapName = ''; // Nombre del fichero del mapa de rutas, por defecto map.json
let path = ''; // Path de la aplicación
let pathLanguages = ''; // Path de los idiomas
let pathRoutes = ''; // Path de las rutas por defecto _path/routes
let routesFile = ''; // Fichero con la declaración de rutas por defecto routes.js
let server = {};
let sinIdiomas = [];
let staticContents = [];
function alternate(ruta, info) {
    if (idiomas.idiomas) {
        info.link = {};
        for (let lng in idiomas.actives) {
            if (ruta.languages && ruta.languages[lng]) {
                info.link[lng] = `/${lng}${urlToLink(ruta.languages[lng].url)}`;
            }
            else {
                info.link[lng] = `/${lng}`;
            }
        }
    }
}
function breadcrumb(ruta) {
    let result = [];
    result.push(breadcrumbData(ruta));
    while (ruta.parent) {
        ruta = contentById(ruta.parent);
        result.unshift(breadcrumbData(ruta));
    }
    return result;
}
function breadcrumbData(content) {
    let result = {};
    if (content.languages && idiomas.idiomas && content.languages[idiomas.lng]) {
        result.description = content.languages[idiomas.lng].description;
        result.link = `/${idiomas.lng}${urlToLink(content.languages[idiomas.lng].url)}`;
    }
    else {
        result.description = content.description;
        result.link = urlToLink(content.url);
    }
    return result;
}
function configure(app, options) {
    mapName = options.map || 'map.yaml';
    path = options.path || '';
    pathLanguages = options.pathLanguages || '/public/lang/';
    pathRoutes = options.pathRoutes || path + '/routes';
    routesFile = options.routes || 'routes.js';
    if (!path) {
        console.log("\n\x1b[31mNo se puede cargar un mapa poque no se ha definido un path\x1b[0m\n");
        process.exit();
    }
    setServer(app);
    app.use(routes);
    loadRoutes(app);
    loadMap();
    setGroups();
}
exports.configure = configure;
function contentById(id) {
    return map.contents.find((ruta) => { if (ruta.id == id)
        return ruta; });
}
exports.contentById = contentById;
function evalRuta(req, res, ruta, router) {
    let url = [];
    if (ruta.redirect)
        return res.redirect(ruta.redirect);
    if (!ruta.keysLength)
        return req.url = router.route;
    url.push(router.route);
    for (let i = 1; i <= ruta.keysLength; i++) {
        if (ruta.keys[i - 1] === undefined)
            break;
        url.push(ruta.args[i]);
    }
    req.url = url.join('/');
}
function findRoute(req, res) {
    let ruta;
    if (req.url == '/map-reload') {
        mapReload(res);
        return { id: 0 };
    }
    if (idiomas.idiomas) {
        if (!validarIdioma(req, res))
            return { id: 0 };
        // Eliminamos el idioma de la URL
        let url = req.url.substr(3);
        if (!url)
            url = '/';
        ruta = map.contents.find((ruta) => {
            if (ruta.languages) {
                if (ruta.languages[idiomas.lng] && findRouteOk(ruta.languages[idiomas.lng], url))
                    return ruta;
            }
            else {
                if (findRouteOk(ruta, req.url))
                    return ruta;
            }
        });
    }
    else
        ruta = map.contents.find((ruta) => {
            if (findRouteOk(ruta, req.url))
                return ruta;
        });
    return ruta ? ruta : { id: 0 };
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
function idiomaNavegador(req) {
    if (req.headers && req.headers['accept-language']) {
        let accept = String(req.headers['accept-language']).replace(/q=\d+(\.\d+)?(,|\b)/g, '');
        for (let lng of accept.split(';')) {
            if (lng && lng.length >= 2) {
                lng = lng.substr(0, 2).toLowerCase();
                if (idiomas.actives[lng])
                    return lng;
            }
        }
    }
    return idiomas.default;
}
function isStaticRoute(req, res, next) {
    for (let content of staticContents) {
        if (content.match(req.url)) {
            res.locals.url = req.url;
            req.url = '/static-not-found';
            next();
            return true;
        }
    }
    return false;
}
function lng() {
    let actives = [];
    for (let lng in idiomas.actives) {
        actives.push(lng);
    }
    return { lng: idiomas.lng, actives: actives };
}
exports.lng = lng;
function loadMap() {
    let mapFile = `${path}/${mapName}`;
    try {
        // Metodo asincrono
        if (mapFile.match(/\.YAML$/i))
            map = require('yamljs').parse(fs.readFileSync(mapFile, 'utf8'));
        else
            map = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
    }
    catch (e) {
        if (e.code == 'MODULE_NOT_FOUND' || e.code == 'ENOENT') {
            console.log("\n\x1b[31mNo se ha encontrado el mapa de rutas");
            console.log("    \x1b[41m\x1b[37m" + mapFile + "\x1b[0m\n");
        }
        else if (e.code == undefined) {
            console.log("\n\x1b[31mError en el mapa de rutas");
            console.log("    \x1b[41m\x1b[37m" + mapFile + "\x1b[0m\n");
            console.log(e);
        }
        else
            console.log(e);
        process.exit();
    }
    optimizedLanguages();
    prepareStaticContents();
    prepareRoutes();
}
function loadRoutes(app) {
    let rutasFile = `${pathRoutes}/${routesFile}`;
    try {
        require(rutasFile)(app);
    }
    catch (e) {
        console.log("\n\x1b[31mNo se ha podido cargar el fichero de rutas");
        console.log("    \x1b[41m\x1b[37m" + rutasFile + "\x1b[0m\n");
        console.log(e);
        process.exit();
    }
}
function mapReload(res) {
    console.log("\n\x1b[32mRecargando mapa de contenidos\x1b[0m\n");
    idiomas = { idiomas: false, lng: '', default: '', actives: {}, t: {} };
    loadMap();
    setGroups();
    res.redirect('/');
    return false;
}
function optimizedLanguages() {
    if (map.languages) {
        for (let lng in map.languages) {
            let lang = map.languages[lng];
            if (lang.active) {
                idiomas.actives[lng] = true;
                //Por defecto el idioma por defecto es el primero.
                if (!idiomas.default)
                    idiomas.default = lng;
                if (lang.default)
                    idiomas.default = lng;
                let dictionary = `${path}${pathLanguages}${lng}.json`;
                if (fs.existsSync(dictionary))
                    idiomas.t[lng] = require(dictionary);
                else {
                    console.log("\n\x1b[31mNo se ha podido cargar el fichero de traducciones " + `${pathLanguages}${lng}.json`);
                    idiomas.t[lng] = {};
                }
            }
        }
        if (idiomas.default) {
            idiomas.lng = idiomas.default;
            idiomas.idiomas = true;
        }
        fillLanguages();
    }
}
function fillLanguages() {
    for (let lng in idiomas.actives) {
        if (lng != idiomas.default) {
            idiomas.t[lng] = Object.assign({}, idiomas.t[idiomas.default], idiomas.t[lng]);
        }
    }
}
function prepareRoute(route, pathToRegexp) {
    if (route.url) {
        route.keys = [];
        route.path = pathToRegexp(route.url, route.keys);
        route.keysLength = route.keys.length;
    }
    else
        console.log(`\n\x1b[32mRuta ${route.content} sin url definida\x1b[0m\n`);
}
function prepareRoutes() {
    const pathToRegexp = require('path-to-regexp');
    if (idiomas.idiomas) {
        for (let i in map.contents) {
            let route = map.contents[i];
            if (route.languages) {
                for (let lng in idiomas.actives) {
                    if (route.languages[lng] && route.languages[lng].url) {
                        route.languages[lng].keys = [];
                        route.languages[lng].path = pathToRegexp(route.languages[lng].url, route.languages[lng].keys);
                        route.languages[lng].keysLength = route.languages[lng].keys.length;
                    }
                    else
                        console.log(`\n\x1b[32mRuta ${lng}/${route.content} sin url definida\x1b[0m\n`);
                }
            }
            else {
                prepareRoute(route, pathToRegexp);
                sinIdiomas.push(route);
            }
        }
    }
    else {
        for (let i in map.contents) {
            let route = map.contents[i];
            prepareRoute(route, pathToRegexp);
        }
    }
}
function prepareStaticContents() {
    for (let i in map.staticContents) {
        let content = new staticContent_1.StaticContent(map.staticContents[i]);
        staticContents.push(content);
    }
}
function routes(req, res, next) {
    let url = req.url;
    let ruta;
    // Eliminamos el contenido estatico
    if (isStaticRoute(req, res, next))
        return;
    // Puede haber rutas sin idiomas en mapa por idiomas
    if (sinIdiomas.length && req.url)
        ruta = map.contents.find((ruta) => { if (findRouteOk(ruta, req.url))
            return ruta; });
    if (ruta)
        ruta.sinIdioma = true;
    else
        ruta = findRoute(req, res);
    if (!ruta.id) {
        if (res.headersSent)
            return;
        setRoute(req, res, ruta, url);
        return next('route');
    }
    if (ruta) {
        if (idiomas.idiomas && !ruta.sinIdioma)
            evalRuta(req, res, ruta.languages[idiomas.lng], ruta.router);
        else
            evalRuta(req, res, ruta, ruta.router);
    }
    setRoute(req, res, ruta, url);
    next('route');
}
function setData(parent, info, property) {
    if (parent[property] !== undefined)
        info[property] = parent[property];
}
function setDefault(parent, property) {
    let result = {};
    if (!parent)
        return result;
    if (parent[property])
        result = parent[property];
    if (idiomas.idiomas && parent.languages && parent.languages[idiomas.lng][property])
        return Object.assign({}, result, parent.languages[idiomas.lng][property]);
    return result;
}
function setDefaultProperty(parent, property) {
    if (!parent)
        return '';
    if (idiomas.idiomas && parent.languages && parent.languages[idiomas.lng][property])
        return parent.languages[idiomas.lng][property];
    if (parent[property])
        return parent[property];
    return '';
}
function setGroups() {
    groups_1.default.clear();
    if (map.groups) {
        for (let name in map.groups) {
            for (let item of map.groups[name]) {
                groups_1.default.addItem(name, item, idiomas.idiomas ? idiomas.actives : false);
            }
        }
    }
}
function setRoute(req, res, ruta, url) {
    let info = {};
    if (ruta) {
        info.content = ruta.content;
        info.id = ruta.id;
        info.parent = ruta.parent || 0;
        info.noIndex = ruta.noIndex || false;
        info.description = setDefaultProperty(ruta, 'description');
        info.router = Object.assign({}, ruta.router);
        info.breadcrumb = breadcrumb(ruta);
        alternate(ruta, info);
    }
    info.url = url;
    info.lng = idiomas.lng;
    info.meta = Object.assign({}, setDefault(map, 'meta'), setDefault(ruta, 'meta'));
    info.og = Object.assign({}, setDefault(map, 'og'), setDefault(ruta, 'og'));
    info.twitter = Object.assign({}, setDefault(map, 'twitter'), setDefault(ruta, 'twitter'));
    setData(map, info, 'xDefault');
    setData(map, info, 'dnsPrefetch');
    setData(map, info, 'scripts');
    res.locals.__route = info;
    res.locals.__server = Object.assign({}, server);
    res.locals.__groups = groups_1.default;
    res.locals.__device = new device_1.Device(String(req.get('User-Agent')));
    res.locals.t = Object.assign({}, idiomas.t[idiomas.lng]);
}
function setServer(app) {
    server.name = app.__args.serverName;
    server.localPort = app.get('port');
    server.protocol = app.__args.protocol;
    server.serverName = `${server.protocol}://${server.name}`;
}
function sitemap() {
    let sitemap = [];
    for (let ruta of map.contents) {
        if (ruta.noIndex)
            continue;
        let url = {};
        if (idiomas.idiomas) {
            let locs = 0;
            url.id = ruta.id;
            url.loc = {};
            for (let lng in idiomas.actives) {
                if (ruta.languages && ruta.languages[lng]) {
                    if (ruta.languages[lng].redirect)
                        continue;
                    url.loc[lng] = `/${lng}${urlToLink(ruta.languages[lng].url)}`;
                    locs++;
                }
            }
            if (!locs)
                continue;
        }
        else {
            if (ruta.redirect)
                continue;
            url.loc = `/${urlToLink(String(ruta.url))}`;
        }
        if (ruta.sitemap) {
            if (ruta.sitemap.changefreq)
                url.changefreq = ruta.sitemap.changefreq;
            if (ruta.sitemap.lastmod)
                url.lastmod = ruta.sitemap.lastmod;
            if (ruta.sitemap.priority)
                url.priority = ruta.sitemap.priority;
        }
        sitemap.push(url);
    }
    return sitemap;
}
exports.sitemap = sitemap;
function urlToLink(url) {
    return url ? url.replace(/\/(\w+)?:(.*?)$/, '') : '';
}
exports.urlToLink = urlToLink;
function validarIdioma(req, res) {
    // Si la url no trae idioma lo añade y lo redirige habria que analizar mejor este comportamiento
    if (!req.url) {
        res.redirect('/' + idiomaNavegador(req));
        return false;
    }
    if (!req.url.match(/^\/\w\w(\/|$)/)) {
        res.redirect('/' + idiomaNavegador(req) + req.url);
        return false;
    }
    idiomas.lng = req.url.substr(1, 2);
    if (!idiomas.actives[idiomas.lng]) {
        res.redirect('/' + idiomaNavegador(req));
        return false;
    }
    return true;
}
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
