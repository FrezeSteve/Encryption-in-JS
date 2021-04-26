function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}
async function exportCryptoKey(key) {
    const exported = await window.crypto.subtle.exportKey(
        "pkcs8",
        key
    );
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
    console.log(pemExported);
}
function login() {
    window.crypto.subtle.generateKey(
        {
          name: "RSA-PSS",
          // Consider using a 4096-bit key for systems that require long-term security
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-512",
        },
        true,
        ["sign", "verify"]
      ).then((key) => {
        //   console.log(key);
        exportCryptoKey(key.privateKey)
    });
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
