
export interface Idiomas {
    actives: {[key: string]: boolean};
    default: string;
    idiomas: boolean;
    lng:     string;
    t:       {[key: string]: {[key: string]: string}};
}
