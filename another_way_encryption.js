import { v4 as uuidv4 } from 'uuid';
const myStorage = window.sessionStorage;
const get_jwt = myStorage.getItem('get_jwt')
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}
async function exportPublicCryptoKey(key) {
    const exported = await window.crypto.subtle.exportKey(
        "spki",
        key
    );
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
    return pemExported
}
async function verifyMessage(publicKey, encoded_message, signature_) {
    let result = await window.crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        publicKey,
        signature_,
        encoded_message
      )

    return result ? console.log("valid") : console.log("invalid!!")
}
if (!get_jwt) {
    // construct the header of the jwt token
    const header = { "alg": "RSASSA-PKCS1-v1_5", "typ": "JWT" }
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64')
    // construct the payload of the jwt token
    // issuer
    const user_id = uuidv4()
    myStorage.setItem('user_id', user_id);
    // expirational time
    const now_time = new Date().getTime()
    const exp_time = new Date(now_time + 5 * 60000).getTime();
    // secret is the private key that i will give the server using his publickey
    window.crypto.subtle.generateKey(
        {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-512",
        },
        true,
        ["sign", "verify"]
    ).then(key => {
        myStorage.setItem('private_key', key.privateKey)
        const public_key = exportPublicCryptoKey(key.publicKey)
        public_key.then(publick => {
            const payload = { user_id: user_id, exp: exp_time, public_key: publick }
            const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')
            window.crypto.subtle.sign(
                "RSASSA-PKCS1-v1_5",
                key.privateKey,
                str2ab(encodedPayload)
            ).then(res => {
                const signature = btoa(ab2str(res))
                const jwt = `${encodedHeader}.${encodedPayload}.${signature}`
                console.log(jwt);
                verifyMessage(key.publicKey, str2ab(encodedPayload), str2ab(atob(signature)))
            })
        })
    })
    // const signature = window.crypto.createHmac('sha256', jwtSecret).update().digest('base64')
    // 
    // console.log(jwt);
    // myStorage.setItem('get_jwt', true)
}
else {
    console.log("login");
}

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
