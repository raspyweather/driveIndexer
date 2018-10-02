"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var XMLHttpRequest = require("./httpHandler");
var drive = /** @class */ (function () {
    function drive(apiKey, folderId) {
        this.apiKey = apiKey;
        this.folderId = folderId;
        this.fileList = [];
        this.finished = false;
        this.gettingFiles = this.getFiles();
    }
    drive.prototype.createListQuery = function (pageToken, folderId) {
        if (!pageToken) {
            pageToken = "";
        }
        return "https://www.googleapis.com/drive/v3/files?pageSize=1000&q=%27" + folderId + "%27+in+parents&key=" + this.apiKey + "&pageToken=" + pageToken;
    };
    Object.defineProperty(drive.prototype, "files", {
        get: function () {
            var _this = this;
            if (this.finished) {
                console.log("finished file");
                return new Promise(function () { return _this.fileList; });
            }
            return this.gettingFiles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(drive.prototype, "driveResult", {
        get: function () {
            var _this = this;
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = resolve;
                        _b = {};
                        return [4 /*yield*/, this.files];
                    case 1: return [2 /*return*/, _a.apply(void 0, [(_b.files = _c.sent(), _b.apiKey = this.apiKey, _b)])];
                }
            }); }); });
        },
        enumerable: true,
        configurable: true
    });
    drive.prototype.getFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var nextPageToken, previousToken, iteration, url, x, doc, _i, _a, z, E_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 5, , 6]);
                                    nextPageToken = "";
                                    previousToken = "";
                                    iteration = 0;
                                    console.log("downloading list-" + this.apiKey);
                                    _b.label = 1;
                                case 1:
                                    previousToken = nextPageToken;
                                    iteration = iteration + 1;
                                    process.stdout.write(".");
                                    url = this.createListQuery(nextPageToken, this.folderId);
                                    return [4 /*yield*/, XMLHttpRequest.get({ url: url })];
                                case 2:
                                    x = _b.sent();
                                    doc = JSON.parse(x);
                                    nextPageToken = doc.nextPageToken;
                                    for (_i = 0, _a = doc.files; _i < _a.length; _i++) {
                                        z = _a[_i];
                                        if (z) {
                                            this.fileList.push(z);
                                        }
                                    }
                                    _b.label = 3;
                                case 3:
                                    if (nextPageToken !== undefined || nextPageToken === previousToken) return [3 /*break*/, 1];
                                    _b.label = 4;
                                case 4:
                                    console.log("loaded!" + this.fileList.length + " from " + this.apiKey);
                                    this.finished = true;
                                    resolve(this.fileList);
                                    return [3 /*break*/, 6];
                                case 5:
                                    E_1 = _b.sent();
                                    console.trace("Error in getFiles " + E_1);
                                    this.finished = true;
                                    reject(E_1);
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return drive;
}());
exports.drive = drive;
