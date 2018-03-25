import * as httpHandler from './httpHandler';
import {ImageCollection} from "./imageCollection";
import {drive} from "./drive";
import {drives} from "./driveConfig";
import {firebaseConfig} from "./firebaseConfig";


const collection = new ImageCollection();

Promise.all(drives.map(config => new drive(config.key, config.folder).driveResult))
    .then(results =>
        results.map(driveResult => collection.addImages(driveResult.files, driveResult.apiKey)))
    .then(() => console.log("data grabbed and processed ;)"))
    .then(async () => await httpHandler.put({
        url: `${firebaseConfig.url}?print=silent`,
        body: JSON.stringify(collection)
    })).then(x => console.log("success:" + x)).catch(err => console.error(err));




