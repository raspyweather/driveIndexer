import {FileDate, NoaaFileParser} from "./FileDate";
import {
    ImageCollectionDay,
    ImageCollectionEntry,
    ImageCollectionMonth,
    ImageCollectionYear
} from "./imageCollectionItem";

export class ImageCollection {
    constructor() {
        this.data = <ImageCollectionData>{
            data: {},
            dates: [],
            meta: {
                apiKeys: [],
                imageModes: [],
                satellites: []
            }
        };
    }

    public addImages(files: { id: string, name: string }[], apiKey: string) {
        files.forEach(file => this.addImage(file, apiKey));
    }


    private addImage(file: { id: string, name: string }, apiKey: string) {
        const {id} = file;
        try {

            const noaaData = NoaaFileParser.parse(file.name);
            ImageCollection.addIfNotExist(this.data.meta.apiKeys, apiKey);
            ImageCollection.addIfNotExist(this.data.meta.satellites, noaaData.satelliteName);
            ImageCollection.addIfNotExist(this.data.meta.imageModes, noaaData.mode);

            const node = this.getOrCreateDateNode(noaaData.date);
            const times = Object.keys(node.data);
            //        const fileDateIdentifier = noaaData.date.getIdentifier();
            const hhmm = noaaData.date.hour * 100 + noaaData.date.minute;
            const item = times.find(time => Number.parseInt(time) === hhmm);
            if (item === undefined || item === null) {
                ImageCollection.addIfNotExist(this.data.dates, noaaData.date);
                node.data[hhmm] = [{
                    apiKey,
                    hourMinute: hhmm,
                    id: file.id,
                    modeName: noaaData.mode,
                    satelliteName: noaaData.satelliteName
                }];
                return;
            }
            else {
                if (node.data[hhmm].some(entry => entry.modeName === noaaData.mode &&
                    entry.satelliteName === noaaData.satelliteName && entry.id !== id)) {
                    const obj = node.data[hhmm].find(entry => entry.modeName === noaaData.mode &&
                        entry.satelliteName === noaaData.satelliteName && entry.id !== id) || <ImageCollectionEntry>{};
                    console.log(({
                        'duplicate': 'https://docs.google.com/uc?id=' + obj.id,
                        'to': 'https://docs.google.com/uc?id=' + id
                    }))
                    return;
                }
                if (node.data[hhmm].some(item =>
                    item.modeName === noaaData.mode &&
                    item.satelliteName === noaaData.satelliteName &&
                    item.apiKey === apiKey &&
                    item.id === id
                )) {
                    console.log({'Already added': item});
                    return;
                }

                node.data[hhmm].push({
                    apiKey,
                    hourMinute: hhmm,
                    id: file.id,
                    modeName: noaaData.mode,
                    satelliteName: noaaData.satelliteName
                });
            }
            return;
        } catch (e) {
            console.log({e: e.toString(), file});
        }
    }

    public getDateNode(date: FileDate) {
        const yearData = this.data.data[date.year] ||
            (this.data.data[date.year] = <ImageCollectionYear>{
                year: date.year,
                data: {}
            });
        const monthData = yearData.data[date.month] ||
            (yearData.data[date.month] = <ImageCollectionMonth>{
                month: date.month,
                data: {}
            });
        const dayData = monthData.data[date.day] ||
            (monthData.data[date.day] = <ImageCollectionDay>{
                apiKeys: this.data.meta.apiKeys,
                day: date.day,
                date: date,
                data: {}
            });
        return dayData;
    }

    private getOrCreateDateNode(date: FileDate) {
        if (!this.data) {
            console.log("this.data undefined!" + this.data);
            throw new Error();
        }
        if (undefined === date || date === null) {
            console.log(`date is undef:${date}`);
            throw new Error();
        }
        return this.getDateNode(date);
    }

    private static addIfNotExist(collection: any[], element: any): number {
        const idx = collection.indexOf(element);
        if (element === null || element === undefined) {
            throw new Error();
        }
        if (idx !== -1) {
            this.notAddedCtr++;
            return idx;
        }
        collection.push(element);
        return collection.indexOf(element);
    }


    public setInitialData(data: ImageCollectionData) {
        this.data = data || <ImageCollectionData>{
            data: {},
            meta: {
                apiKeys: [],
                imageModes: [],
                satellites: []
            },
            dates: []
        };
        if (this.data.data === undefined || this.data.data === null) {
            this.data.data = {};
        }
        if (this.data.dates === undefined || this.data.dates === null) {
            this.data.dates = [];
        }
        if (this.data.meta === undefined || this.data.meta === null) {
            this.data.meta = {
                apiKeys: [],
                imageModes: [],
                satellites: []
            };
        }
        else {
            if (this.data.meta.satellites === undefined || this.data.meta.satellites === null) {
                this.data.meta.satellites = [];
            }
            if (this.data.meta.imageModes === undefined || this.data.meta.imageModes === null) {
                this.data.meta.imageModes = [];
            }
            if (this.data.meta.apiKeys === undefined || this.data.meta.apiKeys === null) {
                this.data.meta.apiKeys = [];
            }
        }

    }

    private static notAddedCtr: number = 0;

    public static get notAddedCounter(): number {
        return ImageCollection.notAddedCtr;
    }
    public serialize(){
        return this.data;
    }

    private data: ImageCollectionData;
}

export interface ImageCollectionData {
    data: { [key: number]: ImageCollectionYear };
    dates: string[];
    meta: {
        apiKeys: string[]
        imageModes: string[]
        satellites: string[]
    };
}