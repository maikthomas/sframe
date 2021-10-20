import { SFrame } from '../Client.js';
import { Utils } from '../lib/Utils.js';

async function connect() {
  /*
	 Get some key material to use as input to the deriveKey method.
	 The key material is a secret key supplied by the user.
	 */
  async function getRoomKey(roomId, secret) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: enc.encode(roomId),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-CTR', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  //Get keys
  const shared = await getRoomKey('roomId', 'password');
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-521',
    },
    true,
    ['sign', 'verify']
  );
  //Get cam+mic
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });

  //Create pcs
  const sender = (window.sender = new RTCPeerConnection({
    forceEncodedVideoInsertableStreams: true,
    forceEncodedAudioInsertableStreams: true,
    encodedInsertableStreams: true,
  }));
  const decryptedReceiver = (window.decryptedReceiver = new RTCPeerConnection({
    forceEncodedVideoInsertableStreams: true,
    forceEncodedAudioInsertableStreams: true,
    encodedInsertableStreams: true,
  }));

  const sender2 = (window.sender = new RTCPeerConnection({
    forceEncodedVideoInsertableStreams: true,
    forceEncodedAudioInsertableStreams: true,
    encodedInsertableStreams: true,
  }));
  const encryptedReceiver = (window.encryptedReceiver = new RTCPeerConnection({
    // forceEncodedVideoInsertableStreams: true,
    // forceEncodedAudioInsertableStreams: true,
    // encodedInsertableStreams: true,
  }));

  const senderId = 0;
  const receiverId = 1;

  //Create contexts
  const senderClient = await SFrame.createClient(senderId, {
    skipVp8PayloadHeader: true,
  });
  const receiverClient = await SFrame.createClient(receiverId, {
    skipVp8PayloadHeader: true,
  });

  await senderClient.setSenderEncryptionKey(shared);
  // await senderClient.setSenderSigningKey(keyPair.privateKey);

  await receiverClient.addReceiver(senderId);
  await receiverClient.setReceiverEncryptionKey(senderId, shared);
  // await receiverClient.setReceiverVerifyKey(senderId, keyPair.publicKey);

  receiverClient.addEventListener('authenticated', (event) =>
    console.log(
      'Authenticated receiver ' + event.id + ' for sender ' + event.senderId
    )
  );

  //Set it on the local video
  local.srcObject = stream;
  local.play();

  decryptedReceiver.ontrack = (event) => {
    const track = event.track;
    const stream = event.streams[0];

    if (!remote.srcObject) {
      //Set src stream
      remote.srcObject = stream;
      remote.play();
    }

    //decyprt
    receiverClient.decrypt(event.transceiver.mid, event.receiver);
  };

  encryptedReceiver.ontrack = (event) => {
    const track = event.track;
    const stream = event.streams[0];

    if (!encryptedRemote.srcObject) {
      //Set src stream
      encryptedRemote.srcObject = stream;
      encryptedRemote.play();
    }

    //decyprt
    // receiverClient.decrypt(event.transceiver.mid, event.receiver);
  };

  //Interchange candidates
  sender.onicecandidate = ({ candidate }) =>
    candidate && decryptedReceiver.addIceCandidate(candidate);

  sender2.onicecandidate = ({ candidate }) =>
    candidate && encryptedReceiver.addIceCandidate(candidate);

  decryptedReceiver.onicecandidate = ({ candidate }) =>
    candidate && sender.addIceCandidate(candidate);

  encryptedReceiver.onicecandidate = ({ candidate }) =>
    candidate && sender2.addIceCandidate(candidate);

  //Add all tracks
  //Add track
  for (const track of stream.getTracks()) {
    sender.addTrack(track, stream);
    sender2.addTrack(track, stream);
  }

  const offer = await sender.createOffer();
  await sender.setLocalDescription(offer);
  await decryptedReceiver.setRemoteDescription(offer);
  const offer2 = await sender2.createOffer();
  await sender2.setLocalDescription(offer2);
  await encryptedReceiver.setRemoteDescription(offer2);

  //For each sender
  //Encrypt it
  for (const transceiver of sender.getTransceivers())
    senderClient.encrypt(transceiver.mid, transceiver.sender);
  for (const transceiver of sender2.getTransceivers())
    senderClient.encrypt(transceiver.mid, transceiver.sender);

  const answer = await decryptedReceiver.createAnswer();
  await decryptedReceiver.setLocalDescription(answer);
  await sender.setRemoteDescription(answer);
  const answer2 = await encryptedReceiver.createAnswer();
  await encryptedReceiver.setLocalDescription(answer2);
  await sender2.setRemoteDescription(answer2);
}

document.body.onload = () => {
  const dialog = document.querySelector('dialog');
  dialog.showModal();
  dialog.querySelector('button').addEventListener('click', function (event) {
    dialog.close();
    connect();
    event.preventDefault();
  });
};
