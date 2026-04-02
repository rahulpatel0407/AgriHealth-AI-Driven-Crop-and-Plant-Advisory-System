import base64

from cryptography.fernet import Fernet

from ..config import settings


def _load_key() -> bytes:
    key = settings.phone_encryption_key
    if not key:
        key = Fernet.generate_key().decode("utf-8")
    key_bytes = key.encode("utf-8")
    if len(key_bytes) not in (44,):
        key_bytes = base64.urlsafe_b64encode(key_bytes[:32].ljust(32, b"0"))
    return key_bytes


_fernet = Fernet(_load_key())


def encrypt_phone(phone: str) -> str:
    return _fernet.encrypt(phone.encode("utf-8")).decode("utf-8")


def decrypt_phone(token: str) -> str:
    return _fernet.decrypt(token.encode("utf-8")).decode("utf-8")
