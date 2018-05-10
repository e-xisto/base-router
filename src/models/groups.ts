
import { GroupItem } from '../interfaces/group-item';
import { GroupItemData } from '../interfaces/group-item-data';
import { Groups } from '../interfaces/groups';
import { contentById, lng, urlToLink } from '../main';


let grupos: any [any];


function contentGroup (content: any, idiomas: any): GroupItemData {

	let result: GroupItemData = {};

	if (content.languages && idiomas) {
		for (let lng in idiomas) {
			if (content.languages [lng]) {
				result [lng] = contentGroupData (content.languages [lng], lng);
			}
		}
	} else result = contentGroupData (content, '');
	return result;
}


function contentGroupData (content: any, lng: string): GroupItemData {

	let item: GroupItemData = {};
	let url: string = content.url ? urlToLink(content.url) : '';

	item.description = content.description;
	if (lng) item.link = `/${ lng }${ url }`;
	else item.link = url;

	return item;
}


function findContent (item: any) {

	let content = contentById (item.id);

	if (! content) {
		console.log (`\n\x1b[31mNo se encuentra el cotenido ${ item.id } ${ item.content }\x1b[0m\n`);
		return {};
	}

	return content;
}


function itemData (item: GroupItem, idiomas: any) {

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


	public constructor () {

		grupos = [];
	}


	public addItem (grupo: string, item: GroupItem, idiomas: any) {

		if (! grupos [grupo]) grupos [grupo] = [];
		grupos [grupo].push (itemData (item, idiomas));
	}


	public clear () {

		grupos = [];
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

}	// end Grupos


let groups = new Grupos ();

export default groups as Groups;

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

