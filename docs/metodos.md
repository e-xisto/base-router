# Métodos

Hay cierta información que el enrutador nos puede proporcionar pero que no queremos que sea analizada y devuelta en cada petición. Para ello se exponen ciertos métodos que nos devuelven información relevante.

Los métodos expuestos son los siguientes:

| Variable              | Tipo    | Descripción                                                  |
| --------------------- | ------- | :----------------------------------------------------------- |
| [lng()](#lng())       | Objeto  | Contiene información sobre los lenguajes y el lenguaje activo |
| [sitemap()](#sitemap()) | Objeto  | Devuelve el objeto que representa el sitemap básico de la aplicación basado en la  |

Si nos hiciera falta, en algún router, por ejemplo, podemos importar el objeto baseRouter.

```javascript
const baseRouter = require ('@e-xisto/base-router');
```

Y así ya tenemos acceso a los métodos
```javascript
let lngActivo = baseRouter.lng().lng;
```



## lng()

## __server

Esta variable incluye información sobre los idiomas.

| Propiedad           | Tipo   | Descripción                                                  |
| ------------------- | ------ | ------------------------------------------------------------ |
| lng | String | Idioma actual |
| actives | [String]  | Array de cadenas representando los idiomas activos disponibles en la aplicación |


## sitemap()

Devuelve el sitemap básico basado en el map.yaml de la aplicación
