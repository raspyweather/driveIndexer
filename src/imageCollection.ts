export class ImageCollection {
    public addImages(files: { id: string, name: string }[], apiKey: string) {
        const apiKeyIdx = ImageCollection.addIfNotExist(this.apiKeys, apiKey);
        files.forEach(file => this.addImage(file, apiKeyIdx));
    }

    private static noaaRegex1 = new RegExp(/noaa-\d{2}-\d{12}-\w{1,13}\.jpg/);

    private addImage(file: { id: string, name: string }, apiKeyIndex: number) {
        const {name, id} = file;
        if (ImageCollection.noaaRegex1.test(name)) {
            const satelliteName = name.substr(0, 7);
            const date = ImageCollection.parseDateYYYYMMDDhhmm(name.substr(8, 12));
            const mode = name.substring(21, name.indexOf(".jpg"));

            const satelliteIdx = ImageCollection.addIfNotExist(this.satellites, satelliteName);
            const modeIdx = ImageCollection.addIfNotExist(this.imageModes, mode);

            const node = this.getOrCreateDataNode(date);
            node.push({
                modeIdx,
                satelliteIdx,
                apiKeyIndex,
                id
            });
            return;
        }
        console.log("unknown format:" + JSON.stringify(file));
    }

    private getOrCreateDataNode(date: Date): any {
        if (!this.data) {
            console.log("this.data undefined!" + this.data);
            throw new Error();
        }
        if (!date) {
            console.log(`date is undef:${date}`);
        }
        if (Object.prototype.hasOwnProperty.call(this.data, date.valueOf())) {
            return this.data[date.valueOf()];
        }
        return this.data[date.valueOf()] = [];
    }

    private static parseDateYYYYMMDDhhmm(dateToParse: string): Date {
        if (!dateToParse.match(/\d{12}/g)) {
            console.error(`Data format mismatch: ${dateToParse}`);
            throw new Error();
        }
        const year = parseInt(dateToParse.substr(0, 4));
        const months = parseInt(dateToParse.substr(4, 2));
        const days = parseInt(dateToParse.substr(6, 2));
        const hours = parseInt(dateToParse.substr(8, 2));
        const minutes = parseInt(dateToParse.substr(10, 2));

        const date = new Date();
        date.setUTCFullYear(year, months, days);
        date.setUTCHours(hours, minutes);
        return date;
    }

    private static addIfNotExist(collection: any[], element: any): number {
        const idx = collection.indexOf(element);
        if (idx !== -1) {
            return idx;
        }
        collection.push(element);
        return collection.indexOf(element);
    }

    private apiKeys: string[] = [];
    private data: ImageCollectionItem = Object.create(null);
    private imageModes: string[] = [];
    private satellites: string[] = [];
}