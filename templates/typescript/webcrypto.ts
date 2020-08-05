let subtle = self.crypto.subtle;

async function handleRequest() {
  let msg = "alice and bob"
  let hmacresult = await generateSignandVerify({
    name: "HMAC",
    hash: "sha-256"
  })
  console.log("Result of HMAC generate, sign, verify: ", hmacresult)
  let aesresult = await generateEncryptDecrypt({
    name: "AES-GCM",
    length: 256
  }, msg)
  var dec = new TextDecoder();
  if (msg == dec.decode(aesresult)) {
    console.log("AES encrypt decrypt successful")
  } else {
    console.log("AES encrypt decrypt failed")
  }
  return new Response()
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest())
})

async function generateSignandVerify(algorithm: any) {
  let rawMessage = "alice and bob"
  let key = await subtle.generateKey(algorithm, true, ["sign", "verify"]);
  let enc = new TextEncoder();
  let encoded = enc.encode(rawMessage);
  let signature = await self.crypto.subtle.sign(
    algorithm,
    key as CryptoKey,
    encoded
  );
  let result = await self.crypto.subtle.verify(
    algorithm,
    key as CryptoKey,
    signature,
    encoded
  );
  return result;
}

async function generateEncryptDecrypt(algorithm: any, msg: string) {
  let key = await subtle.generateKey(
    algorithm,
    true,
    ["encrypt", "decrypt"]
  );
  let enc = new TextEncoder();
  let encoded = enc.encode(msg);
  algorithm.iv = crypto.getRandomValues(new Uint8Array(16))
  let signature = await self.crypto.subtle.encrypt(
    algorithm,
    key as CryptoKey,
    encoded
  );
  let result = await self.crypto.subtle.decrypt(
    algorithm,
    key as CryptoKey,
    signature
  );
  return result;
}
