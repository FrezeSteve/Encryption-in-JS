import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.exceptions import InvalidSignature

# import public key and then verify
public_pem_data = """-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAkOgyVicoriinz4zgCZUGmGsbwi4LQKC5dL/txfrKmfuuI8QI1REX1/3mbAwSpKb0NZ2cBUvv1i2HSW86AGDTnuW/5IUvByJ5UjB9PcsKFmKLJYCKMiginTqUO0s2vQ+mzznxipjHkbRC1s0/UJTFf3ArhFn1OW+i/E1UZTuAd5Avl0+tWEnxz7XiYKaJdUaEQM53Rddt8OtkzGmCo5YwXxGYYoTHLMANlNDTla3XncndF2OOhy88cfotSuwNrEJb+bRr3B+9qMSQKmGxWaYm0mKQNFX0PJXQ6nEWJFZItY+OmMMea3/oylgoDTPK6MMudyf+3AHxFzGddMZp7InoVyZaa0WNBnbkJy4xkikdwhPcgqrv1mh7tW1S2JAj06S+QHH6AiNFfsHVpBg3qpMCEMfP5W6Jhzkq3t9OhiDcwCaT0LvnAC+iQyKA9nyQ1Ng23Hf1TSiPRVj5kyyxouCtx4HRxHblfe0zzLLwkjj2L+5wXHhiSpQgy/5hasVO5RlfI/BPkxgSlBPofZ/6KuBT/msOPYFrR8HPH+HSiyn8BVFUJTTqF6V+cCXAm5sadwSVnRXKyD7DFzDa5juLQPlAGnP2vWLlHnVDXRhJ5v4xM6JssiL6IyJWT5h0GSwnqOIA04qypflTv4T6Zg4CgTgfARmZ7xd1mija4rJzQBWw/JUCAwEAAQ==
-----END PUBLIC KEY-----""".encode()
message = 'Hello World'.encode()
_signature = 'RaFIYqZ1KNaF3PORsJs0mByXh2OMc0kSndVVlUdeRRJ/rp3B3CcvlA5WPUuBhiKqpGkvgmgfmyZiDq1y5KxGpJ0cMfpPpZ1cmOwqUSKQWn0ZxLHb402bMZScZchcLEr4yr9MzgAvn7UCYZRmc6zgzJ37SgsP+L8Uqtyu0iMaf0jiJJDLX/8TRSm9YxlMgoXA5RudJsELgMndj9JNBI0SPURf+o88SJE2cbBWbpSh0ATRyngidsFodZ5gGG+1oWuLvx74y202OFTA8po34uXKgoTf+SP+8z404telLtn/TSFWX+HmRhMxc8SMINqsaORwuEVruII5S6JKk7DiDMr8KZL3WJRVmtMmPE3SBxq9gq20Vw24y7NZ9/4HwljCNlwx5cz/mM3gxruVhIzSCTJLtY2A8I2NVuyeZFn7ZIR0Q8QkAbopFJJggkse/CFb6fVezz/46VGz6bqDOG8okSd0lC/8HJ3FhdjisXsAjRP93kGEzBRSyLphVmxYXBvXV+Etw42G43kUb4ZkdpBHsdNg5QW9L16ILmvDE91paCUGOqBuA8+gt8ykHHc4z3l0WURSA6E5JQLmfg7JY4+VPljct/QiGE6+Pp0dmXAVxvWSyvCroe7sQlQZzPu3io1hx6j9R5OT7P4t8JvgP/V3AhlsTxiKMGrYcQAV4aZefWi+p8U='.encode()
key = serialization.load_pem_public_key(public_pem_data)

try:
    key.verify(
        base64.b64decode(_signature),
        message,
        padding.PKCS1v15(),
        hashes.SHA512()
    )
    print("Successfully validated the signature and data!!")
except InvalidSignature:
    print("The validation did not go through successfully!")
