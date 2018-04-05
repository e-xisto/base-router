
import * as baseRouter from './index';

export interface route {
    alternate?: baseRouter.linkAlternate [];
    content?: string;
    description?: string;
    dnsPrefetch?: string [];
    id?: number;
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
