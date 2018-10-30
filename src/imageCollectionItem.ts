import { FileDate } from "./FileDate";

export interface ImageCollectionYear {
    year: number;
    data: { [key: number]: ImageCollectionMonth };
}
export interface ImageCollectionMonth {
    month: number;
    data: { [key: number]: ImageCollectionDay };
}
export interface ImageCollectionDay {
    day: number;
    date: FileDate;
    data: { [key: number]: ImageCollectionEntry[] };
    apiKeys: string[];
}

export interface ImageCollectionEntry {
    hourMinute: number;
    satelliteName: string;
    apiKey: string;
    modeName: string;
    id: string;
}

