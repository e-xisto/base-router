"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
let grupos;
function contentGroup(content, idiomas) {
    let result = {};
    if (content.languages && idiomas) {
        for (let lng in idiomas) {
            if (content.languages[lng]) {
                result[lng] = contentGroupData(content.languages[lng], lng);
            }
        }
    }
    else
        result = contentGroupData(content, '');
    return result;
}
function contentGroupData(content, lng) {
    let item = {};
    let url = content.url ? main_1.urlToLink(content.url) : '';
    item.description = content.description;
    if (lng)
        item.link = `/${lng}${url}`;
    else
        item.link = url;
    return item;
}
function findContent(item) {
    let content = main_1.contentById(item.id);
    if (!content) {
        console.log(`\n\x1b[31mNo se encuentra el cotenido ${item.id} ${item.content}\x1b[0m\n`);
        return {};
    }
    return content;
}
function itemData(item, idiomas) {
    let content = contentGroup(findContent(item), idiomas);
    if (item.items) {
        content.items = [];
        for (let subitem of item.items)
            content.items.push(itemData(subitem, idiomas));
    }
    return content;
}
function itemsGroup(grupo, idioma) {
    let result = {};
    if (idioma)
        result = Object.assign({}, grupo[idioma]);
    else
        result = Object.assign({}, grupo);
    if (grupo.items) {
        result.items = [];
        for (let item of grupo.items)
            result.items.push(itemsGroup(item, idioma));
    }
    return result;
}
class Grupos {
    constructor() {
        grupos = [];
    }
    addItem(grupo, item, idiomas) {
        if (!grupos[grupo])
            grupos[grupo] = [];
        grupos[grupo].push(itemData(item, idiomas));
    }
    clear() {
        grupos = [];
    }
    items(name) {
        // Todo se puede optimizar guardando la información estáticamente
        let idioma = main_1.lng().lng;
        let items = [];
        if (!grupos[name])
            return [];
        for (let grupo of grupos[name]) {
            items.push(itemsGroup(grupo, idioma));
        }
        return items;
    }
} // end Grupos
let groups = new Grupos();
exports.default = groups;
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
