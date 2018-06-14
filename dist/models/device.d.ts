export declare class Device {
    private userAgent;
    private device;
    readonly bot: boolean;
    readonly car: boolean;
    readonly desktop: boolean;
    readonly phone: boolean;
    readonly tablet: boolean;
    readonly tv: boolean;
    readonly type: string;
    constructor(userAgent: string);
    private isType(type);
    private getType();
}
