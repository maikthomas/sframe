/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/Client.js":
/*!***********************!*\
  !*** ./lib/Client.js ***!
  \***********************/
/*! exports provided: SFrame */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SFrame\", function() { return SFrame; });\n/* harmony import */ var worker_loader_Worker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! worker-loader!./Worker.js */ \"./node_modules/worker-loader/dist/cjs.js!./lib/Worker.js\");\n//Get worker url\n\n\n\n/**\n * SFrame library\n *  @namespace Sframe\n */\nconst SFrame =\n{\n\t/**\n\t * Create a new SFrame client context.\n\t *\n\t * This method will create client which communicates with web worker in which the SFrame context will be executed.\n\t * @memberof SFrame\n\t * @param {Number} senderId - Numeric id for this sender.\n\t * @param {Object} config - Congiguration parameters [Optional].\n\t * @param {Boolean} config.skipVp8PayloadHeader - Sends the vp8 payload header in clear (Note: it will be applied to all video frames as encoded chunks does not contain codec info yet).\n\t * @returns {Promise<Client>} Promise that resolves to the client object when the web worker is initialized.\n\t */\n\tcreateClient : async function(senderId,config)\n\t{\n\t\t//Create client\n\t\tconst client = new Client();\n\t\t//Init worker async\n\t\tawait client.init(senderId, config);\n\t\t//Return client\n\t\treturn client;\n\t}\n};\n\nasync function transferKey(key)\n{\n\tif (key instanceof CryptoKey && key.type==\"private\")\n\t\treturn await crypto.subtle.exportKey(\"pkcs8\", key);\n\tif (key instanceof CryptoKey)\n\t\treturn await crypto.subtle.exportKey(\"raw\", key);\n\tif (key instanceof Uint8Array)\n\t\treturn key.buffer.slice(0);\n\treturn key.slice(0);\n}\n\n\n/**\n * The SFrame client object which acts as a proxy for web worker context.\n */\nclass Client extends EventTarget\n{\n\t/**\n\t * @ignore\n\t * @hideconstructor\n\t * private constructor\n\t */\n\tconstructor()\n\t{\n\t\t super();\n\n\t\t//Create new worker\n\t\tthis.worker = new worker_loader_Worker_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n\n\t\t//Cutrent transactions\n\t\tthis.transId = 1;\n\t\tthis.transactions = new Map();\n\n\t\t//Listen for worker messages\n\t\tthis.worker.addEventListener(\"message\",async (event)=>{\n\t\t\t//Get data\n\t\t\tconst data = event.data;\n\t\t\t//If it is a transaction response\n\t\t\tif (data.transId)\n\t\t\t{\n\t\t\t\t//Get transaction\n\t\t\t\tconst transaction = this.transactions.get(data.transId);\n\t\t\t\t//Delete transaction\n\t\t\t\tthis.transactions.delete(data.transId);\n\t\t\t\t//Check result\n\t\t\t\tif (data.error)\n\t\t\t\t    //Reject with error\n\t\t\t\t\ttransaction.reject(new Error(data.error));\n\t\t\t\telse\n\t\t\t\t\t//Resolve promise\n\t\t\t\t\ttransaction.resolve(data.result);\n\t\t\t} else if (data.event) {\n\t\t\t\t/**\n\t\t\t\t* The authenticated event will be fired when a new sender is received on the receiver.\n\t\t\t\t*\n\t\t\t\t* @name \"authenticated\"\n\t\t\t\t* @memberof Client\n\t\t\t\t* @kind event\n\t\t\t\t* @argument {String} id - The id for the associated RTCRtpReceiver\n\t\t\t\t* @argument {Number} senderId - The senderId of the authenticated sender received.\n\t\t\t\t*/\n\t\t\t\t//Create event\n\t\t\t\tconst event = new Event(data.event.name);\n\t\t\t\t//Set id and senderId\n\t\t\t\tevent.id\t= data.event.data.id;\n\t\t\t\tevent.senderId\t= data.event.data.senderId;\n\t\t\t\t//Disptach event\n\t\t\t\tthis.dispatchEvent(event);\n\t\t\t}\n\t\t});\n\t\t//Private method\n\t\tthis.postMessage = (cmd, args, transferList)=>{\n\t\t\t//Create new promise\n\t\t\treturn new Promise((resolve,reject)=>{\n\t\t\t\t//Get new transaction\n\t\t\t\tconst transId = this.transId++;\n\t\t\t\t//Sent to worker\n\t\t\t\tthis.worker.postMessage({transId,cmd,args},transferList);\n\t\t\t\t//Add it to pending transactions\n\t\t\t\tthis.transactions.set(transId,{resolve,reject});\n\t\t\t});\n\t\t};\n\t}\n\n\tasync init(senderId, config)\n\t{\n\t\treturn this.postMessage(\"init\", {senderId, config});\n\t}\n\n\t/**\n\t * Set the sender encryption key.\n\t *\n\t * @param {ArrayBuffer|Uint8Array|CryptoKey} key - 32 bytes encryption key. If the value is a CryptoKey the algorithm must be \"HKDF\".\n\t * @returns {Promise<void>} Promise which will be resolved when the key is set on the web worker.\n\t */\n\tasync setSenderEncryptionKey(key)\n\t{\n\t\tconst transfered = await transferKey(key);\n\t\treturn this.postMessage(\"setSenderEncryptionKey\", [transfered], [transfered]);\n\t}\n\n\t/**\n\t * Ratchert the sender encryption key.\n\t *\n\t * @returns {Promise<void>} Promise which will be resolved when the key is ratcheted on the web worker.\n\t */\n\tasync ratchetSenderEncryptionKey()\n\t{\n\t\treturn this.postMessage(\"ratchetSenderEncryptionKey\");\n\t}\n\n\t/**\n\t * Set the sender signing key.\n\t *\n\t * @param {ArrayBuffer|Uint8Array|CryptoKey} key - Private key used for singing. If the value is a CryptoKey the algorithm must be \"ECDSA\".\n\t * @returns {Promise<void>} Promise which will be resolved when the signing key is set on the web worker.\n\t */\n\tasync setSenderSigningKey(key)\n\t{\n\t\tconst transfered = await transferKey(key);\n\t\treturn this.postMessage(\"setSenderSigningKey\", [transfered]);\n\t}\n\n\t/**\n\t * Add receiver for a remote sender.\n\t *\n\t * @param {Number} receiverkKeyId - The remote senderId.\n\t * @returns {Promise<void>} Promise which will be resolved when the receiver is added on the web worker.\n\t */\n\tasync addReceiver(receiverkKeyId)\n\t{\n\t\treturn this.postMessage(\"addReceiver\", [receiverkKeyId]);\n\t}\n\n\t/**\n\t * Set the receiver encryption key associated to a remote sender.\n\t *\n\t * @param {Number} receiverkKeyId - The remote senderId.\n\t * @param {ArrayBuffer|Uint8Array|CryptoKey} key - 32 bytes encryption key. If the value is a CryptoKey the algorithm must be \"HKDF\".\n\t * @returns {Promise<void>} Promise which will be resolved when the key is set on the web worker.\n\t */\n\tasync setReceiverEncryptionKey(receiverkKeyId,key)\n\t{\n\t\tconst transfered = await transferKey(key);\n\t\treturn this.postMessage(\"setReceiverEncryptionKey\", [receiverkKeyId, transfered], [transfered]);\n\t}\n\n\t/**\n\t * Set the receiver signing key associated to a remote sender.\n\t *\n\t * @param {Number} receiverkKeyId - The remote senderId.\n\t * @param {ArrayBuffer|Uint8Array|CryptoKey} key - Private key used for singing. If the value is a CryptoKey the algorithm must be \"ECDSA\".\n\t * @returns {Promise<void>} Promise which will be resolved when the signing key is set on the web worker.\n\t */\n\tasync setReceiverVerifyKey(receiverkKeyId,key)\n\t{\n\t\tconst transfered = await transferKey(key);\n\t\treturn this.postMessage(\"setReceiverVerifyKey\", [receiverkKeyId, transfered], [transfered]);\n\t}\n\n\t/**\n\t * Remove receiver for a remote sender.\n\t *\n\t * @param {Number} receiverkKeyId - The remote senderId.\n\t * @returns {Promise<void>} Promise which will be resolved when the receiver is removed on the web worker.\n\t */\n\tdeleteReceiver(receiverkKeyId)\n\t{\n\t\treturn this.postMessage(\"deleteReceiver\", [receiverkKeyId]);\n\t}\n\n\t/**\n\t * Encrypt frames for a RTCRtpSender.\n\t *\n\t * @param {String} id - An unique identifier associated to this sender (for example transceiver.mid).\n\t * @param {RTCRtpSender} sender - The sender object, associated track must be not null.\n\t */\n\tasync encrypt(id,sender)\n\t{\n\t\t //We need the media kind until it is set as metadata on the chunk frame\n\t\tconst kind = sender.track.kind;\n\t\t//Get the sender insertable streams\n\t\tconst {readable: readableStream, writable: writableStream} = sender.createEncodedStreams ? sender.createEncodedStreams() :\n\t\t\tsender.createEncodedVideoStreams ? sender.createEncodedVideoStreams() : sender.createEncodedAudioStreams();\n\t\t//Pass to worker\n\t\treturn this.postMessage(\"encrypt\",\n\t\t\t{id, kind, readableStream, writableStream},\n\t\t\t[readableStream, writableStream]\n\t\t);\n\t}\n\n\t/**\n\t * Decrypt frames fpr a RTCPRtpReceiver.\n\t *\n\t * @param {String} id - An unique identifier associated to this sender (for example transceiver.mid), it will be used for the authentication and signing events.\n\t * @param {RTCRtpReceiver} receiver - The receiver object.\n\t */\n\tasync decrypt(id,receiver)\n\t{\n\t\t//We need the media kind until it is set as metadata on the chunk frame\n\t\tconst kind = receiver.track.kind;\n\t\t//Get the receiver insertable streams\n\t\tconst {readable: readableStream, writable: writableStream} = receiver.createEncodedStreams ? receiver.createEncodedStreams() :\n\t\t\treceiver.createEncodedVideoStreams ? receiver.createEncodedVideoStreams() : receiver.createEncodedAudioStreams();\n\t\t//Pass to worker\n\t\treturn this.postMessage(\"decrypt\",\n\t\t\t{id, kind, readableStream, writableStream},\n\t\t\t[readableStream, writableStream]\n\t\t);\n\t}\n\n\t/**\n\t * Close client and terminate web worker.\n\t */\n\tclose()\n\t{\n\t\t//Terminate worker\n\t\tthis.worker.terminate();\n\n\t\t//End all pending transactions\n\t\tfor (let transaction of this.transactions.values())\n\t\t\t//Reject with terminated error\n\t\t\ttransaction.reject(new Error(\"Client closed\"));\n\t\t//Clear transactions\n\t\tthis.transactions.clear();\n\t}\n};\n\n\n//# sourceURL=webpack:///./lib/Client.js?");

/***/ }),

/***/ "./lib/Utils.js":
/*!**********************!*\
  !*** ./lib/Utils.js ***!
  \**********************/
/*! exports provided: Utils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Utils\", function() { return Utils; });\nconst Utils = \n{\n\ttoHex : function(buffer)\n\t{\n\t\treturn Array.prototype.map.call(buffer instanceof Uint8Array ? buffer : new Uint8Array (buffer), x =>x.toString(16).padStart(2,\"0\")).join(\"\");\n\t},\n\tfromHex: function(str)\n\t{\n\t\tconst bytes = [];\n\t\tfor (let i=0;i<str.length/2;++i)\n\t\t\tbytes.push(parseInt(str.substring(i*2, (i+1)*2), 16));\n\n\t\treturn new Uint8Array(bytes);\n\t},\n\tequals : function(a,b)\n\t{\n\t\tif (a.byteLength != b.byteLength) return false;\n\t\tfor (let i = 0 ; i != a.byteLength ; i++)\n\t\t\tif (a[i] != b[i]) return false;\n\t\treturn true;\n\t}\n};\n\n\n//# sourceURL=webpack:///./lib/Utils.js?");

/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/*! exports provided: Utils, SFrame */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ \"./lib/Utils.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Utils\", function() { return _Utils__WEBPACK_IMPORTED_MODULE_0__[\"Utils\"]; });\n\n/* harmony import */ var _Client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Client */ \"./lib/Client.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"SFrame\", function() { return _Client__WEBPACK_IMPORTED_MODULE_1__[\"SFrame\"]; });\n\n\n\n\n\n\n\n//# sourceURL=webpack:///./lib/index.js?");

/***/ }),

/***/ "./node_modules/worker-loader/dist/cjs.js!./lib/Worker.js":
/*!****************************************************************!*\
  !*** ./node_modules/worker-loader/dist/cjs.js!./lib/Worker.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Worker_fn; });\nfunction Worker_fn() {\n  return new Worker(__webpack_require__.p + \"bundle.worker.js\");\n}\n\n\n//# sourceURL=webpack:///./lib/Worker.js?./node_modules/worker-loader/dist/cjs.js");

/***/ })

/******/ });