"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Device {
    constructor(userAgent) {
        this.userAgent = userAgent;
        console.log(userAgent);
    }
    get bot() { return this.isType('bot'); }
    ;
    get car() { return this.isType('car'); }
    ;
    get desktop() { return this.isType('desktop'); }
    ;
    get phone() { return this.isType('phone'); }
    ;
    get tablet() { return this.isType('tablet'); }
    ;
    get tv() { return this.isType('tv'); }
    ;
    get type() { return this.getType(); }
    ;
    isType(type) {
        return type == this.getType();
    }
    getType() {
        if (!this.device)
            this.device = require('device')(this.userAgent);
        return this.device.type;
    }
} // end class
exports.Device = Device;
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
