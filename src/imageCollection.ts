import {FileDate, NoaaFileParser} from "./FileDate";

export class ImageCollection {
    public addImages(files: { id: string, name: string }[], apiKey: string) {
        const apiKeyIdx = ImageCollection.addIfNotExist(this.apiKeys, apiKey);
        files.forEach(file => this.addImage(file, apiKeyIdx));
    }


    private addImage(file: { id: string, name: string }, apiKeyIdx: number) {
        const {id} = file;
        try {
            const noaaData = NoaaFileParser.parse(file.name);

            const satelliteIdx = ImageCollection.addIfNotExist(this.satellites, noaaData.satelliteName);
            const modeIdx = ImageCollection.addIfNotExist(this.imageModes, noaaData.mode);

            const node = this.getOrCreateDataNode(noaaData.date);

            if (node.some(item => item.modeIdx === modeIdx &&
                    item.satelliteIdx === satelliteIdx &&
                    item.apiKeyIdx === apiKeyIdx
                )) {
                ImageCollection.notAddedCtr++;
                return;
            }
            node.push({
                modeIdx,
                satelliteIdx,
                apiKeyIdx,
                id
            });
            return;

        } catch (e) {
            console.log({e: JSON.stringify(e), file});
        }

    }

    private getOrCreateDataNode(date: FileDate) {
        if (!this.data) {
            console.log("this.data undefined!" + this.data);
            throw new Error();
        }
        if (!date) {
            console.log(`date is undef:${date}`);
        }
        if (Object.prototype.hasOwnProperty.call(this.data, date.getIdentifier())) {
            return this.data[date.getIdentifier()];
        }
        return this.data[date.getIdentifier()] = [];
    }

    private static addIfNotExist(collection: any[], element: any): number {
        const idx = collection.indexOf(element);
        if (idx !== -1) {
            this.notAddedCtr++;
            return idx;
        }
        collection.push(element);
        return collection.indexOf(element);
    }


    public setInitialData(data: { apiKeys: string[], data: any, imageModes: string[], satellites: string[] }) {
        if (this.apiKeys === undefined || this.apiKeys.length > 0) {
            throw "Cannot set initial to a dirty ImageCollection";
        }
        this.apiKeys = data.apiKeys;
        this.data = data.data;
        this.imageModes = data.imageModes;
        this.satellites = data.satellites;
    }

    private static notAddedCtr: number = 0;


    public static get notAddedCounter(): number {
        return ImageCollection.notAddedCtr;
    }

    private apiKeys: string[] = [];
    private data: ImageCollectionItem = Object.create(null);
    private imageModes: string[] = [];
    private satellites: string[] = [];
}