
export interface SitemapItem {
    changefreq?: string;
    id: number;
    lastmod?: string;
    loc: string | Array<string>;
    priority?: number;
}
