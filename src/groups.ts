
import { Groups } from './interfaces/groups';
import { contentById, lng } from './main';

const chalk = require('chalk');


let grupos: any [any];


function contentGroup (content: any, idiomas: any): any {

	let result: any = {};

	if (content.languages && idiomas) {
		for (let lng in idiomas) {
			if (content.languages [lng]) {
				result [lng] = contentGroupData (content.languages [lng], lng);
			}
		}
	} else result = contentGroupData (content, '');
	return result;
}


function contentGroupData (content: any, lng: string) {

	let result: any = {};

	result.description = content.description;
	if (lng) result.link = `/${ lng }${ content.url }`;
	else result.link = content.url;

	return result;
}


function findContent (item: any) {

	let content = contentById (item.id);

	if (! content) {
		console.log (chalk.red (`\nNo se encuentra el cotenido ${ item.id } ${ item.content }\n`));
		return {};
	}

	return content;
}


function itemData (item: any, idiomas: any) {

	let content = contentGroup (findContent (item), idiomas);
	if (item.items) {
		content.items = [];
		for (let subitem of item.items)
			content.items.push (itemData (subitem, idiomas));
	}
	return content;
}


function itemsGroup (grupo: any, idioma: string): any {

	let result: any = {};

	if (idioma) result = {...grupo [idioma]};
	else result = {...grupo};

	if (grupo.items) {
		result.items = [];
		for (let item of grupo.items)
			result.items.push (itemsGroup (item, idioma));
	}
	return result;
}


class Grupos implements Groups {

	get grupos (): any { return grupos; };

	public constructor () {

		grupos = [];
	}


	public addItem (grupo: string, item: any, idiomas: any) {

		if (! grupos [grupo]) grupos [grupo] = [];
		grupos [grupo].push (itemData (item, idiomas));
	}


	public items (name: string): any {

		// Todo se puede optimizar guardando la información estáticamente
		let idioma: string = lng ();
		let items: any []  = [];

		if (! grupos [name]) return [];
		for (let grupo of grupos [name]) {
			items.push (itemsGroup (grupo, idioma));
		}
		return items;
	}
}


let groups = new Grupos ();

export default groups;

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

