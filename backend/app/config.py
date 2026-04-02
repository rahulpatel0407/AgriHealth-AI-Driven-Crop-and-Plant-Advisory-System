from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_env: str = "local"
    database_url: str
    s3_endpoint_url: str
    s3_bucket: str
    s3_access_key: str
    s3_secret_key: str
    sentry_dsn: str = ""
    phone_encryption_key: str
    model_path: str

    class Config:
        env_file = ".env"
        case_sensitive = False
        protected_namespaces = ()


settings = Settings()
