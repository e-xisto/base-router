# Changelog


## [1.1.4] - 2018-04-26
- Variable serverName añadida a __server, que concatena protocolo y nombre del servidor @atrinidad
- La variable breadcrum ahora se llama breadcrumb @atrinidad
- Enlaces sin patrones @atrinidad


## [1.1.3] - 2018-04-19
- Eliminar dependencia de chalk
- Se solucionan las urls parametrizadas con expresiones
- Se solucionan los links cuando tienen parametros eliminando los parametros
- Se propaga la información de la ruta cuando hay un error
- Al recargar el mapa también recarga los grupos

## [1.1.2] - 2018-04-19 @cesaregarcia
- Se crean los grupos
- Se corrige el mapa yaml
- Se añade la variable protocol a __server
- Se separan las definiciones de tipo por fichero
- Se añade una variable global __server con la información del servidor.
- Añadir la propiedad parent a la ruta


## [1.1.1] - 2018-04-05
### Add
- Se normaliza la información de la ruta.

## [1.1.0] - 2018-03-15
### Added
- Se añade la propiedad default al lenguaje para que coja un idioma por defecto sin tener que ser el primero.
- Optimización de ejecución de código.
- Opción de poder añadir identificadores a la url para parametros dinámicos.

### Fixed
- Parámetros en el enrutado dinámico.

### Deleted
- Se elimina la propiedad exp de las rutas del mapa

## [1.0.3] - 2018-03-01
### Added
- Acepta ficheros YAML @cesaregarcia
- Se añade el atributo redirect al mapa.

### Fixed
- Error si no existe el mapa de rutas @cesaregarcia

## [1.0.2] - 2018-02-22
### Fixed
- El punto de entrada estaba mal definido en el package.json @cesaregarcia

## [1.0.1] - 2018-02-22
### Added
- Versión inicial del componente @cesaregarcia

