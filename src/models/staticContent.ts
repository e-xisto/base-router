
const pathToRegexp = require ('path-to-regexp');


export class StaticContent {

	private keys: Array<any>;
	private path: any;
	private keysLength: number;


	public constructor (public url: string) {
		
		this.keys       = [];
		this.path       = pathToRegexp (this.url, this.keys);
		this.keysLength = this.keys.length;
	}


	public match (url: string): boolean {
		
		return this.path.exec (url);
	}

}	// end class




////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

