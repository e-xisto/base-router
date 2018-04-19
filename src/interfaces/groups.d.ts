
export interface Groups {
	[key: string]: any;
	addItem (grupo: string, item: any, idiomas: any): void;
	items (name: string): any;
}