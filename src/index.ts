import * as httpHandler from './httpHandler';
import {ImageCollection} from "./imageCollection";
import {firebaseConfig} from "./firebaseConfig";
import {FileDate} from "./FileDate";
import {drives} from "./driveConfig";
import {drive} from "./drive";


console.log('drive indexer started');
Promise.all(drives.map(config => new drive(config.key, config.folder).driveResult))
    .then(async results => {
        const collection = new ImageCollection();
        results.map(driveResult => collection.addImages(driveResult.files, driveResult.apiKey));
        //  await uploadAll(collection);
        await uploadToday(collection);
    }).then(() => console.log("data grabbed and processed ;)"))
    .catch(err => console.error(err));

async function uploadToday(collection: ImageCollection) {
    const dateToday = FileDate.fromDate(new Date());
    const today = collection.getDateNode(dateToday);
    //console.log(`${firebaseConfig.baseUrl}/data/${dateToday.year}/data/${dateToday.month}/data/${dateToday.day}.json?print=silent`)
    await httpHandler.put({
        url: `${firebaseConfig.baseUrl}/data/${dateToday.year}/data/${dateToday.month}/data/${dateToday.day}.json?print=silent`,
        body: JSON.stringify(today)
    });
}

async function uploadAll(collection: ImageCollection) {
    try {
        console.log('updating');
        const data = collection.serialize();
        await httpHandler.put({
            url: `${firebaseConfig.url}?print=silent`,
            body: JSON.stringify(data)
        });
        console.log("updated: " + firebaseConfig.url);
    }
    catch (e) {
        console.error(e);
    }
}
