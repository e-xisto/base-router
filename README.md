# @e-xisto/base-router

Base-router es el enrutador personalizado configurado por defecto en nuestra esctructura de [proyecto BASE](https://github.com/e-xisto/base). Este router nos permite, mediante la carga de un archivo de configuración tipo YAML (o JSON opcionalmente), definir la arquitectura de contenidos y enrutado de nuestro website.



### Índice de contenidos

- [Esquema de funcionamiento](#esquema-de-funcionamiento)
- [Instalación y configuración](#instalación)
- [Forzar la recarga del mapa](#recarga-de-mapa)
- [Mapa (map.yaml)](./docs/mapa.md)
- [Variables](./docs/variables.md)
- [Métodos](./docs/metodos.md)
- [Routes](./docs/routes.md)
- [Notas de revisión y TODOs](#Notas-de-revisión-y-TODOs)



### Esquema de funcionamiento



![Diagrama funcionamiento](./docs/base-router.png)

Base-router actúa como middleware recibiendo todas las peticiones URL que llegan a nuestro servidor express. Para cada petición, realiza una consulta a nuestro mapa de configuración (`map.yaml`) y comprueba si la URL recibida está definida o no en él. Si la URL está definida en nuestro mapa le pedirá a express que se encargue de renderizar la respuesta indicándole que configuración de router y vista que debe utilizar. Si la ruta no existe en el mapa, el servidor devolverá como respuesta un error.

Además de la configuración de router y vista, base-router inyecta diferentes variables que definen propiedades del servidor, de la ruta recibida, información de los elementos de menús que podemos representar y los idiomas o traducciones de nuestro website.



### Instalación

El primer paso consiste en instalar el paquete dentro de nuestro proyecto:

```bash
npm install @e-xisto/base-router
```



### Configuración

En el archivo de configuración de nuestra aplicación express incluiremos:

```javascript
const baseRouter = require ('@e-xisto/base-router');

// Configurar e iniciar nuestro router
baseRouter.configure ({ path: __dirname, map: 'map.yaml' });
```



Opciones de configuración:

| Variable                   | Description                                                  |
| :------------------------- | ------------------------------------------------------------ |
| **path**                   | Ruta de la aplicación, esta variable es obligatoria e indica la ruta donde empezar a localizar el mapa y las rutas estáticas. |
| map                        | Nombre del fichero del mapa. Debe estar localizado en el path o ser una ruta relativa al path. Por defecto tiene el valor `map.yaml` |
| pathRoutes                 | Ruta de la la carpeta de rutas. Por defecto `[path]/routes`  |
| [routes](./docs/routes.md) | Nombre del fichero de rutas. Por defecto `routes.js`         |

Un ejemplo de configuración básica para nuestra aplicación express sería:

```javascript
// Archivo /server.js

const express      = require ('express');
const http         = require('http');
const debug        = require('debug');
const path         = require ('path');
const cookieParser = require ('cookie-parser');
const bodyParser   = require ('body-parser');
const nunjucks     = require ('nunjucks');

// Requerimos nuestro enrutador
const baseRouter   = require ('@e-xisto/base-router');

// Iniciamos nuestra aplicación express
const app  = module.exports = express ();

// Capturamos el puerto por defecto o lo capturamos de la variable de entorno
const port = normalizePort (process.env.PORT || '3000');

// Seteamos una pariable con el puerto
app.set ('port', port);

// Congiguramos nuestro motor de plantillas
app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

nunjucks.configure('views', {
  autoescape: true,
  noCache: true,
  express   : app
});

// Parseamos las peticiones recibidas con un middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Parseamos los accesos a las cookies
app.use(cookieParser());

// Configuramos nuestra carpeta de contenido público
app.use(express.static(path.join(__dirname, 'public')));

// Configuramos nuestro router
baseRouter.configure ({ path: __dirname, map: app.__args.map });

// Cartura de errores 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Función para normalizar el puerto
function normalizePort (val) {

    var port = parseInt (val, 10);

  if (isNaN (port)) return val;
  if (port >= 0) return port;
  return false;
}

// Event listener for HTTP server "error" event
function onError(error) {

    if (error.syscall !== 'listen') throw error;

    let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// Event listener for HTTP server "listening" event.
function onListening() {

    let addr = server.address();
    let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

    console.log ("\n\x1b[32mAplicación escuchando en el puerto " + addr.port + "\x1b[0m\n");

    debug('Listening on ' + bind);
}

```



### Recarga de mapa

Si realizamos cambios sobre nuestro archivo de mapa podemos forzar la carga del mapa sin necesidad de reiniciar nuestro servidor web. Para ello existe una URL reservada:

```
> https://www.nombrededominio.com/map-reload

> localhost:3000/map-reload
```





------

#### Notas de revisión y TODOs

- (2018-04-26) Por qué no incluir xDefault dentro de languages
- (2018-04-26) Script se debería abrir para cargar cualquier otro script que sea necesario o al menos corregir el de tagmanager
- (2018-04-26) En la canonical debemos escribir la url completa?
- (2018-04-26) Debemos marcar las propiedades obligatorias
- (2018-04-26) Qué pasa si no se define lenguages
- (2018-04-26) En un redirect el description es obligatorio?
- (2018-05-3) En router igualar usar la / al definir la ruta de la vista y el route a cargar. Probar navegación
- (2018-05-3) Sustituir en groups el content: por un comentario (ver [link](https://stackoverflow.com/questions/2276572/how-do-you-do-block-comment-in-yaml))
- (2018-05-3) Especificar mejor el xDefault sobre todo si no se incluye
- (2018-05-3) Para diferenciar las etiquetas denominaria contents: y dentro content:
- (2018-05-3) El código de tagmanager debe situarse justo después del body y además se debe incluir un código adicional que da google al final del html
- (2018-05-10) Dentro de la variable __route existe el parámetro link o es redirect



Versión 0.1.0 (2018-05-10)