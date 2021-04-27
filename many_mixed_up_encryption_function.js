const encrypted_data = 'IZxZZ77uyRtKpP+/SI502mM+At4uxv4g2zxncC0SHUQ9tyL1XD1yDgDB0kahsuFuBy8zEBBoQu2qi+ayk+5LZ8mASKuFrvEcZGinpAvnr4OK+q1jrKKDEi7L8P8+J/NweAqEXaJHMbXlXAO+VJPX1VUBAmr7S3oOsgzevILXnA+PSJmkPRlDfeW+hD0ZB5VfYFryOi7FWKgmDY1sN1HWKAOaS7ipb3xz18C7d60aLU6qM+vdqpbSs+Q4KBYQj9cGNszSjyVxdolIRrEoWvg/0t9+IARzWFS4/wpK42f5mSmmizRuPajs3kyzY3Gg7C9vj27g96QfeKGZla6iBXDaWcMQGxwtLkpPwCqIHLCEQIcD2IrvvJi3Apn+D0jF6/qf4i32Foxu9Fhie3QzNKkRmcjotGzfv0RvkWfdHVkDWobZEPa2sDiqIDZnc4/TS88imx5SwZjHdmm7eFb4Zt+OnTjhYzbuZT764bprZPIwpi1aGFU9+4JjorAqoh0E5LJqO+FLbvC2MeulZo44P+Toq/g7Klg+Y17MPBTNSxzZsHcMnKL2yQxbQcyb7NDFMar/1EL5pEV32Hm65cZO2TCUPQ9fpv0FGybMRc4M/i4aW3bcvtv8WY3AMIvpdKp1JRN0M2Emb/zw/y2bK11Kg0Fz3A/NfBVqYfugBAlIHfju2RQ='
function decryptMessageUsingPrivatekey(privateKey, ciphertext) {
    return window.crypto.subtle.decrypt(
        {
            name: "RSA-OAEP"
        },
        privateKey,
        ciphertext
    );
}
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}
async function exportPrivateCryptoKey(key) {
    const exported = await window.crypto.subtle.exportKey(
        "pkcs8",
        key
    );
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
    console.log(pemExported);
}
async function exportPublicCryptoKey(key) {
    const exported = await window.crypto.subtle.exportKey(
        "spki",
        key
    );
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
    console.log(pemExported);
}
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
function importPrivateKey(pem) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

    return window.crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        {
            name: "RSA-OAEP",
            // Consider using a 4096-bit key for systems that require long-term security
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-512",
        },
        true,
        ["decrypt"]
    );
}
function encryptPublickeyMessage(publicKey, message) {
    return window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      publicKey,
      message
    );
  }
function login() {
    const private_pem = `-----BEGIN PRIVATE KEY-----
    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
    -----END PRIVATE KEY-----`
    window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            // Consider using a 4096-bit key for systems that require long-term security
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-512",
        },
        true,
        ["encrypt", "decrypt"]
    ).then((key) => {
        // console.log(key);
        // exportPublicCryptoKey(key.publicKey)
        let enc = new TextEncoder();
        const encoded_message = encryptPublickeyMessage(key.publicKey, enc.encode("this is always a good time!!"))
        encoded_message.then(text=>{
            const dencrypted_message = decryptMessageUsingPrivatekey(key.privateKey,text);
            dencrypted_message.then(text=>{
                console.log(ab2str(text));
            })
        })
        // exportPrivateCryptoKey(key.privateKey)
    });
    const private_key = importPrivateKey(private_pem)
    function byteToUint8Array(byteArray) {
        var uint8Array = new Uint8Array(byteArray.length);
        for (var i = 0; i < uint8Array.length; i++) {
            uint8Array[i] = byteArray[i];
        }

        return uint8Array;
    }
    // private_key.then(key => console.log(decryptMessage(key, byteToUint8Array(atob(encrypted_data)))))
    return (
        <div className="row my-5">
            <form className="container col-6 mx-auto">
                <h1>Login</h1>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" />
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default login;
