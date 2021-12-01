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
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/Worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/AesCm128HmacSha256EncryptionKey.js":
/*!************************************************!*\
  !*** ./lib/AesCm128HmacSha256EncryptionKey.js ***!
  \************************************************/
/*! exports provided: AesCm128HmacSha256EncryptionKey */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AesCm128HmacSha256EncryptionKey\", function() { return AesCm128HmacSha256EncryptionKey; });\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils.js */ \"./lib/Utils.js\");\n/* harmony import */ var _Salts_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Salts.js */ \"./lib/Salts.js\");\n/* harmony import */ var _IV_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IV.js */ \"./lib/IV.js\");\n\n\n\n\nclass AesCm128HmacSha256EncryptionKey \n{\n\tasync setKey(key)\n\t{\n\t\tif (key instanceof CryptoKey)\n\t\t{\n\t\t\t//Check private key algorithm\n\t\t\tif (key.algorithm.name!=\"HKDF\")\n\t\t\t\t//Error\n\t\t\t\tthrow new Error(\"Invalid key\");\n\t\t} else {\n\t\t\t//Import key\n\t\t\tkey = await crypto.subtle.importKey(\n\t\t\t\t\"raw\",\n\t\t\t\tkey,\n\t\t\t\t\"HKDF\",\n\t\t\t\tfalse,\n\t\t\t\t[\"deriveBits\", \"deriveKey\"]\n\t\t\t);\n\t\t}\n\t\t\n\t\t//Get salt key\n\t\tthis.saltKey = new Uint8Array(await crypto.subtle.deriveBits(\n\t\t\t{\n\t\t\t\tname : \"HKDF\",\n\t\t\t\thash : \"SHA-256\",\n\t\t\t\tsalt : _Salts_js__WEBPACK_IMPORTED_MODULE_1__[\"Salts\"].SaltKey,\n\t\t\t\tinfo : new ArrayBuffer()\n\t\t\t},\n\t\t\tkey,\n\t\t\t128\n\t\t));\n\t\n\t\t//Get encryption key\n\t\tthis.encryptionKey = await crypto.subtle.deriveKey(\n\t\t\t{\n\t\t\t\tname : \"HKDF\",\n\t\t\t\thash : \"SHA-256\",\n\t\t\t\tsalt : _Salts_js__WEBPACK_IMPORTED_MODULE_1__[\"Salts\"].EncryptionKey,\n\t\t\t\tinfo : new ArrayBuffer()\n\t\t\t},\n\t\t\tkey,\n\t\t\t{\n\t\t\t\tname : \"AES-CTR\",\n\t\t\t\tlength : 128\n\t\t\t},\n\t\t\tfalse,\n\t\t\t[\"encrypt\",\"decrypt\"]\n\t\t);\n\t\n\t\t//Get authentication key\n\t\tthis.authKey = await crypto.subtle.deriveKey(\n\t\t\t{\n\t\t\t\tname : \"HKDF\",\n\t\t\t\thash : \"SHA-256\",\n\t\t\t\tsalt : _Salts_js__WEBPACK_IMPORTED_MODULE_1__[\"Salts\"].AuthenticationKey,\n\t\t\t\tinfo : new ArrayBuffer()\n\t\t\t},\n\t\t\tkey,\n\t\t\t{\n\t\t\t\tname : \"HMAC\",\n\t\t\t\thash : \"SHA-256\",\n\t\t\t\tlength : 256\n\t\t\t},\n\t\t\tfalse,\n\t\t\t[\"sign\",\"verify\"]\n\t\t);\n\t\n\t\t//Derive Ratchet key\n\t\tthis.ratchetKey = await crypto.subtle.deriveBits(\n\t\t\t{\n\t\t\t\tname : \"HKDF\",\n\t\t\t\thash : \"SHA-256\",\n\t\t\t\tsalt : _Salts_js__WEBPACK_IMPORTED_MODULE_1__[\"Salts\"].RatchetKey,\n\t\t\t\tinfo : new ArrayBuffer()\n\t\t\t},\n\t\t\tkey,\n\t\t\t256\n\t\t);\n\t}\n\t\n\tasync encrypt(type,header,payload,extraBytes,skip)\n\t{\n\t\t//Encure int\n\t\tskip = skip ? skip : 0;\n\t\t\n\t\t//Create IV\n\t\tconst iv = _IV_js__WEBPACK_IMPORTED_MODULE_2__[\"IV\"].generate(header.keyId, header.counter, this.saltKey);\n\t\t\n\t\t//Encrypt\n\t\tconst encrypted = await crypto.subtle.encrypt(\n\t\t\t{\n\t\t\t\tname\t: \"AES-CTR\",\n\t\t\t\tcounter : iv,\n\t\t\t\tlength  : 128\n\t\t\t},\n\t\t\tthis.encryptionKey,\n\t\t\tpayload\n\t\t);\n\t\n\t\t//Get auth tag length from media type\n\t\tconst authTagLength = AesCm128HmacSha256EncryptionKey.getAuthTagLen(type);\n\t\t\n\t\t//Create encrypted frame\n\t\tconst encryptedFrame = new Uint8Array(header.byteLength + payload.byteLength + authTagLength + extraBytes + skip);\n\t\t\n\t\t//Set header and encrypted payolad\n\t\tencryptedFrame.set(header, skip);\n\t\tencryptedFrame.set(new Uint8Array(encrypted), skip + header.length);\n\t\t\n\t\t//Authenticate\n\t\tconst signature = new Uint8Array(await crypto.subtle.sign(\n\t\t\t\"HMAC\",\n\t\t\tthis.authKey, \n\t\t\tencryptedFrame.subarray(skip, skip + header.byteLength + encrypted.byteLength)\n\t\t));\n\t\n\t\t//Truncate\n\t\tconst authTag = signature.subarray(0, authTagLength);\n\t\n\t\t//Append authentication tag\n\t\tencryptedFrame.set(authTag, skip + encrypted.byteLength + header.byteLength );\n\t\t\n\t\t//Done\n\t\treturn [encryptedFrame,authTag];\n\t\t\n\t}\n\t\n\tasync decrypt(type, header, encryptedFrame, extrabytes, skip)\n\t{\n\t\t//Encure int\n\t\tskip = skip ? skip : 0;\n\t\t\n\t\t//Create IV\n\t\tconst iv = _IV_js__WEBPACK_IMPORTED_MODULE_2__[\"IV\"].generate(header.keyId, header.counter, this.saltKey);\n\t\t\n\t\t//Get auth tag length from media type\n\t\tconst authTagLength = AesCm128HmacSha256EncryptionKey.getAuthTagLen(type);\n\t\t\n\t\t//Get encrypted frame length (without extra bytes from signature)\n\t\tconst frameLength = encryptedFrame.byteLength - extrabytes - skip;\n\t\t\n\t\t//Get authentication tag\n\t\tconst authTag = encryptedFrame.subarray(skip + frameLength - authTagLength, skip + frameLength);\n\t\t\n\t\t//Get encrypted payload\n\t\tconst encrypted = encryptedFrame.subarray(skip + header.byteLength, skip + frameLength - authTagLength);\n\t\t\n\t\t//Calculate signature\n\t\tconst signature = new Uint8Array(await crypto.subtle.sign(\n\t\t\t\"HMAC\",\n\t\t\tthis.authKey, \n\t\t\tencryptedFrame.subarray(skip, skip + header.byteLength + encrypted.byteLength)\n\t\t));\n\t\n\t\t//Authenticate authTag\n\t\tlet authenticated = true;\n\t\t//Avoid timimg attacks by iterating over all bytes\n\t\tfor (let i=0;i<authTagLength;++i)\n\t\t\t//check signature\n\t\t\tauthenticated &= authTag[i]===signature[i];\n\t\t\n\t\t//If not all where equal\n\t\tif (!authenticated)\n\t\t\t//Authentication error\n\t\t\tthrow new Error(\"Authentication error\");\n\t\t\n\t\t//Decrypt\n\t\tconst payload = new Uint8Array (await crypto.subtle.decrypt(\n\t\t\t{\n\t\t\t\tname\t: \"AES-CTR\",\n\t\t\t\tcounter : iv,\n\t\t\t\tlength  : 128\n\t\t\t},\n\t\t\tthis.encryptionKey,\n\t\t\tencrypted\n\t\t));\n\t\t\n\t\t//Done\n\t\treturn [payload, authTag];\n\t}\n\t\n\tasync ratchet()\n\t{\n\t\t//Create new key\n\t\tconst key = new AesCm128HmacSha256EncryptionKey();\n\t\t\n\t\t//Set ratchet key\n\t\tawait key.setKey(this.ratchetKey);\n\t\t\n\t\t//Done\n\t\treturn key;\n\t}\n\t\n\tstatic getAuthTagLen(type)\n\t{\n\t\treturn type.toLowerCase()===\"video\" ? 10 : 4;\n\t};\n\t\n\tstatic async create(raw) \n\t{\n\t\t//Create new key\n\t\tconst key = new AesCm128HmacSha256EncryptionKey();\n\t\t//Set raw key\n\t\tawait key.setKey(raw);\n\t\t//Done\n\t\treturn key;\n\t}\n};\n\n\n\n//# sourceURL=webpack:///./lib/AesCm128HmacSha256EncryptionKey.js?");

/***/ }),

/***/ "./lib/Context.js":
/*!************************!*\
  !*** ./lib/Context.js ***!
  \************************/
/*! exports provided: Context */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Context\", function() { return Context; });\n/* harmony import */ var _Header_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Header.js */ \"./lib/Header.js\");\n/* harmony import */ var _Sender_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Sender.js */ \"./lib/Sender.js\");\n/* harmony import */ var _Receiver_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Receiver.js */ \"./lib/Receiver.js\");\n\n\n\n\nclass Context\n{\n\t\n\tconstructor(senderId, config)\n\t{\n\t\t//Store config\n\t\tthis.config = Object.assign({}, config);\n\t\t//Only one sender per context\n\t\tthis.sender = new _Sender_js__WEBPACK_IMPORTED_MODULE_1__[\"Sender\"](senderId);\n\t\t\n\t\t//The map of known remote senders\n\t\tthis.receivers = new Map();\n\t}\n\t\n\tisSkippingVp8PayloadHeader()\n\t{\n\t\treturn !!this.config.skipVp8PayloadHeader;\n\t}\n\t\t\n\tasync setSenderEncryptionKey(key)\n\t{\n\t\t//Set it\n\t\treturn this.sender.setEncryptionKey(key);\n\t}\n\t\n\tasync ratchetSenderEncryptionKey()\n\t{\n\t\t//Set it\n\t\treturn this.sender.ratchetEncryptionKey();\n\t}\n\t\n\tasync setSenderSigningKey(key)\n\t{\n\t\t//Set it\n\t\treturn this.sender.setSigningKey(key);\n\t}\n\t\n\taddReceiver(receiverkKeyId)\n\t{\n\t\t//Check we don't have a receiver already for that id\n\t\tif(this.receivers.has(receiverkKeyId))\n\t\t\t//Error\n\t\t\tthrow new Error(\"There was already a receiver for keyId \"+receiverkKeyId);\n\t\t//Add new\n\t\tthis.receivers.set(receiverkKeyId, new _Receiver_js__WEBPACK_IMPORTED_MODULE_2__[\"Receiver\"](receiverkKeyId));\n\t}\n\t\n\tasync setReceiverEncryptionKey(receiverkKeyId, key)\n\t{\n\t\t//Get receiver for the sender\n\t\tconst receiver = this.receivers.get(receiverkKeyId);\n\t\t\n\t\t//IF not found\n\t\tif (!receiver)\n\t\t\t//Error\n\t\t\tthrow new Error(\"No receiver found for keyId \"+receiverkKeyId);\n\t\t\n\t\t//Rachet\n\t\treturn receiver.setEncryptionKey(key);\n\t}\n\t\n\tasync setReceiverVerifyKey(receiverkKeyId,key)\n\t{\n\t\t//Get receiver for the sender\n\t\tconst receiver = this.receivers.get(receiverkKeyId);\n\t\t\n\t\t//IF not found\n\t\tif (!receiver)\n\t\t\t//Error\n\t\t\tthrow new Error(\"No receiver found for keyId \"+receiverkKeyId);\n\t\t\n\t\t//Rachet\n\t\treturn receiver.setVerifyKey(key);\n\t}\n\t\n\tdeleteReceiver(receiverkKeyId)\n\t{\n\t\t//Delete receiver\n\t\treturn this.receivers.delete(receiverkKeyId);\n\t}\n\t\n\tasync encrypt(type, ssrcId, frame, skip)\n\t{\n\t\t//Encrypt it\n\t\treturn this.sender.encrypt(type, ssrcId, frame, skip);\n\t}\n\t\n\tasync decrypt(type, ssrcId, encryptedFrame, skip)\n\t{\n\t\t//convert if needed\n\t\tif (!(encryptedFrame instanceof Uint8Array))\n\t\t\tencryptedFrame = new Uint8Array (encryptedFrame);\n\t\t\n\t\t//Parse encrypted payload\n\t\tconst header = _Header_js__WEBPACK_IMPORTED_MODULE_0__[\"Header\"].parse(encryptedFrame.subarray(skip));\n\t\t\n\t\t//Get receiver for the sender\n\t\tconst receiver = this.receivers.get(header.keyId);\n\t\t\n\t\t//IF not found\n\t\tif (!receiver)\n\t\t\t//Error\n\t\t\tthrow new Error(\"No receiver found for keyId \" + header.keyId);\n\t\t\n\t\t//Decrypt it\n\t\treturn receiver.decrypt(type, ssrcId, header, encryptedFrame, skip);\n\t}\n\t\n};\n\n\n//# sourceURL=webpack:///./lib/Context.js?");

/***/ }),

/***/ "./lib/EcdsaSignKey.js":
/*!*****************************!*\
  !*** ./lib/EcdsaSignKey.js ***!
  \*****************************/
/*! exports provided: EcdsaSignKey */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"EcdsaSignKey\", function() { return EcdsaSignKey; });\n//TODO: Update to Ed25519 when available\n// https://chromestatus.com/features/4913922408710144\n// https://chromium.googlesource.com/chromium/src/+log/master/components/webcrypto/algorithms/ed25519.cc\n\nclass EcdsaSignKey\n{\n\t\n\tasync setKey(privKey)\n\t{\n\t\t//If it is a crypto key already\n\t\tif (privKey instanceof CryptoKey)\n\t\t{\n\t\t\t//Check private key algorithm\n\t\t\tif (privKey.algorithm.name!=\"ECDSA\" || !privKey.usages.includes(\"sign\"))\n\t\t\t\t//Error\n\t\t\t\tthrow new Error(\"Invalid key\");\n\t\t\t//Set it\n\t\t\tthis.privKey = privKey;\n\t\t} else {\n\t\t\t//Import it\n\t\t\tthis.privKey = await crypto.subtle.importKey(\n\t\t\t\t\"pkcs8\",\n\t\t\t\tprivKey,\n\t\t\t\t{\n\t\t\t\t\tname\t\t: \"ECDSA\",\n\t\t\t\t\tnamedCurve\t: \"P-521\"\n\t\t\t\t},\n\t\t\t\tfalse,\n\t\t\t\t[\"sign\"]\n\t\t\t);\n\t\t}\n\t}\n\t\n\tasync sign(authTags)\n\t{\n\t\t//Verify\n\t\treturn new Uint8Array(await crypto.subtle.sign(\n\t\t\t{\n\t\t\t  name: \"ECDSA\",\n\t\t\t  hash: \"SHA-512\"\n\t\t\t},\n\t\t\tthis.privKey,\n\t\t\tauthTags\n\t\t));\n\t}\n\t\n\tstatic getSignatureLen()\n\t{\n\t\treturn 64;\n\t}\n\t\n\tstatic async create(privKey)\n\t{\n\t\t//Craete key\n\t\tconst key = new EcdsaSignKey();\n\t\t//Set key\n\t\tawait key.setKey(privKey);\n\t\t//Done\n\t\treturn key;\n\t\t\n\t}\n};\n\n\n//# sourceURL=webpack:///./lib/EcdsaSignKey.js?");

/***/ }),

/***/ "./lib/EcdsaVerifyKey.js":
/*!*******************************!*\
  !*** ./lib/EcdsaVerifyKey.js ***!
  \*******************************/
/*! exports provided: EcdsaVerifyKey */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"EcdsaVerifyKey\", function() { return EcdsaVerifyKey; });\n\nclass EcdsaVerifyKey\n{\n\tasync setKey(pubKey)\n\t{\n\t\t//If it is a crypto key already\n\t\tif (pubKey instanceof CryptoKey)\n\t\t{\n\t\t\t//Check \n\t\t\tif (pubKey.algorithm.name!=\"ECDSA\" || !pubKey.usages.includes(\"verify\"))\n\t\t\t\t//Error\n\t\t\t\tthrow new Error(\"Invalid key\");\n\t\t\t//Set it\n\t\t\tthis.pubKey = pubKey;\n\t\t} else {\n\t\t\t//Import it\n\t\t\tthis.pubKey = await crypto.subtle.importKey(\n\t\t\t\t\"raw\",\n\t\t\t\tpubKey,\n\t\t\t\t{\n\t\t\t\t\tname\t\t: \"ECDSA\",\n\t\t\t\t\tnamedCurve\t: \"P-521\"\n\t\t\t\t},\n\t\t\t\tfalse,\n\t\t\t\t[\"verify\"]\n\t\t\t);\n\t\t}\n\t}\n\t\n\tasync verify(signed,signature)\n\t{\n\t\t//Verify\n\t\treturn await window.crypto.subtle.verify(\n\t\t\t{\n\t\t\t\tname: \"ECDSA\",\n\t\t\t\thash: \"SHA-512\"\n\t\t\t},\n\t\t\tthis.pubKey,\n\t\t\tsignature,\n\t\t\tsigned\n\t\t);\n\t}\n\t\n\tstatic getSignatureLen()\n\t{\n\t\treturn 64;\n\t}\n\t\n\tstatic async create(pubKey)\n\t{\n\t\t//Craete key\n\t\tconst key = new EcdsaVerifyKey();\n\t\t//Set key\n\t\tawait key.setKey(pubKey);\n\t\t//Done\n\t\treturn key;\n\t\t\n\t}\n};\n\n\n//# sourceURL=webpack:///./lib/EcdsaVerifyKey.js?");

/***/ }),

/***/ "./lib/Header.js":
/*!***********************!*\
  !*** ./lib/Header.js ***!
  \***********************/
/*! exports provided: Header */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Header\", function() { return Header; });\n/*\n\t0 1 2 3 4 5 6 7\n\t+-+-+-+-+-+-+-+-+\n\t|S|LEN  |X|  K  |\n\t+-+-+-+-+-+-+-+-+\n\tSFrame header metadata\n\n\tSignature flag (S): 1 bit This field indicates the payload contains a signature of set. Counter Length (LEN): 3 bits This field indicates the length of the CTR fields in bytes. Extended Key Id Flag (X): 1 bit\n\tIndicates if the key field contains the key id or the key length. Key or Key Length: 3 bits This field contains the key id (KID) if the X flag is set to 0, or the key length (KLEN) if set to 1.\n\n\tIf X flag is 0 then the KID is in the range of 0-7 and the frame counter (CTR) is found in the next LEN bytes:\n\n\t 0 1 2 3 4 5 6 7\n\t+-+-+-+-+-+-+-+-+---------------------------------+\n\t|S|LEN  |0| KID |    CTR... (length=LEN)          |\n\t+-+-+-+-+-+-+-+-+---------------------------------+\n\tKey id (KID): 3 bits The key id (0-7). Frame counter (CTR): (Variable length) Frame counter value up to 8 bytes long.\n\n\tif X flag is 1 then KLEN is the length of the key (KID), that is found after the SFrame header metadata byte. After the key id (KID), the frame counter (CTR) will be found in the next LEN bytes:\n\n\t 0 1 2 3 4 5 6 7\n\t+-+-+-+-+-+-+-+-+---------------------------+---------------------------+\n\t|S|LEN  |1|KLEN |   KID... (length=KLEN)    |    CTR... (length=LEN)    |\n\t+-+-+-+-+-+-+-+-+---------------------------+---------------------------+\n*/\nconst Header = {\n\t\n\tparse : function(buffer) \n\t{\n\t\t//Create uint view\n\t\tconst view = new Uint8Array(buffer);\n\t\t\n\t\t//Get metadata\n\t\tconst metadata = view[0];\n\t\t\n\t\t//Get values\n\t\tconst s\t\t= !!(metadata & 0x80);\n\t\tconst len\t= (metadata >> 4) & 0x07;\n\t\tconst x\t\t= !!(metadata & 0x08);\n\t\tconst k\t\t= metadata & 0x07;\n\t\t\n\t\t//Get key id\n\t\tlet keyId = 0;\n\t\t//Check if it is the extented key format\n\t\tif (x)\n\t\t{\n\t\t\t//Read length\n\t\t\tfor (let i=0;i<k;i++)\n\t\t\t\tkeyId = (keyId * 256) + view[i+1];\n\t\t} else {\n\t\t\t//Short version\n\t\t\tkeyId = k;\n\t\t}\n\t\t\n\t\t//Get ctr\n\t\tconst ini = x ? k + 1 : 1;\n\t\tlet counter = 0;\n\t\t//Read length\n\t\tfor (let i=0;i<len;i++)\n\t\t\tcounter = (counter * 256) + view[ini+i];\n\t\t\n\t\t//Get header buffer view\n\t\tconst header = view.subarray(0, x ? k + len + 1 : len + 1);\n\t\t\n\t\t//Add parsed atributes\n\t\theader.signature   = s;\n\t\theader.keyId\t   = keyId;\n\t\theader.counter\t   = counter;\n\t\t\n\t\t//Done\n\t\treturn header; \n\t},\n\tgenerate: function(signature,keyId,counter)\n\t{\n\t\t//Check keyId\n\t\tHeader.checkKeyId(keyId);\n\t\t\n\t\t//Calcultate variavle length\n\t\tconst varlen = (x) => x ? parseInt(Math.log(x) / Math.log(256))+1 : 1;\n\t\t\n\t\t//Get key extension and length\n\t\tconst x = keyId > 7;\n\t\tconst k = x ? varlen(keyId) : keyId;\n\t\t\n\t\t//Get counter length\n\t\tconst len = varlen(counter);\n\t\t\n\t\t//Ensure counter is not huge\n\t\tif (len>7)\n\t\t\t//Error\n\t\t\tthrow new Error(\"Counter is too big\");\n\t\t\n\t\t//Generate header\n\t\tconst header = new Uint8Array( x ? 1 + k + len : 1 + len);\n\t\t\n\t\t//Set metadata header\n\t\theader[0] = !!signature;\n\t\theader[0] = header[0] << 3  | ( len & 0x07);\n\t\theader[0] = header[0] << 1  | x;\n\t\theader[0] = header[0] << 3  | ( k & 0x07);\n\t\t\n\t\t//Add parsed atributes\n\t\theader.signature   = !!signature;\n\t\theader.keyId\t   = keyId;\n\t\theader.counter\t   = counter;\n\t\t\n\t\t//If extended key\n\t\tif (x)\n\t\t\t//Add key id\n\t\t\tfor (let i=0; i<k; ++i)\n\t\t\t\theader[i+1] = (keyId >> (k-1-i)*8) & 0xff;\n\t\t//The coutner init\n\t\tconst ini = x ? k + 1 : 1;\n\t\t//Add counter\n\t\tfor (let i=0; i<len; ++i)\n\t\t\theader[ini+i] = (counter >> (len-1-i)*8) & 0xff;\n\t\t\t\n\t\t\n\t\t//Done\n\t\treturn header;\n\t}\n};\n\nHeader.MaxKeyId = 0xFFFFFFFFFF;\n\nHeader.checkKeyId = function(keyId)\n{\n\t//Check it is possitive\n\tif (keyId<0)\n\t\t//Error\n\t\tthrow new Error(\"keyId must be possitive\");\n\t//Check it is possitive\n\tif (keyId>Header.MaxKeyId)\n\t\t//Error\n\t\tthrow new Error(\"keyId must be 5 bytes long at most\");\n};\n\n\n//# sourceURL=webpack:///./lib/Header.js?");

/***/ }),

/***/ "./lib/IV.js":
/*!*******************!*\
  !*** ./lib/IV.js ***!
  \*******************/
/*! exports provided: IV */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"IV\", function() { return IV; });\nconst IV = \n{\n\tgenerate : function(keyId,counter,salt)\n\t{\n\t\t//128 bits\n\t\tconst iv = new Uint8Array (16);\n\t\t//Get view\n\t\tconst view = new DataView(iv.buffer);\n\t\t//Set keyId\n\t\tview.setBigUint64(0, BigInt(counter));\n\t\t//Set coutner\n\t\tview.setBigUint64(8, BigInt(keyId));\n\t\t//Xor with salt key\n\t\tfor (let i=0; i<iv.byteLength; ++i)\n\t\t\t//xor\n\t\t\tview.setUint8(i,iv[i]^salt[i]); \n\t\t//return buffer\n\t\treturn iv;\n\t}\n};\n\n\n//# sourceURL=webpack:///./lib/IV.js?");

/***/ }),

/***/ "./lib/Receiver.js":
/*!*************************!*\
  !*** ./lib/Receiver.js ***!
  \*************************/
/*! exports provided: Receiver */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Receiver\", function() { return Receiver; });\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils.js */ \"./lib/Utils.js\");\n/* harmony import */ var _Header_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Header.js */ \"./lib/Header.js\");\n/* harmony import */ var _EcdsaVerifyKey_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EcdsaVerifyKey.js */ \"./lib/EcdsaVerifyKey.js\");\n/* harmony import */ var _AesCm128HmacSha256EncryptionKey_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AesCm128HmacSha256EncryptionKey.js */ \"./lib/AesCm128HmacSha256EncryptionKey.js\");\n\n\n\n\n\nconst MaxRachetAttemtps = 5;\nconst ReplayWindow = 128;\nconst KeyTimeout = 1000;\n\nclass Receiver\n{\n\tconstructor(senderId)\n\t{\n\t\t//Check keyId\n\t\t_Header_js__WEBPACK_IMPORTED_MODULE_1__[\"Header\"].checkKeyId(senderId);\n\t\t\n\t\t//Store sender id\n\t\tthis.senderId = senderId;\n\t\t//Last received counter\n\t\tthis.maxReceivedCounter = -1;\n\t\t//Number or ratchets of current key\n\t\tthis.numKeyRatchets = 0;\n\t\t//Create keyring\n\t\tthis.keyring = [];\n\t\t//Pending verified tags\n\t\tthis.pending = new Map();\n\t\t\n\t\t//Scheduled keys\n\t\tthis.scheduledKeys = new WeakSet ();\n\t\t\n\t\t//Function to clear up keys up to given one\n\t\tthis.schedulePreviousKeysTimeout = (key) =>{\n\t\t\t//If this is the only key\n\t\t\tif (this.keyring.length==1 && this.keyring[0]===key)\n\t\t\t\t//Do nothing\n\t\t\t\treturn;\n\t\t\t//If has been already scheduled\n\t\t\tif (this.scheduledKeys.has(key))\n\t\t\t\t//Not do it twice\n\t\t\t\treturn;\n\t\t\t//Add it\n\t\t\tthis.scheduledKeys.add(key);\n\t\t\t//Schedule key timeout of previous keys\n\t\t\tsetTimeout(()=>{\n\t\t\t\t//Find key index\n\t\t\t\tconst i = this.keyring.findIndex(k=>k===key);\n\t\t\t\t//Remove previous keys\n\t\t\t\tthis.keyring = this.keyring.splice(i);\n\t\t\t}, KeyTimeout);\n\t\t};\n\t}\n\t\n\tasync decrypt(type, ssrcId, header, encryptedFrame, skip)\n\t{\n\t\tlet authTag, payload, extrabytes = 0, signature, signed;\n\t\tconst prevAuthTags = [];\n\t\t\n\t\t//convert if needed\n\t\tif (!(encryptedFrame instanceof Uint8Array))\n\t\t\tencryptedFrame = new Uint8Array (encryptedFrame);\n\t\t\n\t\t//Replay attack protection\n\t\tif (header.counter<this.maxReceivedCounter && this.maxReceivedCounter-header.counter>ReplayWindow)\n\t\t\t//Error\n\t\t\tthrow new Error(\"Replay check failed, frame counter too old\");\n\t\t\n\t\t//Check if frame contains signature\n\t\tif (header.signature)\n\t\t{\n\t\t\t//Start from the end\n\t\t\tlet end = encryptedFrame.byteLength;\n\t\t\t\n\t\t\t//Get lengths\n\t\t\tconst singatureLength = ECDSAVerifyKey.getSignatureLen();\n\t\t\tconst authTagLength   = _AesCm128HmacSha256EncryptionKey_js__WEBPACK_IMPORTED_MODULE_3__[\"AesCm128HmacSha256EncryptionKey\"].getAuthTagLen(type);\n\t\t\t\n\t\t\t//Get signature\n\t\t\tsignature = encryptedFrame.subarray(end - singatureLength, end);\n\t\t\t//Move backward\n\t\t\tend -= singatureLength;\n\t\t\t\n\t\t\t//Get number of tags\n\t\t\tconst num = encryptedFrame[end--];\n\t\t\t\n\t\t\t//Read all tags\n\t\t\tfor (let i=0; i<num; ++i)\n\t\t\t{\n\t\t\t\t//Get previous tag\n\t\t\t\tconst prevTag = encryptedFrame.subarray(end - authTagLength, end);\n\t\t\t\t//Move backward\n\t\t\t\tend -= authTagLength;\n\t\t\t\t//Add tag to previous tags in hex\n\t\t\t\tprevAuthTags.push(_Utils_js__WEBPACK_IMPORTED_MODULE_0__[\"Utils\"].toHex(prevTag))\n\t\t\t}\n\t\t\t//Get the extra bytes\n\t\t\textrabytes = encryptedFrame.byteLength - end;\n\t\t\t\n\t\t\t//Move backward to start oth current frame auth tag\n\t\t\tend -= authTagLength;\n\t\t\t\n\t\t\t//Get singed part\n\t\t\tsigned = encryptedFrame.subarray(end, encryptedFrame.byteLength - singatureLength)\n\t\t}\n\t\t\n\t\t//For each key in key ring\n\t\tfor (let i=0;i<this.keyring.length;++i)\n\t\t{\n\t\t\t//Get key from ring\n\t\t\tconst key = this.keyring[i];\n\t\t\ttry {\n\t\t\t\t//Try to decrypt payload\n\t\t\t\t[payload, authTag] = await key.decrypt(type, header, encryptedFrame, extrabytes, skip);\n\t\t\t\t//Done\n\t\t\t\tbreak;\n\t\t\t} catch(e) {\n\t\t\t\t\n\t\t\t}\n\t\t}\n\t\t\n\t\t//If not found yet\n\t\tif (!payload)\n\t\t{\n\t\t\t//Get last key\n\t\t\tlet key = this.keyring[this.keyring.length-1];\n\t\t\t\n\t\t\t//Try ractchet last key\n\t\t\tfor (let i=this.numKeyRatchets; i<MaxRachetAttemtps; ++i)\n\t\t\t{\n\t\t\t\t//Rachet key\n\t\t\t\tkey = await key.ratchet();\n\t\t\t\t\n\t\t\t\t//Append to the keyring\n\t\t\t\tthis.keyring.push(key);\n\t\t\t\t\n\t\t\t\ttry {\n\t\t\t\t\t//Try to decrypt payload\n\t\t\t\t\t[payload, authTag] = await key.decrypt(type, header, encryptedFrame, extrabytes, skip);\n\t\t\t\t\t//Activate\n\t\t\t\t\tthis.schedulePreviousKeysTimeout(key);\n\t\t\t\t\t//Done\n\t\t\t\t\tbreak;\n\t\t\t\t} catch(e) {\n\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t\n\t\t//Last check\n\t\tif (!payload)\n\t\t\t//Decryption failed\n\t\t\tthrow new Error(\"Decryption failed\");\n\t\t\n\t\t//If we are sending part of the frame in clear\n\t\tif (skip)\n\t\t\t//Copy skiped payload\n\t\t\tpayload.set(encryptedFrame.subarray(0,skip),0);\n\t\t\n\t\t//Check if have received anything from this ssrc before\n\t\tif (!this.pending.has(ssrcId))\n\t\t\t//Add it\n\t\t\tthis.pending.set(ssrcId,new Set());\n\t\t\n\t\t//Get pending list\n\t\tconst pending = this.pending.get(ssrcId);\n\t\t\n\t\t//Check if it constains signatures\n\t\tif (header.signed)\n\t\t{\n\t\t\t//try to verify list\n\t\t\tif (!await this.verifyKey.verify(signed,signature))\n\t\t\t\t//Error\n\t\t\t\tthrow new Error(\"Could not verify signature\");\n\t\t\t//For each signed tag\n\t\t\tfor (const tag in prevAuthTags)\n\t\t\t\t//Delete from pending to be verified tags\n\t\t\t\tpending.delete(tag);\n\t\t} else {\n\t\t\t//Push this tag to \n\t\t\tpending.add(_Utils_js__WEBPACK_IMPORTED_MODULE_0__[\"Utils\"].toHex(authTag));\n\t\t}\n\t\t\n\t\t//Set authenticated sender id and frame Id\n\t\tpayload.senderId = header.keyId;\n\t\tpayload.frameId  = header.counter;\n\t\t\n\t\t//Store last received counter\n\t\tthis.maxReceivedCounter = Math.max(header.counter, this.maxReceivedCounter);\n\t\t\n\t\t//Return decrypted payload\n\t\treturn payload;\n\t}\n\t\n\tasync setVerifyKey(key)\n\t{\n\t\t//Create new singing key\n\t\tthis.verifyKey = _EcdsaVerifyKey_js__WEBPACK_IMPORTED_MODULE_2__[\"EcdsaVerifyKey\"].create(key);\n\t}\n\t\n\tasync setEncryptionKey(raw)\n\t{\n\t\t//Create new encryption key\n\t\tconst key = await _AesCm128HmacSha256EncryptionKey_js__WEBPACK_IMPORTED_MODULE_3__[\"AesCm128HmacSha256EncryptionKey\"].create(raw);\n\t\t//Append to the keyring\n\t\tthis.keyring.push(key);\n\t\t//Restart ratchet count number\n\t\tthis.numKeyRatchets = 0;\n\t\t//Activate\n\t\tthis.schedulePreviousKeysTimeout(key);\n\t}\n};\n\n\n//# sourceURL=webpack:///./lib/Receiver.js?");

/***/ }),

/***/ "./lib/Salts.js":
/*!**********************!*\
  !*** ./lib/Salts.js ***!
  \**********************/
/*! exports provided: Salts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Salts\", function() { return Salts; });\nconst textEncoder = new TextEncoder()\n\nconst Salts =  {\n\t\"SaltKey\"\t\t: textEncoder.encode(\"SFrameSaltKey\"),\n\t\"EncryptionKey\"\t\t: textEncoder.encode(\"SFrameEncryptionKey\"),\n\t\"AuthenticationKey\"\t: textEncoder.encode(\"SFrameAuthenticationKey\"),\n\t\"RatchetKey\"\t\t: textEncoder.encode(\"SFrameRatchetKey\")\n};\n\n\n//# sourceURL=webpack:///./lib/Salts.js?");

/***/ }),

/***/ "./lib/Sender.js":
/*!***********************!*\
  !*** ./lib/Sender.js ***!
  \***********************/
/*! exports provided: Sender */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Sender\", function() { return Sender; });\n/* harmony import */ var _Header_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Header.js */ \"./lib/Header.js\");\n/* harmony import */ var _EcdsaSignKey_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EcdsaSignKey.js */ \"./lib/EcdsaSignKey.js\");\n/* harmony import */ var _AesCm128HmacSha256EncryptionKey_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AesCm128HmacSha256EncryptionKey.js */ \"./lib/AesCm128HmacSha256EncryptionKey.js\");\n\n\n\n\n\nconst SigningFrameInterval = 10;\n\nclass Sender\n{\n\tconstructor(senderId)\n\t{\n\t\t//Check keyId\n\t\t_Header_js__WEBPACK_IMPORTED_MODULE_0__[\"Header\"].checkKeyId(senderId);\n\t\t\n\t\t//The global frame counter\n\t\tthis.counter = 0;\n\t\t\n\t\t//Store senderId/keyId\n\t\tthis.senderId = senderId;\n\t\t\n\t\t//Pending frames for signing\n\t\tthis.pending = new Map();\n\t}\n\t\n\tasync encrypt(type, ssrcId, payload, skip)\n\t{\n\t\t//Check we have a valid key\n\t\tif (!this.key)\n\t\t\tthrow Error(\"Encryption key not set\");\n\t\t\n\t\t//convert if needed\n\t\tif (!(payload instanceof Uint8Array))\n\t\t\tpayload = new Uint8Array (payload);\n\t\t\n\t\t//Encure int\n\t\tskip = skip ? skip : 0;\n\t\t\n\t\t//Get counter for frame\n\t\tconst counter = this.counter++;\n\t\t\n\t\t//If we don't have the ssrc\n\t\tif (!this.pending.has(ssrcId))\n\t\t\t//Create new pending frames array\n\t\t\tthis.pending.set(ssrcId,[]);\n\t\t\n\t\t//Get pending frames for signature\n\t\tconst pending = this.pending.get(ssrcId);\t\t\n\t\t\n\t\t//Do we need to sign the frames?\n\t\tconst signing = this.signingKey && pending.length > SigningFrameInterval;\n\t\t\n\t\t//Get auth tag len for type\n\t\tconst authTagLen = _AesCm128HmacSha256EncryptionKey_js__WEBPACK_IMPORTED_MODULE_2__[\"AesCm128HmacSha256EncryptionKey\"].getAuthTagLen(type);\n\t\t\n\t\t//Calculae extra bytes\n\t\tconst extraBytes = signing ? pending.length * _AesCm128HmacSha256EncryptionKey_js__WEBPACK_IMPORTED_MODULE_2__[\"AesCm128HmacSha256EncryptionKey\"].getAuthTagLen(type) + 1 + _EcdsaSignKey_js__WEBPACK_IMPORTED_MODULE_1__[\"EcdsaSignKey\"].getSignatureLen() : 0;\n\t\t\n\t\t//Generate header\n\t\tconst header = _Header_js__WEBPACK_IMPORTED_MODULE_0__[\"Header\"].generate(signing,this.senderId,counter);\n\t\t\n\t\t//Encrypt frame\n\t\tconst [encryptedFrame,authTag] = await this.key.encrypt(type, header, payload, extraBytes, skip);\n\t\t\n\t\t//If we are sending part of the frame in clear\n\t\tif (skip)\n\t\t\t//Copy skiped payload\n\t\t\tencryptedFrame.set(payload.subarray(0,skip),0);\n\t\t\n\t\t//If we need to sign the frame\n\t\tif (signing)\n\t\t{\n\t\t\t//Append after auth tag\n\t\t\tlet ini = skip + encryptedFrame.byteLength - extraBytes;\n\t\t\t\n\t\t\t//Get tag list view\n\t\t\tconst authTags = encryptedFrame.subarray(ini - authTagLen, (pending.length + 1) * authTagLen);\n\t\t\t\n\t\t\t//Add all previous tags \n\t\t\tfor (const previousTag of pending)\n\t\t\t{\n\t\t\t\t//Append to frame\n\t\t\t\tencryptedFrame.set(previousTag, ini);\n\t\t\t\t//Move\n\t\t\t\tini += authTagLen;\n\t\t\t}\n\t\t\t\n\t\t\t//Add number of bytes\n\t\t\tencryptedFrame[ini++] = pending.length;\n\t\t\t\n\t\t\t//Create signature with all auth tags (including this frame's one)\n\t\t\tconst signature = await this.signingKey.sign(authTags);\n\t\t\t\n\t\t\t//Add signature\n\t\t\tencryptedFrame.set(signature, ini);\n\t\t\t\n\t\t\t//Empty pending list \n\t\t\tthis.pending.set(ssrcId,[]);\n\t\t\t\n\t\t//If we can sign\n\t\t} else if (this.signingKey) {\n\t\t\t//Append a copy of current tag at the begining\n\t\t\tpending.unshift(authTag.slice());\n\t\t}\n\t\t\n\t\t//Set authenticated sender id and frame Id\n\t\tencryptedFrame.senderId = header.keyId;\n\t\tencryptedFrame.frameId  = header.counter;\n\t\t\n\t\t//Done\n\t\treturn encryptedFrame;\n\t}\n\t\n\tasync setSigningKey(key)\n\t{\n\t\t//Create new singing key\n\t\tthis.signingKey = await _EcdsaSignKey_js__WEBPACK_IMPORTED_MODULE_1__[\"EcdsaSignKey\"].create(key);\n\t}\n\t\n\tasync setEncryptionKey(key)\n\t{\n\t\t//Create new encryption key\n\t\tthis.key = await _AesCm128HmacSha256EncryptionKey_js__WEBPACK_IMPORTED_MODULE_2__[\"AesCm128HmacSha256EncryptionKey\"].create(key);\n\t}\n\t\n\tasync ratchetEncryptionKey()\n\t{\n\t\t//Check we have a valid key\n\t\tif (!this.key)\n\t\t\tthrow Error(\"Encryption key not set\");\n\t\t\n\t\t//Rachet the key and store it\n\t\tthis.key = await this.key.ratchet();\n\t}\n};\n\n\n//# sourceURL=webpack:///./lib/Sender.js?");

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

/***/ "./lib/VP8PayloadHeader.js":
/*!*********************************!*\
  !*** ./lib/VP8PayloadHeader.js ***!
  \*********************************/
/*! exports provided: VP8PayloadHeader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"VP8PayloadHeader\", function() { return VP8PayloadHeader; });\n\nconst VP8PayloadHeader = {\n\t\n\tparse : function(buffer) \n\t{\n\t\t//Check size\n\t\tif (buffer.byteLength<3)\n\t\t\t//Invalid\n\t\t\treturn null;\n\t\t\n\t\t//Create uint view\n\t\tconst view = new Uint8Array(buffer);\n\t\t\n\t\t//Read comon 3 bytes\n\t\t//   0 1 2 3 4 5 6 7\n                //  +-+-+-+-+-+-+-+-+\n                //  |Size0|H| VER |P|\n                //  +-+-+-+-+-+-+-+-+\n                //  |     Size1     |\n                //  +-+-+-+-+-+-+-+-+\n                //  |     Size2     |\n                //  +-+-+-+-+-+-+-+-+\n\t\tconst firstPartitionSize\t= view[0] >> 5;\n\t\tconst showFrame\t\t\t= view[0] >> 4 & 0x01;\n\t\tconst version\t\t\t= view[0] >> 1 & 0x07;\n\t\tconst isKeyFrame\t\t= (view[0] & 0x01) == 0;\n\n\t\t//check if more\n\t\tif (isKeyFrame)\n\t\t{\n\t\t\t//Check size\n\t\t\tif (buffer.byteLength<10)\n\t\t\t\t//Invalid\n\t\t\t\treturn null;\n\t\t\t//Get size in le\n\t\t\tconst hor = view[7]<<8 | view[6];\n\t\t\tconst ver = view[9]<<8 | view[8];\n\t\t\t//Get dimensions and scale\n\t\t\tconst width\t\t= hor & 0x3fff;\n\t\t\tconst horizontalScale   = hor >> 14;\n\t\t\tconst height\t\t= ver & 0x3fff;\n\t\t\tconst verticalScale\t= ver >> 14;\n\t\t\t//Key frame\n\t\t\treturn view.subarray (0,10);\n\t\t}\n\t\t\n\t\t//No key frame\n\t\treturn view.subarray (0,3);\n\t}\n};\n\n\t\t\n\n\n//# sourceURL=webpack:///./lib/VP8PayloadHeader.js?");

/***/ }),

/***/ "./lib/Worker.js":
/*!***********************!*\
  !*** ./lib/Worker.js ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Context_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Context.js */ \"./lib/Context.js\");\n/* harmony import */ var _VP8PayloadHeader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VP8PayloadHeader.js */ \"./lib/VP8PayloadHeader.js\");\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Utils.js */ \"./lib/Utils.js\");\n\n\n\n\nclass TaskQueue\n{\n\tconstructor()\n\t{\n\t\tthis.tasks = [];\n\t\tthis.running = false;\n\t}\n\n\tenqueue(promise,callback,error)\n\t{\n\t\t//enqueue task\n\t\tthis.tasks.push({promise,callback,error});\n\t\t//Try run\n\t\tthis.run();\n\t}\n\n\tasync run()\n\t{\n\t\t//If already running\n\t\tif (this.running)\n\t\t\t//Nothing\n\t\t\treturn;\n\t\t//Running\n\t\tthis.running = true;\n\t\t//Run all pending tasks\n\t\twhile(this.tasks.length)\n\t\t{\n\t\t\ttry {\n\t\t\t\t//Wait for first promise to finish\n\t\t\t\tconst result = await this.tasks[0].promise;\n\t\t\t\t//Run callback\n\t\t\t\tthis.tasks[0].callback(result);\n\t\t\t} catch(e) {\n\t\t\t\t//Run error callback\n\t\t\t\tthis.tasks[0].error(e);\n\t\t\t}\n\t\t\t//Remove task from queue\n\t\t\tthis.tasks.shift();\n\t\t}\n\t\t//Ended\n\t\tthis.running = false;\n\t}\n}\nlet context;\n\nonmessage = async (event) => {\n\t//Get data\n\tconst {transId,cmd,args} = event.data;\n\n\ttry {\n\t\tlet result = true;\n\n\t\t//Depending on the cmd\n\t\tswitch(event.data.cmd)\n\t\t{\n\t\t\tcase \"init\":\n\t\t\t{\n\t\t\t\t//Get info\n\t\t\t\tconst {senderId, config} = args;\n\t\t\t\t//Crate context\n\t\t\t\tcontext = new _Context_js__WEBPACK_IMPORTED_MODULE_0__[\"Context\"](senderId, config);\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tcase \"encrypt\":\n\t\t\t{\n\t\t\t\t//The recrypt queue\n\t\t\t\tconst tasks = new TaskQueue();\n\t\t\t\t//Get event data\n\t\t\t\tconst{id, kind, readableStream, writableStream} = args;\n\t\t\t\t//Create transform stream foo encrypting\n\t\t\t\tconst transformStream = new TransformStream({\n\t\t\t\t\ttransform: async (chunk, controller)=>{\n\t\t\t\t\t\t//Nothing in clear\n\t\t\t\t\t\tlet skip = 0;\n\t\t\t\t\t\t//Check if it is video and we are skipping vp8 payload header\n\t\t\t\t\t\tif (kind==\"video\" && context.isSkippingVp8PayloadHeader())\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t//Get VP8 header\n\t\t\t\t\t\t\tconst vp8 = _VP8PayloadHeader_js__WEBPACK_IMPORTED_MODULE_1__[\"VP8PayloadHeader\"].parse(chunk.data);\n\t\t\t\t\t\t\t//Skip it\n\t\t\t\t\t\t\tskip = vp8.byteLength;\n\t\t\t\t\t\t}\n\t\t\t\t\t\t//Enqueue task\n\t\t\t\t\t\ttasks.enqueue (\n\t\t\t\t\t\t\tcontext.encrypt(kind, id, chunk.data, skip),\n\t\t\t\t\t\t\t(encrypted) => {\n\t\t\t\t\t\t\t\t//Set back encrypted payload\n\t\t\t\t\t\t\t\tchunk.data = encrypted.buffer;\n\t\t\t\t\t\t\t\t//write back\n\t\t\t\t\t\t\t\tcontroller.enqueue(chunk);\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t(error)=>{\n\t\t\t\t\t\t\t\t//TODO: handle errors\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t);\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t\t//Encrypt\n\t\t\t\treadableStream\n\t\t\t\t\t.pipeThrough(transformStream)\n\t\t\t\t\t.pipeTo(writableStream);\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tcase \"decrypt\":\n\t\t\t{\n\t\t\t\t//The recrypt queue\n\t\t\t\tconst tasks = new TaskQueue();\n\t\t\t\t//Last reveiced senderId\n\t\t\t\tlet senderId = -1;\n\t\t\t\t//Get event data\n\t\t\t\tconst{id, kind, readableStream, writableStream} = args;\n\t\t\t\t//Create transform stream for encrypting\n\t\t\t\tconst transformStream = new TransformStream({\n\t\t\t\t\ttransform: async (chunk, controller)=>{\n\t\t\t\t\t\t//Nothing in clear\n\t\t\t\t\t\tlet skip = 0;\n\t\t\t\t\t\t//Check if it is video and we are skipping vp8 payload header\n\t\t\t\t\t\tif (kind==\"video\" && context.isSkippingVp8PayloadHeader())\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t//Get VP8 header\n\t\t\t\t\t\t\tconst vp8 = _VP8PayloadHeader_js__WEBPACK_IMPORTED_MODULE_1__[\"VP8PayloadHeader\"].parse(chunk.data);\n\t\t\t\t\t\t\t//Skip it\n\t\t\t\t\t\t\tskip = vp8.byteLength;\n\t\t\t\t\t\t}\n\t\t\t\t\t\t//Enqueue task\n\t\t\t\t\t\ttasks.enqueue (\n\t\t\t\t\t\t\tcontext.decrypt(kind, id, chunk.data, skip),\n\t\t\t\t\t\t\t(decrypted) => {\n\t\t\t\t\t\t\t\t//Set back decrypted payload\n\t\t\t\t\t\t\t\tchunk.data = decrypted.buffer;\n\t\t\t\t\t\t\t\t//write back\n\t\t\t\t\t\t\t\tcontroller.enqueue(chunk);\n\t\t\t\t\t\t\t\t//If it is a sender\n\t\t\t\t\t\t\t\tif (decrypted.senderId!=senderId)\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t//Store it\n\t\t\t\t\t\t\t\t\tsenderId = decrypted.senderId;\n\t\t\t\t\t\t\t\t\t//Launch event\n\t\t\t\t\t\t\t\t\tpostMessage ({event: {\n\t\t\t\t\t\t\t\t\t\tname\t: \"authenticated\",\n\t\t\t\t\t\t\t\t\t\tdata\t: {\n\t\t\t\t\t\t\t\t\t\t\tid\t : id,\n\t\t\t\t\t\t\t\t\t\t\tsenderId : senderId\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}});\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t(error)=>{\n\t\t\t\t\t\t\t\t//TODO: handle errors\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t);\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t\t//Decrypt\n\t\t\t\treadableStream\n\t\t\t\t\t.pipeThrough(transformStream)\n\t\t\t\t\t.pipeTo(writableStream);\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tdefault:\n\t\t\t\t//Excute \"cmd\" method on context\n\t\t\t\tresult = await context[cmd](...args || []);\n\t\t}\n\t\t//Send result back\n\t\tpostMessage ({transId,result});\n\t} catch (error) {\n\t\tconsole.error(error);\n\t\t//Send error back\n\t\tpostMessage({transId,error});\n\t}\n};\n\n\n//# sourceURL=webpack:///./lib/Worker.js?");

/***/ })

/******/ });