# Variables

Base-router expone de forma pública diferentes variables que contiene infomación sobre la petición recibida en nuestro servidor web, y a las que podemos acceder a nivel de programación de nuestro router y de la vista que queremos cargar para renderizar.

Las variables expuestas son las siguiente:

| Variable              | Tipo   | Descripción                                                  |
| --------------------- | ------ | :----------------------------------------------------------- |
| [__server](#__server) | Objeto | Contiene la información del servidor web: Puerto, nombre de dominio, protocolo y SeverName. |
| [__route](#__route)   | Objeto | Incluye toda la información de la ruta que se está cargando. Si el website es multilíngue, la información contenida únicamente será la del idioma activo. |
| [__groups](#__groups) | Objeto | Almacena todas las agrupaciones de contenido definidas en el mapa que nos facilitará representar diferentes menús de navegación. Ver configuración de `groups` en mapa ([link](#groups)) |

A nivel de vista, en nuestra plantilla HTML, la carga de variables es directa ( `__route` ):

```javascript
<script> console.log({{ __route.router.view }}) </script>
```

Desde la configuración del  router de express debemos invocarla como parte de las variables tipo locals del  router (Ej:  `.res.locals.__route` ):

```javascript
res.locals.__route.router.view
```



## __server

Esta variable incluye información sobre la instancia del servidor web.

| Propiedad           | Tipo   | Descripción                                                  |
| ------------------- | ------ | ------------------------------------------------------------ |
| __server.localPort  | Número | Puerlo local de la instancia del servidor.                   |
| __server.name       | Texto  | Nombre de dominio del servidor. En modo desarrollo será `localhost` y en modo producción devolverá un texto tipo: `www.midominio.com` |
| __server.protocol   | Texto  | El tipo de protocolo del website: `http` o `https`           |
| __server.serverName | Texto  | Esta propiedad simplemente uno dos de las anteriormente definidas: `__server.protocol` y `__server.name`. De forma que devolverá algo parecido a `https://www.midominio.com` |



## __route

Toda la información de la ruta cargada se almacena dentro de esta variable.

| Propiedad           | Tipo           | Descripción                                                  |
| ------------------- | -------------- | ------------------------------------------------------------ |
| __route.alternate   | Array          | Este array de objetos contiene todas las declaraciones de URLs alternativas por idioma. |
| __route.breadcrumb  | Array          | En este array de objetos se almacena la miga de pan de la ruta cargada. Para obtener la miga de pan no se tienen en cuenta las agrupaciones de contenidos definidas en `groups` pues únicamente se establecen las relaciones según la propiedad `parent` de cada ruta. |
| __route.content     | Texto          | Descripción de la ruta. Solo se utiliza como comentario o descripción para identificar el contenido. |
| __route.description | Texto          | Descripción del contenido. Si el website el multilíngüe esta propiedad contendrá la descripción en el idioma elegido. |
| __route.dnsPrefetch | Array          | Dentro de este array se almacenan las cadenas de texto con los dominios sobre los que realizar la precarga de DNS. |
| __route.id          | Número         | Identificador único del contenido cargado. Nos servirá para cargar contenido dinámico o condicionar la carga del website. |
| __route.link        | Objeto         | Dentro de este objeto se almacenan los enlaces absolutos por idiomas disponibles en el website. La utilidad de esta propiedad es poder realizar el cambio de idioma manteniendo el contenido cargado. Los enlaces no incluyen protocolo o nombre de dominio. |
| __route.lng         | False \| Texto | Si no existe configuración de idiomas en nuestro website esta propiedad devolverá `false` y en el caso de que se definan idiomas contendrá una cadena de texto con el idioma cargado en formato (Ver [ISO 639-1](https://es.wikipedia.org/wiki/ISO_639-1)) |
| __route.meta        | Objeto         | Este objeto contiene la información de los metadatos de la ruta en el idioma activo. |
| __route.noIndex     | Booleano       | Esta propiedad no indica si la ruta cargada debemos configurarla para que sea indexada por los motores de búsqueda. Esta propiedad será tenida en cuenta al renderizar la vista y el sitemap del website. |
| __route.og          | Objeto         | Configuración de Facebook Open Graph. Si la web es multilíngüe solo incluirá la información en el idioma cargado. |
| __route.parent      | Número         | `id` del contenido padre. Esta propiedad será tenida en cuenta para generar la miga de pan ( `__route.breadcrumb` ) |
| __route.router      | Objeto         | Este objeto contiene la vista y el router que debemos cargar para esta ruta en nuestro servidor web en express. |
| __route.scripts     | Objeto         | Contiene los scripts que habitualmente incluimos en nuestros websites (Google Analytics, Google Tag Manager…). Este objeto está abierto y permite incluir nuevos scripts. |
| __route.twitter     | Objeto         | Configuración de Twitter Card. Si la web es multilíngüe solo incluirá la información en el idioma cargado. |
| __route.url         | Texto          | URL absoluta del contenido cargado. Incluye el idioma pero no incluye protocolo o nombre de dominio. |
| __route.xDefatult   | Texto          | Define el atributo "hreflang" con valor "x-default" lo que nos permitirá auto-redireccionar al idioma que elijamos por defecto. |



## __groups

Los grupos de menús definidos en nuestro `map.yaml` quedan expuestos dentro de esta variable.

Cada uno de nuestros menús se identifica como una clave dentro de este objeto (**menu**) y contiene un array donde cada elemento tiene las siguientes propiedades:

| Propiedad                 | Tipo  | Descripción                                                  |
| ------------------------- | ----- | ------------------------------------------------------------ |
| __groups.menu.description | Texto | Texto que utilizaremos para representar la opción de menú en nuestra vista. Si el website es multilíngüe solo incluirá la información del idioma cargado. |
| __groups.menu.link        | Texto | Incluye la URL que sirve de enlace para la opción de menú. Si el website es multilíngüe solo incluirá la información del idioma cargado. |
| __groups.menu.items       | Array | Si exiten anidaciones dentro de una opción de menú se incluirán dentro de este array con el mismo esquema (descripción + link + items) |
