
import * as baseRouter from './base-router';

export interface route {
    alternate?: baseRouter.linkAlternate [];
    breadcrum?: any [];
    content?: string;
    description?: string;
    dnsPrefetch?: string [];
    id?: number;
    link?: any;
    lng?: boolean | string;
    meta?: baseRouter.meta;
    noIndex?: boolean;
    og?: baseRouter.og;
    parent?:number;
    router?: baseRouter.router;
    scripts?: baseRouter.scripts;
    twitter?: baseRouter.twitter;
    url?: string;
    xDefault?: string;
}
