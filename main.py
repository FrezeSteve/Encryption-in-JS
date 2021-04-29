import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat import backends
import time


def gen_key_pair():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=1024,
        backend=backends.default_backend()
    )
    return private_key, private_key.public_key()


def get_key_pem(pk):
    prk, puk = pk
    prk_pem = prk.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    puk_pem = puk.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )
    return prk_pem, puk_pem


start_time = time.time()
key_pair = gen_key_pair()
private_key_instance, public_key_instance = key_pair
first_pem, second_pem = get_key_pem(key_pair)
print(first_pem)
print(second_pem.decode())
print("--- %.2f seconds ---" % (time.time() - start_time))
# sign
message = b"Hello World"
signature = private_key_instance.sign(
    message,
    padding.PKCS1v15(),
    hashes.SHA512()
)
print(base64.b64encode(signature).decode())
