
import * as baseRouter from './base-router';

export interface Route {
    alternate?: baseRouter.LinkAlternate [];
    breadcrumb?: any [];
    content?: string;
    description?: string;
    dnsPrefetch?: string [];
    id?: number;
    link?: any;
    lng?: boolean | string;
    meta?: baseRouter.Meta;
    languages?: string [];
    noIndex?: boolean;
    og?: baseRouter.Og;
    parent?:number;
    router?: baseRouter.Router;
    scripts?: baseRouter.Scripts;
    twitter?: baseRouter.Twitter;
    url?: string;
    xDefault?: string;
}
