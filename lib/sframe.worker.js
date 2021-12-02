/*
  0 1 2 3 4 5 6 7
  +-+-+-+-+-+-+-+-+
  |S|LEN  |X|  K  |
  +-+-+-+-+-+-+-+-+
  SFrame header metadata

  Signature flag (S): 1 bit This field indicates the payload contains a signature of set. Counter Length (LEN): 3 bits This field indicates the length of the CTR fields in bytes. Extended Key Id Flag (X): 1 bit
  Indicates if the key field contains the key id or the key length. Key or Key Length: 3 bits This field contains the key id (KID) if the X flag is set to 0, or the key length (KLEN) if set to 1.

  If X flag is 0 then the KID is in the range of 0-7 and the frame counter (CTR) is found in the next LEN bytes:

  0 1 2 3 4 5 6 7
  +-+-+-+-+-+-+-+-+---------------------------------+
  |S|LEN  |0| KID |    CTR... (length=LEN)          |
  +-+-+-+-+-+-+-+-+---------------------------------+
  Key id (KID): 3 bits The key id (0-7). Frame counter (CTR): (Variable length) Frame counter value up to 8 bytes long.

  if X flag is 1 then KLEN is the length of the key (KID), that is found after the SFrame header metadata byte. After the key id (KID), the frame counter (CTR) will be found in the next LEN bytes:

  0 1 2 3 4 5 6 7
  +-+-+-+-+-+-+-+-+---------------------------+---------------------------+
  |S|LEN  |1|KLEN |   KID... (length=KLEN)    |    CTR... (length=LEN)    |
  +-+-+-+-+-+-+-+-+---------------------------+---------------------------+
*/
const Header = {

  parse : function(buffer)
  {
    //Create uint view
    const view = new Uint8Array(buffer);

    //Get metadata
    const metadata = view[0];

    //Get values
    const s		= !!(metadata & 0x80);
    const len	= (metadata >> 4) & 0x07;
    const x		= !!(metadata & 0x08);
    const k		= metadata & 0x07;

    //Get key id
    let keyId = 0;
    //Check if it is the extented key format
    if (x)
    {
      //Read length
      for (let i=0;i<k;i++)
        keyId = (keyId * 256) + view[i+1];
    } else {
      //Short version
      keyId = k;
    }

    //Get ctr
    const ini = x ? k + 1 : 1;
    let counter = 0;
    //Read length
    for (let i=0;i<len;i++)
      counter = (counter * 256) + view[ini+i];

    //Get header buffer view
    const header = view.subarray(0, x ? k + len + 1 : len + 1);

    //Add parsed atributes
    header.signature   = s;
    header.keyId	   = keyId;
    header.counter	   = counter;

    //Done
    return header;
  },
  generate: function(signature,keyId,counter)
  {
    //Check keyId
    Header.checkKeyId(keyId);

    //Calcultate variavle length
    const varlen = (x) => x ? parseInt(Math.log(x) / Math.log(256))+1 : 1;

    //Get key extension and length
    const x = keyId > 7;
    const k = x ? varlen(keyId) : keyId;

    //Get counter length
    const len = varlen(counter);

    //Ensure counter is not huge
    if (len>7)
      //Error
      throw new Error("Counter is too big");

    //Generate header
    const header = new Uint8Array( x ? 1 + k + len : 1 + len);

    //Set metadata header
    header[0] = !!signature;
    header[0] = header[0] << 3  | ( len & 0x07);
    header[0] = header[0] << 1  | x;
    header[0] = header[0] << 3  | ( k & 0x07);

    //Add parsed atributes
    header.signature   = !!signature;
    header.keyId	   = keyId;
    header.counter	   = counter;

    //If extended key
    if (x)
      //Add key id
      for (let i=0; i<k; ++i)
        header[i+1] = (keyId >> (k-1-i)*8) & 0xff;
    //The coutner init
    const ini = x ? k + 1 : 1;
    //Add counter
    for (let i=0; i<len; ++i)
      header[ini+i] = (counter >> (len-1-i)*8) & 0xff;


    //Done
    return header;
  }
};

Header.MaxKeyId = 0xFFFFFFFFFF;

Header.checkKeyId = function(keyId)
{
  //Check it is possitive
  if (keyId<0)
    //Error
    throw new Error("keyId must be possitive");
  //Check it is possitive
  if (keyId>Header.MaxKeyId)
    //Error
    throw new Error("keyId must be 5 bytes long at most");
};

//TODO: Update to Ed25519 when available
// https://chromestatus.com/features/4913922408710144
// https://chromium.googlesource.com/chromium/src/+log/master/components/webcrypto/algorithms/ed25519.cc

class EcdsaSignKey
{

  async setKey(privKey)
  {
    //If it is a crypto key already
    if (privKey instanceof CryptoKey)
    {
      //Check private key algorithm
      if (privKey.algorithm.name!="ECDSA" || !privKey.usages.includes("sign"))
        //Error
        throw new Error("Invalid key");
      //Set it
      this.privKey = privKey;
    } else {
      //Import it
      this.privKey = await crypto.subtle.importKey(
        "pkcs8",
        privKey,
        {
          name		: "ECDSA",
          namedCurve	: "P-521"
        },
        false,
        ["sign"]
      );
    }
  }

  async sign(authTags)
  {
    //Verify
    return new Uint8Array(await crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: "SHA-512"
      },
      this.privKey,
      authTags
    ));
  }

  static getSignatureLen()
  {
    return 64;
  }

  static async create(privKey)
  {
    //Craete key
    const key = new EcdsaSignKey();
    //Set key
    await key.setKey(privKey);
    //Done
    return key;

  }
};

const Utils =
  {
    toHex : function(buffer)
    {
      return Array.prototype.map.call(buffer instanceof Uint8Array ? buffer : new Uint8Array (buffer), x =>x.toString(16).padStart(2,"0")).join("");
    },
    fromHex: function(str)
    {
      const bytes = [];
      for (let i=0;i<str.length/2;++i)
        bytes.push(parseInt(str.substring(i*2, (i+1)*2), 16));

      return new Uint8Array(bytes);
    },
    equals : function(a,b)
    {
      if (a.byteLength != b.byteLength) return false;
      for (let i = 0 ; i != a.byteLength ; i++)
        if (a[i] != b[i]) return false;
      return true;
    }
  };

const textEncoder = new TextEncoder()

const Salts =  {
  "SaltKey"		: textEncoder.encode("SFrameSaltKey"),
  "EncryptionKey"		: textEncoder.encode("SFrameEncryptionKey"),
  "AuthenticationKey"	: textEncoder.encode("SFrameAuthenticationKey"),
  "RatchetKey"		: textEncoder.encode("SFrameRatchetKey")
};

const IV =
  {
    generate : function(keyId,counter,salt)
    {
      //128 bits
      const iv = new Uint8Array (16);
      //Get view
      const view = new DataView(iv.buffer);
      //Set keyId
      view.setBigUint64(0, BigInt(counter));
      //Set coutner
      view.setBigUint64(8, BigInt(keyId));
      //Xor with salt key
      for (let i=0; i<iv.byteLength; ++i)
        //xor
        view.setUint8(i,iv[i]^salt[i]);
      //return buffer
      return iv;
    }
  };

class AesCm128HmacSha256EncryptionKey
{
  async setKey(key)
  {
    if (key instanceof CryptoKey)
    {
      //Check private key algorithm
      if (key.algorithm.name!="HKDF")
        //Error
        throw new Error("Invalid key");
    } else {
      //Import key
      key = await crypto.subtle.importKey(
        "raw",
        key,
        "HKDF",
        false,
        ["deriveBits", "deriveKey"]
      );
    }

    //Get salt key
    this.saltKey = new Uint8Array(await crypto.subtle.deriveBits(
      {
        name : "HKDF",
        hash : "SHA-256",
        salt : Salts.SaltKey,
        info : new ArrayBuffer()
      },
      key,
      128
    ));

    //Get encryption key
    this.encryptionKey = await crypto.subtle.deriveKey(
      {
        name : "HKDF",
        hash : "SHA-256",
        salt : Salts.EncryptionKey,
        info : new ArrayBuffer()
      },
      key,
      {
        name : "AES-CTR",
        length : 128
      },
      false,
      ["encrypt","decrypt"]
    );

    //Get authentication key
    this.authKey = await crypto.subtle.deriveKey(
      {
        name : "HKDF",
        hash : "SHA-256",
        salt : Salts.AuthenticationKey,
        info : new ArrayBuffer()
      },
      key,
      {
        name : "HMAC",
        hash : "SHA-256",
        length : 256
      },
      false,
      ["sign","verify"]
    );

    //Derive Ratchet key
    this.ratchetKey = await crypto.subtle.deriveBits(
      {
        name : "HKDF",
        hash : "SHA-256",
        salt : Salts.RatchetKey,
        info : new ArrayBuffer()
      },
      key,
      256
    );
  }

  async encrypt(type,header,payload,extraBytes,skip)
  {
    //Encure int
    skip = skip ? skip : 0;

    //Create IV
    const iv = IV.generate(header.keyId, header.counter, this.saltKey);

    //Encrypt
    const encrypted = await crypto.subtle.encrypt(
      {
        name	: "AES-CTR",
        counter : iv,
        length  : 128
      },
      this.encryptionKey,
      payload
    );

    //Get auth tag length from media type
    const authTagLength = AesCm128HmacSha256EncryptionKey.getAuthTagLen(type);

    //Create encrypted frame
    const encryptedFrame = new Uint8Array(header.byteLength + payload.byteLength + authTagLength + extraBytes + skip);

    //Set header and encrypted payolad
    encryptedFrame.set(header, skip);
    encryptedFrame.set(new Uint8Array(encrypted), skip + header.length);

    //Authenticate
    const signature = new Uint8Array(await crypto.subtle.sign(
      "HMAC",
      this.authKey,
      encryptedFrame.subarray(skip, skip + header.byteLength + encrypted.byteLength)
    ));

    //Truncate
    const authTag = signature.subarray(0, authTagLength);

    //Append authentication tag
    encryptedFrame.set(authTag, skip + encrypted.byteLength + header.byteLength );

    //Done
    return [encryptedFrame,authTag];

  }

  async decrypt(type, header, encryptedFrame, extrabytes, skip)
  {
    //Encure int
    skip = skip ? skip : 0;

    //Create IV
    const iv = IV.generate(header.keyId, header.counter, this.saltKey);

    //Get auth tag length from media type
    const authTagLength = AesCm128HmacSha256EncryptionKey.getAuthTagLen(type);

    //Get encrypted frame length (without extra bytes from signature)
    const frameLength = encryptedFrame.byteLength - extrabytes - skip;

    //Get authentication tag
    const authTag = encryptedFrame.subarray(skip + frameLength - authTagLength, skip + frameLength);

    //Get encrypted payload
    const encrypted = encryptedFrame.subarray(skip + header.byteLength, skip + frameLength - authTagLength);

    //Calculate signature
    const signature = new Uint8Array(await crypto.subtle.sign(
      "HMAC",
      this.authKey,
      encryptedFrame.subarray(skip, skip + header.byteLength + encrypted.byteLength)
    ));

    //Authenticate authTag
    let authenticated = true;
    //Avoid timimg attacks by iterating over all bytes
    for (let i=0;i<authTagLength;++i)
      //check signature
      authenticated &= authTag[i]===signature[i];

    //If not all where equal
    if (!authenticated)
      //Authentication error
      throw new Error("Authentication error");

    //Decrypt
    const payload = new Uint8Array (await crypto.subtle.decrypt(
      {
        name	: "AES-CTR",
        counter : iv,
        length  : 128
      },
      this.encryptionKey,
      encrypted
    ));

    //Done
    return [payload, authTag];
  }

  async ratchet()
  {
    //Create new key
    const key = new AesCm128HmacSha256EncryptionKey();

    //Set ratchet key
    await key.setKey(this.ratchetKey);

    //Done
    return key;
  }

  static getAuthTagLen(type)
  {
    return type.toLowerCase()==="video" ? 10 : 4;
  };

  static async create(raw)
  {
    //Create new key
    const key = new AesCm128HmacSha256EncryptionKey();
    //Set raw key
    await key.setKey(raw);
    //Done
    return key;
  }
};


const SigningFrameInterval = 10;

class Sender
{
  constructor(senderId)
  {
    //Check keyId
    Header.checkKeyId(senderId);

    //The global frame counter
    this.counter = 0;

    //Store senderId/keyId
    this.senderId = senderId;

    //Pending frames for signing
    this.pending = new Map();
  }

  async encrypt(type, ssrcId, payload, skip)
  {
    // console.warn('BOO: BigWorker.Sender: encrypt');
    //Check we have a valid key
    if (!this.key)
      throw Error("Encryption key not set");

    //convert if needed
    if (!(payload instanceof Uint8Array))
      payload = new Uint8Array (payload);

    //Encure int
    skip = skip ? skip : 0;

    //Get counter for frame
    const counter = this.counter++;

    //If we don't have the ssrc
    if (!this.pending.has(ssrcId))
      //Create new pending frames array
      this.pending.set(ssrcId,[]);

    //Get pending frames for signature
    const pending = this.pending.get(ssrcId);

    //Do we need to sign the frames?
    const signing = this.signingKey && pending.length > SigningFrameInterval;

    //Get auth tag len for type
    const authTagLen = AesCm128HmacSha256EncryptionKey.getAuthTagLen(type);

    //Calculae extra bytes
    const extraBytes = signing ? pending.length * AesCm128HmacSha256EncryptionKey.getAuthTagLen(type) + 1 + EcdsaSignKey.getSignatureLen() : 0;

    //Generate header
    const header = Header.generate(signing,this.senderId,counter);

    //Encrypt frame
    const [encryptedFrame,authTag] = await this.key.encrypt(type, header, payload, extraBytes, skip);

    //If we are sending part of the frame in clear
    if (skip)
      //Copy skiped payload
      encryptedFrame.set(payload.subarray(0,skip),0);

    //If we need to sign the frame
    if (signing)
    {
      //Append after auth tag
      let ini = skip + encryptedFrame.byteLength - extraBytes;

      //Get tag list view
      const authTags = encryptedFrame.subarray(ini - authTagLen, (pending.length + 1) * authTagLen);

      //Add all previous tags
      for (const previousTag of pending)
      {
        //Append to frame
        encryptedFrame.set(previousTag, ini);
        //Move
        ini += authTagLen;
      }

      //Add number of bytes
      encryptedFrame[ini++] = pending.length;

      //Create signature with all auth tags (including this frame's one)
      const signature = await this.signingKey.sign(authTags);

      //Add signature
      encryptedFrame.set(signature, ini);

      //Empty pending list
      this.pending.set(ssrcId,[]);

      //If we can sign
    } else if (this.signingKey) {
      //Append a copy of current tag at the begining
      pending.unshift(authTag.slice());
    }

    //Set authenticated sender id and frame Id
    encryptedFrame.senderId = header.keyId;
    encryptedFrame.frameId  = header.counter;

    //Done
    return encryptedFrame;
  }

  async setSigningKey(key)
  {
    //Create new singing key
    this.signingKey = await EcdsaSignKey.create(key);
  }

  async setEncryptionKey(key)
  {
    //Create new encryption key
    this.key = await AesCm128HmacSha256EncryptionKey.create(key);
  }

  async ratchetEncryptionKey()
  {
    //Check we have a valid key
    if (!this.key)
      throw Error("Encryption key not set");

    //Rachet the key and store it
    this.key = await this.key.ratchet();
  }
};


class EcdsaVerifyKey
{
  async setKey(pubKey)
  {
    //If it is a crypto key already
    if (pubKey instanceof CryptoKey)
    {
      //Check
      if (pubKey.algorithm.name!="ECDSA" || !pubKey.usages.includes("verify"))
        //Error
        throw new Error("Invalid key");
      //Set it
      this.pubKey = pubKey;
    } else {
      //Import it
      this.pubKey = await crypto.subtle.importKey(
        "raw",
        pubKey,
        {
          name		: "ECDSA",
          namedCurve	: "P-521"
        },
        false,
        ["verify"]
      );
    }
  }

  async verify(signed,signature)
  {
    //Verify
    return await crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: "SHA-512"
      },
      this.pubKey,
      signature,
      signed
    );
  }

  static getSignatureLen()
  {
    return 64;
  }

  static async create(pubKey)
  {
    //Craete key
    const key = new EcdsaVerifyKey();
    //Set key
    await key.setKey(pubKey);
    //Done
    return key;

  }
};

const MaxRachetAttemtps = 5;
const ReplayWindow = 128;
const KeyTimeout = 1000;

class Receiver
{
  constructor(senderId)
  {
    //Check keyId
    Header.checkKeyId(senderId);

    //Store sender id
    this.senderId = senderId;
    //Last received counter
    this.maxReceivedCounter = -1;
    //Number or ratchets of current key
    this.numKeyRatchets = 0;
    //Create keyring
    this.keyring = [];
    //Pending verified tags
    this.pending = new Map();

    //Scheduled keys
    this.scheduledKeys = new WeakSet ();

    //Function to clear up keys up to given one
    this.schedulePreviousKeysTimeout = (key) =>{
      //If this is the only key
      if (this.keyring.length==1 && this.keyring[0]===key)
        //Do nothing
        return;
      //If has been already scheduled
      if (this.scheduledKeys.has(key))
        //Not do it twice
        return;
      //Add it
      this.scheduledKeys.add(key);
      //Schedule key timeout of previous keys
      setTimeout(()=>{
        //Find key index
        const i = this.keyring.findIndex(k=>k===key);
        //Remove previous keys
        this.keyring = this.keyring.splice(i);
      }, KeyTimeout);
    };
  }

  async decrypt(type, ssrcId, header, encryptedFrame, skip)
  {
    let authTag, payload, extrabytes = 0, signature, signed;
    const prevAuthTags = [];

    // console.warn('BOO: BigWorker.Receiver: decrypt');
    //convert if needed
    if (!(encryptedFrame instanceof Uint8Array))
      encryptedFrame = new Uint8Array (encryptedFrame);

    //Replay attack protection
    if (header.counter<this.maxReceivedCounter && this.maxReceivedCounter-header.counter>ReplayWindow)
      //Error
      throw new Error("Replay check failed, frame counter too old");

    //Check if frame contains signature
    if (header.signature)
    {
      //Start from the end
      let end = encryptedFrame.byteLength;

      //Get lengths
      const singatureLength = ECDSAVerifyKey.getSignatureLen();
      const authTagLength   = AesCm128HmacSha256EncryptionKey.getAuthTagLen(type);

      //Get signature
      signature = encryptedFrame.subarray(end - singatureLength, end);
      //Move backward
      end -= singatureLength;

      //Get number of tags
      const num = encryptedFrame[end--];

      //Read all tags
      for (let i=0; i<num; ++i)
      {
        //Get previous tag
        const prevTag = encryptedFrame.subarray(end - authTagLength, end);
        //Move backward
        end -= authTagLength;
        //Add tag to previous tags in hex
        prevAuthTags.push(Utils.toHex(prevTag))
      }
      //Get the extra bytes
      extrabytes = encryptedFrame.byteLength - end;

      //Move backward to start oth current frame auth tag
      end -= authTagLength;

      //Get singed part
      signed = encryptedFrame.subarray(end, encryptedFrame.byteLength - singatureLength)
    }

    //For each key in key ring
    for (let i=0;i<this.keyring.length;++i)
    {
      //Get key from ring
      const key = this.keyring[i];
      try {
        //Try to decrypt payload
        [payload, authTag] = await key.decrypt(type, header, encryptedFrame, extrabytes, skip);
        //Done
        break;
      } catch(e) {

      }
    }

    //If not found yet
    if (!payload)
    {
      //Get last key
      let key = this.keyring[this.keyring.length-1];

      //Try ractchet last key
      for (let i=this.numKeyRatchets; i<MaxRachetAttemtps; ++i)
      {
        //Rachet key
        key = await key.ratchet();

        //Append to the keyring
        this.keyring.push(key);

        try {
          //Try to decrypt payload
          [payload, authTag] = await key.decrypt(type, header, encryptedFrame, extrabytes, skip);
          //Activate
          this.schedulePreviousKeysTimeout(key);
          //Done
          break;
        } catch(e) {

        }
      }
    }

    //Last check
    if (!payload)
      //Decryption failed
      throw new Error("Decryption failed");

    //If we are sending part of the frame in clear
    if (skip)
      //Copy skiped payload
      payload.set(encryptedFrame.subarray(0,skip),0);

    //Check if have received anything from this ssrc before
    if (!this.pending.has(ssrcId))
      //Add it
      this.pending.set(ssrcId,new Set());

    //Get pending list
    const pending = this.pending.get(ssrcId);

    //Check if it constains signatures
    if (header.signed)
    {
      //try to verify list
      if (!await this.verifyKey.verify(signed,signature))
        //Error
        throw new Error("Could not verify signature");
      //For each signed tag
      for (const tag in prevAuthTags)
        //Delete from pending to be verified tags
        pending.delete(tag);
    } else {
      //Push this tag to
      pending.add(Utils.toHex(authTag));
    }

    //Set authenticated sender id and frame Id
    payload.senderId = header.keyId;
    payload.frameId  = header.counter;

    //Store last received counter
    this.maxReceivedCounter = Math.max(header.counter, this.maxReceivedCounter);

    //Return decrypted payload
    return payload;
  }

  async setVerifyKey(key)
  {
    //Create new singing key
    this.verifyKey = EcdsaVerifyKey.create(key);
  }

  async setEncryptionKey(raw)
  {
    //Create new encryption key
    const key = await AesCm128HmacSha256EncryptionKey.create(raw);
    //Append to the keyring
    this.keyring.push(key);
    //Restart ratchet count number
    this.numKeyRatchets = 0;
    //Activate
    this.schedulePreviousKeysTimeout(key);
  }
};

class Context
{

  constructor(senderId, config)
  {
    //Store config
    this.config = Object.assign({}, config);
    //Only one sender per context
    this.sender = new Sender(senderId);

    //The map of known remote senders
    this.receivers = new Map();
  }

  isSkippingVp8PayloadHeader()
  {
    return !!this.config.skipVp8PayloadHeader;
  }

  async setSenderEncryptionKey(key)
  {
    //Set it
    return this.sender.setEncryptionKey(key);
  }

  async ratchetSenderEncryptionKey()
  {
    //Set it
    return this.sender.ratchetEncryptionKey();
  }

  async setSenderSigningKey(key)
  {
    //Set it
    return this.sender.setSigningKey(key);
  }

  addReceiver(receiverkKeyId)
  {
    console.warn('BOO: addReceiver');
    //Check we don't have a receiver already for that id
    if(this.receivers.has(receiverkKeyId)) {
      console.warn('BOO: ... error');
      //Error
      throw new Error("There was already a receiver for keyId "+receiverkKeyId);
    }

    //Add new
    this.receivers.set(receiverkKeyId, new Receiver(receiverkKeyId));
    console.warn('BOO: ... done addReceiver');
  }

  async setReceiverEncryptionKey(receiverkKeyId, key)
  {
    console.warn('BOO: setReceiverEncryptionKey');
    //Get receiver for the sender
    const receiver = this.receivers.get(receiverkKeyId);

    //IF not found
    if (!receiver) {
      console.warn('BOO: ... error');
      //Error
      throw new Error("No receiver found for keyId "+receiverkKeyId);
    }

    //Rachet
    const status = await receiver.setEncryptionKey(key);
    console.warn(`BOO: ${status}`);

    console.warn('BOO: done');
    return status;
  }

  async setReceiverVerifyKey(receiverkKeyId,key)
  {
    console.warn('BOO: setReceiverVerifyKey');
    //Get receiver for the sender
    const receiver = this.receivers.get(receiverkKeyId);

    //IF not found
    if (!receiver) {
      console.warn('BOO: error');
      //Error
      throw new Error("No receiver found for keyId "+receiverkKeyId);
    }

    //Rachet
    const status = await receiver.setVerifyKey(key);
    console.warn(`BOO: status ${status}`);

    console.warn('BOO: done');
    return status;
  }

  deleteReceiver(receiverkKeyId)
  {
    //Delete receiver
    return this.receivers.delete(receiverkKeyId);
  }

  async encrypt(type, ssrcId, frame, skip)
  {
    //Encrypt it
    return this.sender.encrypt(type, ssrcId, frame, skip);
  }

  async decrypt(type, ssrcId, encryptedFrame, skip)
  {
    //convert if needed
    if (!(encryptedFrame instanceof Uint8Array))
      encryptedFrame = new Uint8Array (encryptedFrame);

    //Parse encrypted payload
    const header = Header.parse(encryptedFrame.subarray(skip));

    //Get receiver for the sender
    const receiver = this.receivers.get(header.keyId);

    //IF not found
    if (!receiver)
      //Error
      throw new Error("No receiver found for keyId " + header.keyId);

    //Decrypt it
    return receiver.decrypt(type, ssrcId, header, encryptedFrame, skip);
  }

};


const VP8PayloadHeader = {

  parse : function(buffer)
  {
    //Check size
    if (buffer.byteLength<3)
      //Invalid
      return null;

    //Create uint view
    const view = new Uint8Array(buffer);

    //Read comon 3 bytes
    //   0 1 2 3 4 5 6 7
    //  +-+-+-+-+-+-+-+-+
    //  |Size0|H| VER |P|
    //  +-+-+-+-+-+-+-+-+
    //  |     Size1     |
    //  +-+-+-+-+-+-+-+-+
    //  |     Size2     |
    //  +-+-+-+-+-+-+-+-+
    const firstPartitionSize	= view[0] >> 5;
    const showFrame			= view[0] >> 4 & 0x01;
    const version			= view[0] >> 1 & 0x07;
    const isKeyFrame		= (view[0] & 0x01) == 0;

    //check if more
    if (isKeyFrame)
    {
      //Check size
      if (buffer.byteLength<10)
        //Invalid
        return null;
      //Get size in le
      const hor = view[7]<<8 | view[6];
      const ver = view[9]<<8 | view[8];
      //Get dimensions and scale
      const width		= hor & 0x3fff;
      const horizontalScale   = hor >> 14;
      const height		= ver & 0x3fff;
      const verticalScale	= ver >> 14;
      //Key frame
      return view.subarray (0,10);
    }

    //No key frame
    return view.subarray (0,3);
  }
};

class TaskQueue
{
  constructor()
  {
    this.tasks = [];
    this.running = false;
  }

  enqueue(promise,callback,error)
  {
    //enqueue task
    this.tasks.push({promise,callback,error});
    //Try run
    this.run();
  }

  async run()
  {
    //If already running
    if (this.running)
      //Nothing
      return;
    //Running
    this.running = true;
    //Run all pending tasks
    while(this.tasks.length)
    {
      try {
        //Wait for first promise to finish
        const result = await this.tasks[0].promise;
        //Run callback
        this.tasks[0].callback(result);
      } catch(e) {
        //Run error callback
        this.tasks[0].error(e);
      }
      //Remove task from queue
      this.tasks.shift();
    }
    //Ended
    this.running = false;
  }
}
let context;

onmessage = async (event) => {
  //Get data
  const {transId,cmd,args} = event.data;

  try {
    let result = true;

    console.warn(`BOO: ***** BigWorker cmd ${event.data.cmd}`);
    //Depending on the cmd
    switch(event.data.cmd)
    {
      case "init":
      {
        console.warn('BOO: init');
        //Get info
        const {senderId, config} = args;
        //Crate context
        context = new Context(senderId, config);
        break;
      }
      case "encrypt":
      {
        console.warn('BOO: encrypt');
        //The recrypt queue
        const tasks = new TaskQueue();
        //Get event data
        // const{id, kind, readableStream, writableStream} = args;
        const{id, kind, stream} = args;
        //Create transform stream foo encrypting
        const transformStream = new TransformStream({
          transform: async (chunk, controller)=>{
            //Nothing in clear
            let skip = 0;
            //Check if it is video and we are skipping vp8 payload header
            if (kind=="video" && context.isSkippingVp8PayloadHeader())
            {
              //Get VP8 header
              const vp8 = VP8PayloadHeader.parse(chunk.data);
              //Skip it
              skip = vp8.byteLength;
            }
            //Enqueue task
            tasks.enqueue (
              context.encrypt(kind, id, chunk.data, skip),
              (encrypted) => {
                //Set back encrypted payload
                chunk.data = encrypted.buffer;
                //write back
                controller.enqueue(chunk);
              },
              (error)=>{
                //TODO: handle errors
                console.warn(`BOO: encrypting error ${error}`);
              }
            );
          }
        });
        //Encrypt
        // readableStream
        try {
          stream.readable
            .pipeThrough(transformStream)
          // .pipeTo(writableStream);
            .pipeTo(stream.writable);
        } catch (err) {
          console.warn(`BOO: more encrypting errors ${err}`);
        }
        break;
      }
      case "decrypt":
      {
        console.warn('decrypt');
        //The recrypt queue
        const tasks = new TaskQueue();
        //Last reveiced senderId
        let senderId = -1;
        //Get event data
        // const{id, kind, readableStream, writableStream} = args;
        const{id, kind, stream} = args;
        //Create transform stream for encrypting
        const transformStream = new TransformStream({
          transform: async (chunk, controller)=>{
            //Nothing in clear
            let skip = 0;
            //Check if it is video and we are skipping vp8 payload header
            if (kind=="video" && context.isSkippingVp8PayloadHeader())
            {
              //Get VP8 header
              const vp8 = VP8PayloadHeader.parse(chunk.data);
              //Skip it
              skip = vp8.byteLength;
            }
            //Enqueue task
            tasks.enqueue (
              context.decrypt(kind, id, chunk.data, skip),
              (decrypted) => {
                //Set back decrypted payload
                chunk.data = decrypted.buffer;
                //write back
                controller.enqueue(chunk);
                //If it is a sender
                if (decrypted.senderId!=senderId)
                {
                  //Store it
                  senderId = decrypted.senderId;
                  //Launch event
                  postMessage ({event: {
                    name	: "authenticated",
                    data	: {
                      id	 : id,
                      senderId : senderId
                    }
                  }});
                }
              },
              (error)=>{
                //TODO: handle errors
                // console.warn(`BOO: decrypting error ${error}`);
              }
            );
          }
        });
        //Decrypt
        // readableStream
        //   .pipeThrough(transformStream)
        //   .pipeTo(writableStream);
        try {
          stream.readable
            .pipeThrough(transformStream)
            .pipeTo(stream.writable);
        } catch (err) {
          console.warn(`BOO: more decrypting errors ${err}`);
        }
        break;
      }
      default:
      //Excute "cmd" method on context
      result = await context[cmd](...args || []);
    }
    //Send result back
    postMessage ({transId,result});
  } catch (error) {
    console.error(error);
    //Send error back
    postMessage({transId,error});
  }
};
