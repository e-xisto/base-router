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

Crea una variable ``__server`` con la información del servidor.

```javascript
interface server {
    localPort?: number;
    name?: string;
    serverName?: string;
    protocol?: string;
}
```

Crea una variable ``__route`` con la información de la ruta.

```javascript
interface route {
    alternate?: baseRouter.linkAlternate [];
    breadcrumb?: any [];
    content?: string;
    description?: string;
    dnsPrefetch?: string [];
    id?: number;
    link?: any;
    lng?: boolean | string;
    meta?: baseRouter.meta;
    noIndex?: boolean;
    og?: baseRouter.og;
    parent?:number;
    router?: baseRouter.router;
    scripts?: baseRouter.scripts;
    twitter?: baseRouter.twitter;
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
    es:
        text: Español
        active: true
        meta:
            title: t
            description: s language
        og:
            app_id:
            admin:
            url:
            type:
            title:
            image:
            description:
            site_name:
            locale:
            author:
        twitter:
            card:
            title:
            description:
            image:

    en:
        text: English
        active: true
        default: false

groups:
    menu:
        -   id: 1
            content: Contenido 1
        -   id: 2
            content: Contenido 2
            items:
                -   id: 5
                    content: Contenido 5
                    items:
                        -   id: 5
                            content: Contenido 5
                        -   id: 19
                            content: Contenido 9
                -   id: 9
                    content: Contenido 9
    pie:
        -   id: 3
            content: Contenido 3

xDefault: /es

dnsPrefetch:
    - //www.youtube.com
    - //www.twitter.com

scripts:
    googleAnalytics:
    googleTagManager:
    googleSiteVerification:

meta:
    title: t,
    description: s,
    keywords: ddddd map

content:
    -   content: Sitemap
        id: 1
        languages:
            es:
                url: /sitemap.xml
                description: Sitemap
            en:
                 url: /sitemap.xml
        router:
            route: /sitemap

    -   content: Inicio
        id: 10
        languages:
            es:
                url: /
                meta:
                    title: inicio tt
            en:
                url: /
        description: inicio2
        url: /
        router:
            route: /template
            view: home

    -   content: Sobre nosotros
        id: 2
        languages:
            es:
                description: Sobre nosotros
                url: /sobre-nosotros
                meta:
                    title: Sobre nosotros
                    description:
                    keywords: palabraclave1 palabraclave2
                    canonical: /es/sobre-nosotros
            en:
                description: About us
                url: /about-us
                meta:
                    title: About us
                    description:
                    keywords: keyword1 keyword2
                    canonical:
        url: /sobre
        router:
            route: /editor
            view: editor
        noIndex: true

    -   content: Servicios
        id: 3
        languages:
            es:
                description: Servicios
                url: /servicios
                meta:
                    title: Servicios
                    keywords: palabraclave1 palabraclave2
            en:
                description: Services
                url: /services
                meta:
                    title: Services
                    keywords: keyword1 keyword2
        router:
            route: /editor
            view: editor

    -   content: Noticias
        id: 5
        languages:
            es:
                url: /noticias/:id(\\d+)?
                meta:
                    title: Noticias
                    keywords: noticiasclave1 noticiasclave2
            en:
                url: /news/:id(\\d+)?
                link: /news
                meta:
                    title: New
                    keywords: newslist1
        router:
            route: /noticias
            view: noticias

    -   content: Proyectos
        id: 8
        languages:
            es:
                url: /proyectos
                meta:
                    title: Proyectos
                    keywords: proyectosclave1
            en:
                url: /projects
                meta:
                    title: Projects
                    keywords: projectskeyword1
        router:
            route: /proyectos
            view: proyectos

    -   content: Contacto
        id: 9
        parent: 1
        languages:
            es:
                url: /contacto
                description: Contacto ES
                meta:
                    title: Contacto
                    keywords: contactoclave1
            en:
                url: /contact-us
                description: Contacto EN
                meta:
                    title: Contact us
                    keywords: contactkeyword1
        url: /contacto
        router:
            route: /template
            view: contacto

    -   content: Enlace
        id: 10
        languages:
            es:
                url: /enlace
                redirect: /sobre-nosotros
            en:
                url: /link
                redirect: https://www.google.com
                code: 410
```
