// For JSEncrypt to work in the web worker
self.window = self 

// Importing JSEncrypt
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/2.3.1/jsencrypt.min.js');

let crypt = null
let privateKey = null

// Web worker listener
onmessage = function(e) {
	const [ messageType, messageId, text, key ] = e.data
	let result
	switch(messageType) {
		case 'generate-keys':
			result = generateKeypair()
			break
		case 'encrypt':
			result = encrypt(text, key)
			break
		case 'decrypt':
			result = decrypt(text)
			break
	}
	// Posting result to UI-thread
	postMessage([ messageId, result ])
}

// Generating and storing the keys
function generateKeypair() {
	crypt = new JSEncrypt({default_key_size: 2056})
	privateKey = crypt.getPrivateKey()

	// return the public key
	return crypt.getPublicKey()
}

// Encrypting messages using the destination public key
function encrypt (content, publicKey) {
	crypt.setKey(publicKey)
	return crypt.encrypt(content)
}

// Decrypt using the local private key
function decrypt (content) {
	crypt.setKey(privateKey)
	return crypt.decrypt(content)
}