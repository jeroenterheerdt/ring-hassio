"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
require("dotenv/config");
var ring_client_api_1 = require("ring-client-api");
var util_1 = require("util");
var fs = require('fs'), path = require('path'), express = require('express');
//const ffmpeg_static = require('ffmpeg-static')
//console.log('FFmpeg dir: '+ffmpeg_static.path)
/**
 * This example creates an hls stream which is viewable in a browser
 * It also starts web app to view the stream at http://localhost:3000
 **/
function example() {
    return __awaiter(this, void 0, void 0, function () {
        var ringApi, camera, app, publicOutputDirectory, sipSession;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ringApi = new ring_client_api_1.RingApi({
                        // Replace with your ring email/password
                        email: process.env.RING_EMAIL,
                        password: process.env.RING_PASS,
                        // Refresh token is used when 2fa is on
                        refreshToken: process.env.RING_REFRESH_TOKEN,
                        debug: true
                    });
                    return [4 /*yield*/, ringApi.getCameras()];
                case 1:
                    camera = (_a.sent())[0];
                    if (!camera) {
                        console.log('No cameras found');
                        return [2 /*return*/];
                    }
                    app = express(), publicOutputDirectory = path.join('public', 'output');
                    app.use('/', express.static('public'));
                    app.listen(3000, function () {
                        console.log('Listening on port 3000.  Go to http://localhost:3000 in your browser. Probably opening http://localhost:3000/output/stream.m3u8 in VLC will work better.');
                    });
                    return [4 /*yield*/, util_1.promisify(fs.exists)(publicOutputDirectory)];
                case 2:
                    if (!!(_a.sent())) return [3 /*break*/, 4];
                    return [4 /*yield*/, util_1.promisify(fs.mkdir)(publicOutputDirectory)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, camera.streamVideo({
                        output: [
                            '-preset',
                            'veryfast',
                            '-g',
                            '25',
                            '-sc_threshold',
                            '0',
                            '-f',
                            'hls',
                            '-hls_time',
                            '2',
                            '-hls_list_size',
                            '6',
                            '-hls_flags',
                            'delete_segments',
                            path.join(publicOutputDirectory, 'stream.m3u8')
                        ]
                    })];
                case 5:
                    sipSession = _a.sent();
                    sipSession.onCallEnded.subscribe(function () {
                        //console.log('Call has ended')
                        //process.exit()
                        example();
                    });
                    setTimeout(function () {
                        //console.log('Stopping call...')
                        //sipSession.stop()
                        example();
                    }, 5 * 60 * 1000); // Stop after 5 minutes.
                    return [2 /*return*/];
            }
        });
    });
}
try {
    while (true) {
        example();
    }
}
catch (e) {
}
finally {
    while (true) {
        example();
    }
}
