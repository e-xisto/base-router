
export interface SitemapItem {
    changefreq?: string;
    lastmod?: string;
    loc: string | Array<string>;
    priority?: number;
}
