import {SFrame}	from "../Client.js";
import {Utils}	from "../lib/Utils.js";


async function connect()
{
	//Get keys
	const shared = Utils.fromHex("12345678901234567890123456789012");
	const keyPair = await window.crypto.subtle.generateKey (
		{
			name: "ECDSA",
			namedCurve: "P-521"
		},
		true,
		["sign", "verify"]
	);
	//Get cam+mic
	const stream = await navigator.mediaDevices.getUserMedia({
		audio: true,
		video: true
	});
	
	//Create pcs
	const sender	= window.sender   = new RTCPeerConnection({
		forceEncodedVideoInsertableStreams: true,
		forceEncodedAudioInsertableStreams: true,
		encodedInsertableStreams: true
	});
	const receiver	= window.receiver = new RTCPeerConnection({
		forceEncodedVideoInsertableStreams: true,
		forceEncodedAudioInsertableStreams: true,
		encodedInsertableStreams: true
	});
	
	const senderId = 0;
	const receiverId = 1;
	
	//Create contexts
	const senderClient   = await SFrame.createClient(senderId, {
		skipVp8PayloadHeader : true
	});
	const receiverClient = await SFrame.createClient(receiverId, {
		skipVp8PayloadHeader : true
	});
	
	await senderClient.setSenderEncryptionKey(shared);
	await senderClient.setSenderSigningKey(keyPair.privateKey);
	
	await receiverClient.addReceiver(senderId);
	await receiverClient.setReceiverEncryptionKey(senderId,shared);
	await receiverClient.setReceiverVerifyKey(senderId,keyPair.publicKey);
	
	receiverClient.addEventListener("authenticated",event=>console.log("Authenticated receiver", event));
	
	
	//Set it on the local video
	local.srcObject = stream;
	local.play();
	
	receiver.ontrack = (event) => {
		const track	= event.track;
		const stream	= event.streams[0];
	
		if (!remote.srcObject)
		{
			//Set src stream
			remote.srcObject = stream;
			remote.play();
		}
		
		//decyprt
		receiverClient.decrypt(event.transceiver.mid, event.receiver);
	};
	
	//Interchange candidates
	sender.onicecandidate	= ({candidate}) => candidate && receiver.addIceCandidate(candidate);
	receiver.onicecandidate = ({candidate}) => candidate && sender.addIceCandidate(candidate);
	
	//Add all tracks
	for (const track of stream.getTracks())
		//Add track
		sender.addTrack(track,stream);
	
	const offer = await sender.createOffer();
	await sender.setLocalDescription(offer);
	await receiver.setRemoteDescription(offer);
	
	//For each sender
	for (const transceiver of sender.getTransceivers ())
		//Encrypt it
		senderClient.encrypt(transceiver.mid, transceiver.sender);
	
	const answer = await receiver.createAnswer();
	await receiver.setLocalDescription(answer);
	await sender.setRemoteDescription(answer);

};

document.body.onload = ()=>{
	
	const dialog = document.querySelector('dialog');
	dialog.showModal();
	dialog.querySelector('button').addEventListener('click', function(event) {
		dialog.close();
		connect();
		event.preventDefault();
	});
};
