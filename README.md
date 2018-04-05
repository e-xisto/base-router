# @e-xisto/base-router

Enrutador externo para Express. Carga un mapa de rutas definido en json o yaml y crea el enrutador.

## Como Usarlo
---------

Instalar el módulo

```bash
npm install @e-xisto/base-router
```

Usarlo:

``` js
const baseRouter = require ('@e-xisto/base-router');

// Configurarlo
baseRouter.configure ({ path: __dirname, map: args.map });
```

Crea una variable ``__base`` con la información del servidor.

```javascript
Por definir
```

Crea una variable ``__route`` con la información de la ruta.

```javascript
interface route {
    alternate?: linkAlternate [];
    content?: string;
    dnsPrefetch?: string [];
    id?: number;
    lng?: boolean | string;
    meta?: meta;
    noIndex?: boolean;
    og?: og;
    router?: router;
    scripts?: scripts;
    twitter?: twitter;
    url?: string;
    xDefault?: string;
}


interface linkAlternate {
    lang: string;
    href: string;
}


interface meta {
    canonical?: string;
    descripcion?: string;
    keywords?: string;
    title?: string;
}


interface og {
    admin?: string;
    app_id?: string;
    author?: string;
    description?: string;
    image?: string;
    locale?: string;
    site_name?: string;
    title?: string;
    type?: string;
    url?: string;
}


interface router {
    route?: string;
    view?: string;
}


interface scripts {
    googleAnalytics?: string;
    googleSiteVerification?: string;
	googleTagManager?: string;
}


interface twitter {
    card?: string;
    creator?: string;
    description?: string;
    image?: string;
    site?: string;
    title?: string;
    url?: string;
}

```

## Variables de configuración

## Getting Started
|Variable|Description|
|--|--|
|path|Ruta de la aplicación, esta variable es obligatoria e indica la ruta donde empezar a localizar el mapa y las rutas estáticas.|
|map|Nombre del fichero del mapa. Debe estar localizado en el path o ser una ruta relativa al path. Por defecto tiene el valor `map.json`|
|pathRoutes|Ruta de la la carpeta de rutas. Por defecto `[path]/routes`|
|routes|Nombre del fichero de rutas. Por defecto `routes.js`|


## Ejemplo de mapa de rutas en yaml

```yaml
languages:
    -   path: es
        text: Español
        active: true

    -   path: en
        text: English
        active: true
        default: true

content:
    -   content: 'Contenido 1'
        id: 1
        parent: 0
        languages:
            es:
                url: /contenido-1
                description: Descripcion
            en:
                url: /content-1
        router:
            route: /ruta1
            view: vista1

    -   content: 'Contenido 2'
        id: 2
        languages:
            es:
                url: /contenido-2
                description: Descripcion
            en:
                url: /content-2
        router:
            route: /ruta1
            view: vista1

    -   content: 'Contenido 3'
        id: 3
        languages:
            es:
                url: /contenido-3
                redirect: /contenido-1
                description: Descripcion
            en:
                url: /content-2
                redirect: /content-1

    -   content: Categorias
        id: 5
        languages:
            es:
                url: '/categorias/:id(\\d+)?'
            en:
                url: /categorys/:id(\\d+)?
        router:
            route: /categorias
            view: vista-categorias
```


## Ejemplo de mapa de rutas en json

```json
{
	"languages": [
		{
			"path": "es",
			"text": "Español",
			"active": true
		},
		{
			"path": "en",
			"text": "English",
			"active": true,
            "default": true
		}
    ],
	"content": [
		{
			"content": "Contenido 1",
			"id": 1,
            "parent": 0,
			"languages": {
					"es": {
							"url": "/contenido-1",
                            "description": "descripcion"
						},
					"en": {
							"url": "/content-1"
						}
				},
			"router": {
					"route": "/ruta1",
					"view": "vista1"
				}
		},
		{
			"content": "Contenido 2",
			"id": 2,
			"languages": {
					"es": {
							"url": "/contenido-2"
						},
					"en": {
							"url": "/content-2"
						}
				},
            "description": "descripcion",
			"router": {
					"route": "/ruta1",
					"view": "vista1"
				}
		},
		{
			"content": "Categorias",
			"id": 5,
			"languages": {
								"es": {
									"url": "/categorias/:id(\\d+)?",
                                    "description": "descripcion"
								},
								"en": {
									"url": "/categorys/:id(\\d+)?"
								}
				},
			"router": {
							"route": "/categorias",
							"view":  "vista-categorias"
				}
		}
	]
}
```



