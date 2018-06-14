

export class Device {

	private device: any;
	
	public get bot (): boolean { return this.isType ('bot'); };
	public get car (): boolean { return this.isType ('car'); };
	public get desktop (): boolean { return this.isType ('desktop'); };
	public get phone (): boolean { return this.isType ('phone'); };
	public get tablet (): boolean { return this.isType ('tablet'); };
	public get tv (): boolean { return this.isType ('tv'); };
	public get type (): string { return this.getType (); };


	public constructor (private userAgent: string) { }


	private isType (type: string): boolean {

		return type == this.getType ();
	}
	
	
	private getType (): string {
	
		if (! this.device) this.device = require('device')(this.userAgent);
		return this.type;
	}


}	// end class


////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

