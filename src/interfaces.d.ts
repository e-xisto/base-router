

export interface idiomas {
    actives: {[key: string]: boolean};
    default: string;
    idiomas: boolean;
    lng:     string;
}


export interface linkAlternate {
    lang: string;
    href: string;
}


export interface meta {
    canonical?: string;
    descripcion?: string;
    keywords?: string;
    title?: string;
}


export interface og {
    admin?: string;
    app_id?: string;
    author?: string;
    description?: string;
    image?: string;
    locale?: string;
    site_name?: string;
    title?: string;
    type?: string;
    url?: string;
}


export interface route {
    alternate?: linkAlternate [];
    content?: string;
    dnsPrefetch?: string [];
    id?: number;
    lng?: boolean | string;
    meta?: meta;
    noIndex?: boolean;
    og?: og;
    router?: router;
    scripts?: scripts;
    twitter?: twitter;
    url?: string;
    xDefault?: string;
}


export interface router {
    route?: string;
    view?: string;
}


export interface scripts {
    googleAnalytics?: string;
    googleSiteVerification?: string;
	googleTagManager?: string;
}


export interface twitter {
    card?: string;
    creator?: string;
    description?: string;
    image?: string;
    site?: string;
    title?: string;
    url?: string;
}
