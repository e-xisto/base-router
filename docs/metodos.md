# Métodos

Hay cierta información que el enrutador nos puede proporcionar pero que no queremos que sea analizada y devuelta en cada petición. Para ello se exponen ciertos métodos que nos devuelven información relevante.

Los métodos expuestos son los siguientes: configure, contentById, lng, urlToLink, sitemap

| Variable              | Parametros | Devuelve    | Descripción |
| --------------------- | ---------- | ----------- | :------------------------------------------------------ |
| [contentById(id)](#contentById(id)) | Number | Objeto | Devuelve el objeto contenido que se corresponde con **id** |
| [configure(options)](#configure(options)) | Objeto | void | Dado un objecto de opciones, configura la aplicación |
| [lng()](#lng())       | | Objeto  | Contiene información sobre los lenguajes y el lenguaje activo |
| [sitemap()](#sitemap()) | | Objeto  | Devuelve el objeto que representa el sitemap básico de la aplicación basado en la  |
| [urlToLink(url)](#urlToLink(url)) | String | String  | Limpia la url de parámetros express |

Si nos hiciera falta, en algún router, por ejemplo, podemos importar el objeto baseRouter.

```javascript
const baseRouter = require ('@e-xisto/base-router');
```

Y así ya tenemos acceso a los métodos
```javascript
let lngActivo = baseRouter.lng().lng;
```

## contentById(id)

Este método nos permite recuperar del árbol de contenidos urls para reutilizarlas, por ejemplo, para anidar contenido.

```javascript
const baseRouter = require ('@e-xisto/base-router');

const idNoticias = 5;

class Noticia {

	constructor(data){
		this.data = data;
	}

	link(lng) {
		if (!lng) lng = baseRouter.lng().lng;
		if (!this.ruta) {
			this.ruta = baseRouter.contentById(idNoticias);
		}
		//TODO friendly url
		let titular = encodeURI(this.data.titular) ;
		return `/${lng}${this.ruta.languages[lng].link}/${this.data.id}/${titular}`;
	}

	item() {
		return baseRouter.contentById(idNoticias);
	}

}
module.exports = Noticia;
```


## configure(app, options)

Como ya hemos visto en la introducción, este método configura la aplicación. options, Admite los siguientes parámetros en el objeto json que recibe:

| Variable      | Description                                                  |
| :------------ | ------------------------------------------------------------ |
| **path**      | Ruta de la aplicación, esta variable es obligatoria e indica la ruta donde empezar a localizar el mapa y las rutas estáticas. |
| mapName       | Nombre del fichero del mapa. Debe estar localizado en el path o ser una ruta relativa al path. Por defecto tiene el valor `map.yaml` |
| pathLanguages | Ruta donde se colocan los .json de las traducciones en nuestro proyecto. Por defecto `[path]/public/lang/` |

## lng()

Esta variable incluye información sobre los idiomas.

| Propiedad           | Tipo   | Descripción                                                  |
| ------------------- | ------ | ------------------------------------------------------------ |
| lng | String | Idioma actual |
| actives | [String]  | Array de cadenas representando los idiomas activos disponibles en la aplicación |


## sitemap()

Devuelve array que representa el sitemap básico basado en el map.yaml de la aplicación.

Cada item del array será de la forma

| Propiedad           | Tipo   | Descripción                                                  |
| ------------------- | ------ | ------------------------------------------------------------ |
| changefreq          | String | Opcional, representa la etiqueta changefreq |
| id                  | Number | Id del contenido en el mapa |
| lastmod             | String | Opcional, representa la etiqueta lastmod (fecha de última modificación) |
| loc             | String | Url del sitio |
| priority             | Number | Valor de la prioridad del sitio, entre 0 y 1 |


## urlToLink(url)

Devuelve la cadena limpiada de parámetros express

```javascript
console.log(baseRouter.urlToLink('/noticias/:id')); //imprime por consola "/noticias"
```
