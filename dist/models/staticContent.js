"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pathToRegexp = require('path-to-regexp');
class StaticContent {
    constructor(url) {
        this.url = url;
        this.keys = [];
        this.path = pathToRegexp(this.url, this.keys);
        this.keysLength = this.keys.length;
    }
    match(url) {
        return this.path.exec(url);
    }
} // end class
exports.StaticContent = StaticContent;
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
