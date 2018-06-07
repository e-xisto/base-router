
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
    router?: Router;
    sitemap?: Sitemap
    url?: string;
}
