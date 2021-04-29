function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

const pemEncodedKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4jo6d9Wwp+5o2COP74rRVM8B/
6fjY7NRjDlrGfBp5BETs+knaLhDcJlQOuZX1PLnU/ffQjDB0zJ+E2rc4Jy1Z82wu
vopgk4F/9XyszOZuvyaeMBLR6vH+XvGOGx3x2SeMtWMT440AJD2H9lCGvEt+rLvN
5fIh4RHnk6cMeuXptwIDAQAB
-----END PUBLIC KEY-----`;

function importRsaKey(pem) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

    return window.crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
            name: "RSASSA-PKCS1-v1_5",
            hash: "SHA-512"
        },
        true,
        ["verify"]
    );
}
function getMessageEncoding() {
    const message = 'Hello World2'  // Hello world
    let enc = new TextEncoder();
    return enc.encode(message);
}
async function verifyMessage(publicKey) {
    const signature = 'Q1qKvEWqYBSVxT3RRywx0hq4FronOxShb/Ga82cSLSODlPqukmzX9XvEKYlRQBu7zTKZqvYwKBBewPkbqZ8Hm4YGxpebJE5PC1iQ0iAOaC2eU/33jl+T8E4l0EdDsUaw1K5OqNM2gas1GyrmTRoo/6EU6SsyRc8aLjnRQlXzXqM='
    let encoded = getMessageEncoding();
    let result = await window.crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        publicKey,
        str2ab(atob(signature)),
        encoded
    );

    result ? console.log("valid") : console.log("invalid")
}
importRsaKey(pemEncodedKey).then(res => {
    console.log(res);
    verifyMessage(res)
})

function login() {
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
