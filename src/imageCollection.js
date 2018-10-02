"use strict";
exports.__esModule = true;
var ImageCollection = /** @class */ (function () {
    function ImageCollection() {
        this.apiKeys = [];
        this.data = Object.create(null);
        this.imageModes = [];
        this.satellites = [];
    }
    ImageCollection.prototype.addImages = function (files, apiKey) {
        var _this = this;
        var apiKeyIdx = ImageCollection.addIfNotExist(this.apiKeys, apiKey);
        files.forEach(function (file) { return _this.addImage(file, apiKeyIdx); });
    };
    ImageCollection.prototype.addImage = function (file, apiKeyIndex) {
        var name = file.name, id = file.id;
        if (ImageCollection.noaaRegex1.test(name)) {
            var satelliteName = name.substr(0, 7);
            var date = ImageCollection.parseDateYYYYMMDDhhmm(name.substr(8, 12));
            var mode = name.substring(21, name.indexOf(".jpg"));
            var satelliteIdx = ImageCollection.addIfNotExist(this.satellites, satelliteName);
            var modeIdx = ImageCollection.addIfNotExist(this.imageModes, mode);
            var node = this.getOrCreateDataNode(date);
            node.push({
                modeIdx: modeIdx,
                satelliteIdx: satelliteIdx,
                apiKeyIndex: apiKeyIndex,
                id: id
            });
            return;
        }
        console.log("unknown format:" + JSON.stringify(file));
    };
    ImageCollection.prototype.getOrCreateDataNode = function (date) {
        if (!this.data) {
            console.log("this.data undefined!" + this.data);
            throw new Error();
        }
        if (!date) {
            console.log("date is undef:" + date);
        }
        if (Object.prototype.hasOwnProperty.call(this.data, date.valueOf())) {
            return this.data[date.valueOf()];
        }
        return this.data[date.valueOf()] = [];
    };
    ImageCollection.parseDateYYYYMMDDhhmm = function (dateToParse) {
        if (!dateToParse.match(/\d{12}/g)) {
            console.error("Data format mismatch: " + dateToParse);
            throw new Error();
        }
        var year = parseInt(dateToParse.substr(0, 4));
        var months = parseInt(dateToParse.substr(4, 2));
        var days = parseInt(dateToParse.substr(6, 2));
        var hours = parseInt(dateToParse.substr(8, 2));
        var minutes = parseInt(dateToParse.substr(10, 2));
        var date = new Date();
        date.setUTCFullYear(year, months, days);
        date.setUTCHours(hours, minutes);
        return date;
    };
    ImageCollection.addIfNotExist = function (collection, element) {
        var idx = collection.indexOf(element);
        if (idx !== -1) {
            return idx;
        }
        collection.push(element);
        return collection.indexOf(element);
    };
    ImageCollection.noaaRegex1 = new RegExp(/noaa-\d{2}-\d{12}-\w{1,13}\.jpg/);
    return ImageCollection;
}());
exports.ImageCollection = ImageCollection;
