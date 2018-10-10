import * as httpHandler from './httpHandler';
import {ImageCollection} from "./imageCollection";
import {drive} from "./drive";
import {drives} from "./driveConfig";
import {firebaseConfig} from "./firebaseConfig";

console.log('drive indexer started');
httpHandler.get({url: firebaseConfig.url})
    .then(result => {
        const collection = new ImageCollection();
        console.log(Object.keys(JSON.parse(result).data).length);
        console.log("stuff added");
        Promise.all(drives.map(config => new drive(config.key, config.folder).driveResult))
            .then(results =>
                results.map(driveResult => collection.addImages(driveResult.files, driveResult.apiKey)))
            .then(() => console.log("data grabbed and processed ;)"))
            .then(async () =>
                await httpHandler.put({
                    url: `${firebaseConfig.url}?print=silent`,
                    body: JSON.stringify(collection)
                })
            ).then(x => console.log("success:" + x + " dt" + Object.keys(JSON.parse(JSON.stringify(collection)).data).length + " notadded:" + ImageCollection.notAddedCounter)).catch(err => console.error(err));
    }).catch(err => console.error(err));

