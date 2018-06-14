export declare class StaticContent {
    url: string;
    private keys;
    private path;
    private keysLength;
    constructor(url: string);
    match(url: string): boolean;
}
