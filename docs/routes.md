# Routes

El trabajo de nuestro router no es otro que procesar las peticiones que recibe el servidor y elegir qué ruta o  `route` interna debe cargar según la configuración indicada en nuestro [mapa](./mapa.md).

Para que esto sea posible debemos definir nuestro mapa de rutas disponibles. Para ello definimos un archivo de rutas (por defecto `/routes/routes.js`) donde asociaremos las rutas disponibles y el script de enrutado que finalmente pasaremos a nuestro servidor para renderizar la petición.

Un ejemplo de nuestro archivo de rutas:

```javascript
// Archivo /routes/routes.js

module.exports = function (app) {

// Carga de rutas
app.use ('/sitemap', require ('./sitemap'));
app.use ('/template', require ('./template'));
app.use ('/editor', require ('./editor'));
app.use ('/home', require ('./home'));
app.use ('/noticias', require ('./noticias'));
app.use ('/proyectos', require ('./proyectos'));

// En este caso no necesitamos vincular a una ruta
app.use (require ('./breadcrumb'));

}
```

En este ejemplo definimos una ruta `/template` que podremos incluir en nuestro [mapa](./mapa.md) y que asociamos a la carga de nuestro archivo de enrutado de express `/routes/template.js` .

Nuestro archivo de enrutado podría quedar de la siguiente forma:

```javascript
// Archivo /routes/template.js

const router = require ('express').Router ();

router.get ('/', function (req, res, next) {
	res.render (res.locals.__route.router.view);
});

module.exports = router;
```

La estructura de nuestros archivo de enrutado será siempre muy similar. Primero requerimos express y los módulos o complementos que necesitemos, definimos las variantes de respuesta de nuestro router y por último exportamos el router.

Podemos comprobar que hemos usado la variable local `res.locals.__route.router.view`

Esta variable nos devuelve el nombre de la vista que hemos configurado para la ruta en el mapa.

Nuestro enrutador expone 3 variables locales que podemos usar en la configuración del nuestro router y en la vista. Estas variables son `res.locals.__route`, `res.locals.__server` y  `res.locals.__groups`.

Para saber más sobre estas variables consultar la sección [Variables](./variables.md).

Un ejemplo de configuración de router más compleja podría ser el de unas noticias:

```javascript
const router = require ('express').Router ();
const api = require ('../src/services/api');

router.get ('/:id(\\d+)', function (req, res, next) {

	api.get('/noticias/' + req.params.id).then((response) => {
		res.render ('noticias-detalle', { noticia: response.data });
	}).catch( (e) => {
		console.log(e);
		next();
	});
});

router.get ('/', function (req, res, next) {

	api.get('/noticias').then((response) => {
		res.render (res.locals.__route.router.view, { noticias: response.data });
	}).catch( (e) => {
		console.log(e);
		next();
	});
});

module.exports = router;
```

En este ejemplo, hemos configurado 2 posibles respuestas en nuestro router. Según los parámetros que recibamos en nuestra petición ([Mirar guía routing express](http://expressjs.com/en/guide/routing.html)) configuramos la respuesta para mostrar un listado de noticias:

````javascript
router.get ('/', function (req, res, next) { ... });
````

o para mostrar una noticia concreta:

```javascript
router.get ('/:id(\\d+)', function (req, res, next) { ... });
```

En ambos casos realizamos una llamada a una API externa que nos devuelve el listado o el detalle de una notícia específica. Una vez dispongamos de la respuesta de la API procedemos a renderizar nuestra vista enviándole como parámetro la respuesta obtenida.

En un caso definimos la vista de forma expresa:

```javascript
res.render ('noticias-detalle', { noticia: response.data });
```

En el otro seleccionamos la vista configurada en el mapa:

```javascript
res.render (res.locals.__route.router.view, { noticias: response.data });
```


