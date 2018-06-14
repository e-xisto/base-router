import * as baseRouter from '../typings/base-router';
declare function configure(options: any): void;
declare function contentById(id: number): any;
declare function lng(): string;
declare function sitemap(): Array<baseRouter.SitemapItem>;
declare function urlToLink(url: string): string;
export { configure, contentById, lng, urlToLink, sitemap };
