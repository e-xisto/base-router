/// <reference types="express" />
import * as express from 'express';
import * as baseRouter from '../typings/base-router';
declare function configure(app: express.Express, options: any): void;
declare function contentById(id: number): any;
declare function lng(): baseRouter.Languages;
declare function sitemap(): Array<baseRouter.SitemapItem>;
declare function urlToLink(url: string): string;
export { configure, contentById, lng, urlToLink, sitemap };
