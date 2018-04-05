"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let grupos;
class Grupos {
    get grupos() { return grupos; }
    ;
    constructor() {
        console.log('xxxxxxx');
        grupos = [];
    }
    // public addGroup (name: string, value: any, find: any) {
    // 	grupos [name] = contentProperty (value, find);
    // }
    addItem(grupo, content, idiomas) {
        if (!content) {
            // Avisar
            return;
        }
        if (!grupos[grupo])
            grupos[grupo] = [];
        grupos.push(contentGroup(content, idiomas));
    }
}
function contentGroup(content, idiomas) {
    let result = {};
    // recorrer solo los idiomas activos
    if (content.languages) {
        for (let lng in idiomas) {
            if (content.languages[lng])
                // result.description = content.languages [lng].description || '';
                console.log(content.languages[lng].url);
        }
    }
    // console.log (content);
    // console.log (enri);
    // enri = 555;
    return result;
}
// function contentProperty (group: any, find: any): any {
//
// 	for (let p of group) {
// 		console.log (p);
// 		find (p.id);
// 	}
// }
let groups = new Grupos();
exports.default = groups;
// module.exports = groups;
