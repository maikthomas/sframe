/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./Client.js":
/*!*******************!*\
  !*** ./Client.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"SFrame\": () => (/* binding */ SFrame)\n/* harmony export */ });\n//Get worker url\n// const url = new URL(import.meta.url).pathname.replace(\"Client\",\"Worker\");\nurl = new URL(/* asset import */ __webpack_require__(/*! ./Worker.js?inline */ \"./Worker.js?inline\"), __webpack_require__.b);\n\n\n\n/**\n * SFrame library\n *  @namespace Sframe\n */\nconst SFrame =\n{\n\t/**\n\t * Create a new SFrame client context.\n\t *\n\t * This method will create client which communicates with web worker in which the SFrame context will be executed.\n\t * @memberof SFrame\n\t * @param {Number} senderId - Numeric id for this sender.\n\t * @param {Object} config - Congiguration parameters [Optional].\n\t * @param {Boolean} config.skipVp8PayloadHeader - Sends the vp8 payload header in clear (Note: it will be applied to all video frames as encoded chunks does not contain codec info yet).\n\t * @returns {Promise<Client>} Promise that resolves to the client object when the web worker is initialized.\n\t */\n\tcreateClient : async function(senderId,config)\n\t{\n\t\t//Create client\n\t\tconst client = new Client();\n\t\t//Init worker async\n\t\tawait client.init(senderId, config);\n\t\t//Return client\n\t\treturn client;\n\t}\n};\n\nasync function transferKey(key)\n{\n\tif (key instanceof CryptoKey && key.type==\"private\")\n\t\treturn await crypto.subtle.exportKey(\"pkcs8\", key);\n\tif (key instanceof CryptoKey)\n\t\treturn await crypto.subtle.exportKey(\"raw\", key);\n\tif (key instanceof Uint8Array)\n\t\treturn key.buffer.slice(0);\n\treturn key.slice(0);\n}\n\n\n/**\n * The SFrame client object which acts as a proxy for web worker context.\n */\nclass Client extends EventTarget\n{\n\t/**\n\t * @ignore\n\t * @hideconstructor\n\t * private constructor\n\t */\n\tconstructor()\n\t{\n\t\t super();\n\n\t\t//Create new worker\n\t\tthis.worker = new Worker(url, {type: \"module\"});\n\n\t\t//Cutrent transactions\n\t\tthis.transId = 1;\n\t\tthis.transactions = new Map();\n\n\t\t//Listen for worker messages\n\t\tthis.worker.addEventListener(\"message\",async (event)=>{\n\t\t\t//Get data\n\t\t\tconst data = event.data;\n\t\t\t//If it is a transaction response\n\t\t\tif (data.transId)\n\t\t\t{\n\t\t\t\t//Get transaction\n\t\t\t\tconst transaction = this.transactions.get(data.transId);\n\t\t\t\t//Delete transaction\n\t\t\t\tthis.transactions.delete(data.transId);\n\t\t\t\t//Check result\n\t\t\t\tif (data.error)\n\t\t\t\t    //Reject with error\n\t\t\t\t\ttransaction.reject(new Error(data.error));\n\t\t\t\telse\n\t\t\t\t\t//Resolve promise\n\t\t\t\t\ttransaction.resolve(data.result);\n\t\t\t} else if (data.event) {\n\t\t\t\t/**\n\t\t\t\t* The authenticated event will be fired when a new sender is received on the receiver.\n\t\t\t\t*\n\t\t\t\t* @name \"authenticated\"\n\t\t\t\t* @memberof Client\n\t\t\t\t* @kind event\n\t\t\t\t* @argument {String} id - The id for the associated RTCRtpReceiver\n\t\t\t\t* @argument {Number} senderId - The senderId of the authenticated sender received.\n\t\t\t\t*/\n\t\t\t\t//Create event\n\t\t\t\tconst event = new Event(data.event.name);\n\t\t\t\t//Set id and senderId\n\t\t\t\tevent.id\t= data.event.data.id;\n\t\t\t\tevent.senderId\t= data.event.data.senderId;\n\t\t\t\t//Disptach event\n\t\t\t\tthis.dispatchEvent(event);\n\t\t\t}\n\t\t});\n\t\t//Private method\n\t\tthis.postMessage = (cmd, args, transferList)=>{\n\t\t\t//Create new promise\n\t\t\treturn new Promise((resolve,reject)=>{\n\t\t\t\t//Get new transaction\n\t\t\t\tconst transId = this.transId++;\n\t\t\t\t//Sent to worker\n\t\t\t\tthis.worker.postMessage({transId,cmd,args},transferList);\n\t\t\t\t//Add it to pending transactions\n\t\t\t\tthis.transactions.set(transId,{resolve,reject});\n\t\t\t});\n\t\t};\n\t}\n\n\tasync init(senderId, config)\n\t{\n\t\treturn this.postMessage(\"init\", {senderId, config});\n\t}\n\n\t/**\n\t * Set the sender encryption key.\n\t *\n\t * @param {ArrayBuffer|Uint8Array|CryptoKey} key - 32 bytes encryption key. If the value is a CryptoKey the algorithm must be \"HKDF\".\n\t * @returns {Promise<void>} Promise which will be resolved when the key is set on the web worker.\n\t */\n\tasync setSenderEncryptionKey(key)\n\t{\n\t\tconst transfered = await transferKey(key);\n\t\treturn this.postMessage(\"setSenderEncryptionKey\", [transfered], [transfered]);\n\t}\n\n\t/**\n\t * Ratchert the sender encryption key.\n\t *\n\t * @returns {Promise<void>} Promise which will be resolved when the key is ratcheted on the web worker.\n\t */\n\tasync ratchetSenderEncryptionKey()\n\t{\n\t\treturn this.postMessage(\"ratchetSenderEncryptionKey\");\n\t}\n\n\t/**\n\t * Set the sender signing key.\n\t *\n\t * @param {ArrayBuffer|Uint8Array|CryptoKey} key - Private key used for singing. If the value is a CryptoKey the algorithm must be \"ECDSA\".\n\t * @returns {Promise<void>} Promise which will be resolved when the signing key is set on the web worker.\n\t */\n\tasync setSenderSigningKey(key)\n\t{\n\t\tconst transfered = await transferKey(key);\n\t\treturn this.postMessage(\"setSenderSigningKey\", [transfered]);\n\t}\n\n\t/**\n\t * Add receiver for a remote sender.\n\t *\n\t * @param {Number} receiverkKeyId - The remote senderId.\n\t * @returns {Promise<void>} Promise which will be resolved when the receiver is added on the web worker.\n\t */\n\tasync addReceiver(receiverkKeyId)\n\t{\n\t\treturn this.postMessage(\"addReceiver\", [receiverkKeyId]);\n\t}\n\n\t/**\n\t * Set the receiver encryption key associated to a remote sender.\n\t *\n\t * @param {Number} receiverkKeyId - The remote senderId.\n\t * @param {ArrayBuffer|Uint8Array|CryptoKey} key - 32 bytes encryption key. If the value is a CryptoKey the algorithm must be \"HKDF\".\n\t * @returns {Promise<void>} Promise which will be resolved when the key is set on the web worker.\n\t */\n\tasync setReceiverEncryptionKey(receiverkKeyId,key)\n\t{\n\t\tconst transfered = await transferKey(key);\n\t\treturn this.postMessage(\"setReceiverEncryptionKey\", [receiverkKeyId, transfered], [transfered]);\n\t}\n\n\t/**\n\t * Set the receiver signing key associated to a remote sender.\n\t *\n\t * @param {Number} receiverkKeyId - The remote senderId.\n\t * @param {ArrayBuffer|Uint8Array|CryptoKey} key - Private key used for singing. If the value is a CryptoKey the algorithm must be \"ECDSA\".\n\t * @returns {Promise<void>} Promise which will be resolved when the signing key is set on the web worker.\n\t */\n\tasync setReceiverVerifyKey(receiverkKeyId,key)\n\t{\n\t\tconst transfered = await transferKey(key);\n\t\treturn this.postMessage(\"setReceiverVerifyKey\", [receiverkKeyId, transfered], [transfered]);\n\t}\n\n\t/**\n\t * Remove receiver for a remote sender.\n\t *\n\t * @param {Number} receiverkKeyId - The remote senderId.\n\t * @returns {Promise<void>} Promise which will be resolved when the receiver is removed on the web worker.\n\t */\n\tdeleteReceiver(receiverkKeyId)\n\t{\n\t\treturn this.postMessage(\"deleteReceiver\", [receiverkKeyId]);\n\t}\n\n\t/**\n\t * Encrypt frames for a RTCRtpSender.\n\t *\n\t * @param {String} id - An unique identifier associated to this sender (for example transceiver.mid).\n\t * @param {RTCRtpSender} sender - The sender object, associated track must be not null.\n\t */\n\tasync encrypt(id,sender)\n\t{\n\t\t //We need the media kind until it is set as metadata on the chunk frame\n\t\tconst kind = sender.track.kind;\n\t\t//Get the sender insertable streams\n\t\tconst {readable: readableStream, writable: writableStream} = sender.createEncodedStreams ? sender.createEncodedStreams() :\n\t\t\tsender.createEncodedVideoStreams ? sender.createEncodedVideoStreams() : sender.createEncodedAudioStreams();\n\t\t//Pass to worker\n\t\treturn this.postMessage(\"encrypt\",\n\t\t\t{id, kind, readableStream, writableStream},\n\t\t\t[readableStream, writableStream]\n\t\t);\n\t}\n\n\t/**\n\t * Decrypt frames fpr a RTCPRtpReceiver.\n\t *\n\t * @param {String} id - An unique identifier associated to this sender (for example transceiver.mid), it will be used for the authentication and signing events.\n\t * @param {RTCRtpReceiver} receiver - The receiver object.\n\t */\n\tasync decrypt(id,receiver)\n\t{\n\t\t//We need the media kind until it is set as metadata on the chunk frame\n\t\tconst kind = receiver.track.kind;\n\t\t//Get the receiver insertable streams\n\t\tconst {readable: readableStream, writable: writableStream} = receiver.createEncodedStreams ? receiver.createEncodedStreams() :\n\t\t\treceiver.createEncodedVideoStreams ? receiver.createEncodedVideoStreams() : receiver.createEncodedAudioStreams();\n\t\t//Pass to worker\n\t\treturn this.postMessage(\"decrypt\",\n\t\t\t{id, kind, readableStream, writableStream},\n\t\t\t[readableStream, writableStream]\n\t\t);\n\t}\n\n\t/**\n\t * Close client and terminate web worker.\n\t */\n\tclose()\n\t{\n\t\t//Terminate worker\n\t\tthis.worker.terminate();\n\n\t\t//End all pending transactions\n\t\tfor (let transaction of this.transactions.values())\n\t\t\t//Reject with terminated error\n\t\t\ttransaction.reject(new Error(\"Client closed\"));\n\t\t//Clear transactions\n\t\tthis.transactions.clear();\n\t}\n};\n\n\n//# sourceURL=webpack://sframe/./Client.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Utils\": () => (/* reexport safe */ _lib_Utils__WEBPACK_IMPORTED_MODULE_0__.Utils),\n/* harmony export */   \"SFrame\": () => (/* reexport safe */ _Client__WEBPACK_IMPORTED_MODULE_1__.SFrame)\n/* harmony export */ });\n/* harmony import */ var _lib_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/Utils */ \"./lib/Utils.js\");\n/* harmony import */ var _Client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Client */ \"./Client.js\");\nasdsad\n;\n\n\n\n\n\n//# sourceURL=webpack://sframe/./index.js?");

/***/ }),

/***/ "./lib/Utils.js":
/*!**********************!*\
  !*** ./lib/Utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Utils\": () => (/* binding */ Utils)\n/* harmony export */ });\nconst Utils = \n{\n\ttoHex : function(buffer)\n\t{\n\t\treturn Array.prototype.map.call(buffer instanceof Uint8Array ? buffer : new Uint8Array (buffer), x =>x.toString(16).padStart(2,\"0\")).join(\"\");\n\t},\n\tfromHex: function(str)\n\t{\n\t\tconst bytes = [];\n\t\tfor (let i=0;i<str.length/2;++i)\n\t\t\tbytes.push(parseInt(str.substring(i*2, (i+1)*2), 16));\n\n\t\treturn new Uint8Array(bytes);\n\t},\n\tequals : function(a,b)\n\t{\n\t\tif (a.byteLength != b.byteLength) return false;\n\t\tfor (let i = 0 ; i != a.byteLength ; i++)\n\t\t\tif (a[i] != b[i]) return false;\n\t\treturn true;\n\t}\n};\n\n\n//# sourceURL=webpack://sframe/./lib/Utils.js?");

/***/ }),

/***/ "./Worker.js?inline":
/*!**************************!*\
  !*** ./Worker.js?inline ***!
  \**************************/
/***/ ((module) => {

eval("module.exports = \"data:application/javascript;base64,aW1wb3J0IHtDb250ZXh0fSBmcm9tICIuL2xpYi9Db250ZXh0LmpzIjsKaW1wb3J0IHtWUDhQYXlsb2FkSGVhZGVyfSAgZnJvbSAiLi9saWIvVlA4UGF5bG9hZEhlYWRlci5qcyI7CmltcG9ydCB7VXRpbHN9IGZyb20gIi4vbGliL1V0aWxzLmpzIjsKCmNsYXNzIFRhc2tRdWV1ZQp7Cgljb25zdHJ1Y3RvcigpCgl7CgkJdGhpcy50YXNrcyA9IFtdOwoJCXRoaXMucnVubmluZyA9IGZhbHNlOwoJfQoJCgllbnF1ZXVlKHByb21pc2UsY2FsbGJhY2ssZXJyb3IpCgl7CgkJLy9lbnF1ZXVlIHRhc2sKCQl0aGlzLnRhc2tzLnB1c2goe3Byb21pc2UsY2FsbGJhY2ssZXJyb3J9KTsKCQkvL1RyeSBydW4gCgkJdGhpcy5ydW4oKTsKCX0KCQoJYXN5bmMgcnVuKCkKCXsKCQkvL0lmIGFscmVhZHkgcnVubmluZyAKCQlpZiAodGhpcy5ydW5uaW5nKQoJCQkvL05vdGhpbmcKCQkJcmV0dXJuOwoJCS8vUnVubmluZwoJCXRoaXMucnVubmluZyA9IHRydWU7CgkJLy9SdW4gYWxsIHBlbmRpbmcgdGFza3MKCQl3aGlsZSh0aGlzLnRhc2tzLmxlbmd0aCkKCQl7CgkJCXRyeSB7CgkJCQkvL1dhaXQgZm9yIGZpcnN0IHByb21pc2UgdG8gZmluaXNoCgkJCQljb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnRhc2tzWzBdLnByb21pc2U7CgkJCQkvL1J1biBjYWxsYmFjawoJCQkJdGhpcy50YXNrc1swXS5jYWxsYmFjayhyZXN1bHQpOyAKCQkJfSBjYXRjaChlKSB7CgkJCQkvL1J1biBlcnJvciBjYWxsYmFjawoJCQkJdGhpcy50YXNrc1swXS5lcnJvcihlKTsgCgkJCX0KCQkJLy9SZW1vdmUgdGFzayBmcm9tIHF1ZXVlCgkJCXRoaXMudGFza3Muc2hpZnQoKTsKCQl9CgkJLy9FbmRlZAoJCXRoaXMucnVubmluZyA9IGZhbHNlOwoJfQp9CmxldCBjb250ZXh0OyAKCm9ubWVzc2FnZSA9IGFzeW5jIChldmVudCkgPT4gewoJLy9HZXQgZGF0YQoJY29uc3Qge3RyYW5zSWQsY21kLGFyZ3N9ID0gZXZlbnQuZGF0YTsKCQoJdHJ5IHsKCQlsZXQgcmVzdWx0ID0gdHJ1ZTsKCQkKCQkvL0RlcGVuZGluZyBvbiB0aGUgY21kCgkJc3dpdGNoKGV2ZW50LmRhdGEuY21kKQoJCXsKCQkJY2FzZSAiaW5pdCI6CgkJCXsKCQkJCS8vR2V0IGluZm8KCQkJCWNvbnN0IHtzZW5kZXJJZCwgY29uZmlnfSA9IGFyZ3M7CgkJCQkvL0NyYXRlIGNvbnRleHQKCQkJCWNvbnRleHQgPSBuZXcgQ29udGV4dChzZW5kZXJJZCwgY29uZmlnKTsKCQkJCWJyZWFrOwoJCQl9CgkJCWNhc2UgImVuY3J5cHQiOgoJCQl7CgkJCQkvL1RoZSByZWNyeXB0IHF1ZXVlCgkJCQljb25zdCB0YXNrcyA9IG5ldyBUYXNrUXVldWUoKTsKCQkJCS8vR2V0IGV2ZW50IGRhdGEKCQkJCWNvbnN0e2lkLCBraW5kLCByZWFkYWJsZVN0cmVhbSwgd3JpdGFibGVTdHJlYW19ID0gYXJnczsKCQkJCS8vQ3JlYXRlIHRyYW5zZm9ybSBzdHJlYW0gZm9vIGVuY3J5cHRpbmcKCQkJCWNvbnN0IHRyYW5zZm9ybVN0cmVhbSA9IG5ldyBUcmFuc2Zvcm1TdHJlYW0oewoJCQkJCXRyYW5zZm9ybTogYXN5bmMgKGNodW5rLCBjb250cm9sbGVyKT0+ewoJCQkJCQkvL05vdGhpbmcgaW4gY2xlYXIKCQkJCQkJbGV0IHNraXAgPSAwOwoJCQkJCQkvL0NoZWNrIGlmIGl0IGlzIHZpZGVvIGFuZCB3ZSBhcmUgc2tpcHBpbmcgdnA4IHBheWxvYWQgaGVhZGVyCgkJCQkJCWlmIChraW5kPT0idmlkZW8iICYmIGNvbnRleHQuaXNTa2lwcGluZ1ZwOFBheWxvYWRIZWFkZXIoKSkKCQkJCQkJewoJCQkJCQkJLy9HZXQgVlA4IGhlYWRlcgoJCQkJCQkJY29uc3QgdnA4ID0gVlA4UGF5bG9hZEhlYWRlci5wYXJzZShjaHVuay5kYXRhKTsKCQkJCQkJCS8vU2tpcCBpdAoJCQkJCQkJc2tpcCA9IHZwOC5ieXRlTGVuZ3RoOwoJCQkJCQl9CgkJCQkJCS8vRW5xdWV1ZSB0YXNrCgkJCQkJCXRhc2tzLmVucXVldWUgKAoJCQkJCQkJY29udGV4dC5lbmNyeXB0KGtpbmQsIGlkLCBjaHVuay5kYXRhLCBza2lwKSwKCQkJCQkJCShlbmNyeXB0ZWQpID0+IHsKCQkJCQkJCQkvL1NldCBiYWNrIGVuY3J5cHRlZCBwYXlsb2FkCgkJCQkJCQkJY2h1bmsuZGF0YSA9IGVuY3J5cHRlZC5idWZmZXI7CgkJCQkJCQkJLy93cml0ZSBiYWNrCgkJCQkJCQkJY29udHJvbGxlci5lbnF1ZXVlKGNodW5rKTsKCQkJCQkJCX0sCgkJCQkJCQkoZXJyb3IpPT57CgkJCQkJCQkJLy9UT0RPOiBoYW5kbGUgZXJyb3JzCgkJCQkJCQl9CgkJCQkJCSk7CgkJCQkJfQoJCQkJfSk7CgkJCQkvL0VuY3J5cHQKCQkJCXJlYWRhYmxlU3RyZWFtCgkJCQkJLnBpcGVUaHJvdWdoKHRyYW5zZm9ybVN0cmVhbSkKCQkJCQkucGlwZVRvKHdyaXRhYmxlU3RyZWFtKTsKCQkJCWJyZWFrOwoJCQl9CgkJCWNhc2UgImRlY3J5cHQiOgoJCQl7CgkJCQkvL1RoZSByZWNyeXB0IHF1ZXVlCgkJCQljb25zdCB0YXNrcyA9IG5ldyBUYXNrUXVldWUoKTsKCQkJCS8vTGFzdCByZXZlaWNlZCBzZW5kZXJJZAoJCQkJbGV0IHNlbmRlcklkID0gLTE7CgkJCQkvL0dldCBldmVudCBkYXRhCgkJCQljb25zdHtpZCwga2luZCwgcmVhZGFibGVTdHJlYW0sIHdyaXRhYmxlU3RyZWFtfSA9IGFyZ3M7CgkJCQkvL0NyZWF0ZSB0cmFuc2Zvcm0gc3RyZWFtIGZvciBlbmNyeXB0aW5nCgkJCQljb25zdCB0cmFuc2Zvcm1TdHJlYW0gPSBuZXcgVHJhbnNmb3JtU3RyZWFtKHsKCQkJCQl0cmFuc2Zvcm06IGFzeW5jIChjaHVuaywgY29udHJvbGxlcik9PnsKCQkJCQkJLy9Ob3RoaW5nIGluIGNsZWFyCgkJCQkJCWxldCBza2lwID0gMDsKCQkJCQkJLy9DaGVjayBpZiBpdCBpcyB2aWRlbyBhbmQgd2UgYXJlIHNraXBwaW5nIHZwOCBwYXlsb2FkIGhlYWRlcgoJCQkJCQlpZiAoa2luZD09InZpZGVvIiAmJiBjb250ZXh0LmlzU2tpcHBpbmdWcDhQYXlsb2FkSGVhZGVyKCkpCgkJCQkJCXsKCQkJCQkJCS8vR2V0IFZQOCBoZWFkZXIKCQkJCQkJCWNvbnN0IHZwOCA9IFZQOFBheWxvYWRIZWFkZXIucGFyc2UoY2h1bmsuZGF0YSk7CgkJCQkJCQkvL1NraXAgaXQKCQkJCQkJCXNraXAgPSB2cDguYnl0ZUxlbmd0aDsKCQkJCQkJfQoJCQkJCQkvL0VucXVldWUgdGFzawoJCQkJCQl0YXNrcy5lbnF1ZXVlICgKCQkJCQkJCWNvbnRleHQuZGVjcnlwdChraW5kLCBpZCwgY2h1bmsuZGF0YSwgc2tpcCksCgkJCQkJCQkoZGVjcnlwdGVkKSA9PiB7CgkJCQkJCQkJLy9TZXQgYmFjayBkZWNyeXB0ZWQgcGF5bG9hZAoJCQkJCQkJCWNodW5rLmRhdGEgPSBkZWNyeXB0ZWQuYnVmZmVyOwoJCQkJCQkJCS8vd3JpdGUgYmFjawoJCQkJCQkJCWNvbnRyb2xsZXIuZW5xdWV1ZShjaHVuayk7CgkJCQkJCQkJLy9JZiBpdCBpcyBhIHNlbmRlcgoJCQkJCQkJCWlmIChkZWNyeXB0ZWQuc2VuZGVySWQhPXNlbmRlcklkKQoJCQkJCQkJCXsKCQkJCQkJCQkJLy9TdG9yZSBpdAoJCQkJCQkJCQlzZW5kZXJJZCA9IGRlY3J5cHRlZC5zZW5kZXJJZDsKCQkJCQkJCQkJLy9MYXVuY2ggZXZlbnQKCQkJCQkJCQkJcG9zdE1lc3NhZ2UgKHtldmVudDogewoJCQkJCQkJCQkJbmFtZQk6ICJhdXRoZW50aWNhdGVkIiwKCQkJCQkJCQkJCWRhdGEJOiB7CgkJCQkJCQkJCQkJaWQJIDogaWQsCgkJCQkJCQkJCQkJc2VuZGVySWQgOiBzZW5kZXJJZAoJCQkJCQkJCQkJfQoJCQkJCQkJCQl9fSk7CgkJCQkJCQkJfQoJCQkJCQkJfSwKCQkJCQkJCShlcnJvcik9PnsKCQkJCQkJCQkvL1RPRE86IGhhbmRsZSBlcnJvcnMKCQkJCQkJCX0KCQkJCQkJKTsKCQkJCQl9CgkJCQl9KTsKCQkJCS8vRGVjcnlwdAoJCQkJcmVhZGFibGVTdHJlYW0KCQkJCQkucGlwZVRocm91Z2godHJhbnNmb3JtU3RyZWFtKQoJCQkJCS5waXBlVG8od3JpdGFibGVTdHJlYW0pOwoJCQkJYnJlYWs7CgkJCX0KCQkJZGVmYXVsdDoKCQkJCS8vRXhjdXRlICJjbWQiIG1ldGhvZCBvbiBjb250ZXh0CgkJCQlyZXN1bHQgPSBhd2FpdCBjb250ZXh0W2NtZF0oLi4uYXJncyB8fCBbXSk7CgkJfQoJCS8vU2VuZCByZXN1bHQgYmFjawoJCXBvc3RNZXNzYWdlICh7dHJhbnNJZCxyZXN1bHR9KTsKCX0gY2F0Y2ggKGVycm9yKSB7CgkJY29uc29sZS5lcnJvcihlcnJvcik7CgkJLy9TZW5kIGVycm9yIGJhY2sKCQlwb3N0TWVzc2FnZSh7dHJhbnNJZCxlcnJvcn0pOwoJfQp9Owo=\";\n\n//# sourceURL=webpack://sframe/./Worker.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;