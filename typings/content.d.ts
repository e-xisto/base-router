
import { Router } from './router';
import { Sitemap } from './sitemap';

export interface Content {
    content: string;
    description: string
    id: number;
    keys?: Array<any>;
    keysLength?: number;
    languages?: any;
    noIndex: boolean
    path?: any;
    redirect?: string;
    router?: Router;
    sinIdioma?: boolean;
    sitemap?: Sitemap
    url?: string;
}
