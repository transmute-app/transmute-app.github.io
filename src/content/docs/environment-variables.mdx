---
title: Environment Variables
description: Configure Transmute's default behaviour using environment variables in your Docker Compose file.
order: 7
---

# Environment Variables

Transmute is configured through environment variables. Set them in the `environment` section of your `docker-compose.yml`, in a `.env` file mounted into the container, or as standard OS environment variables. Variable names are **case-insensitive**.

---

## Example Docker Compose

```yaml
services:
  transmute:
    image: ghcr.io/transmute-app/transmute:main
    container_name: transmute
    restart: unless-stopped
    ports:
      - 3313:3313
    volumes:
      - transmute_data:/app/data
    environment:
      - AUTH_SECRET_KEY=replace-with-a-long-random-string
      - AUTH_ACCESS_TOKEN_EXPIRE_MINUTES=120
      - APP_URL=https://transmute.domain.com
      # - APP_URL=http://http://192.168.1.113:3313
      - PORT=3313

volumes:
  transmute_data:
```

---

## Reference

### Authentication

| Variable | Default | Description |
|----------|---------|-------------|
| `AUTH_SECRET_KEY` | *(auto-generated)* | Secret key used to sign JWT tokens. If not set, a random 64-byte key is generated on every startup — meaning all existing tokens are invalidated when the container restarts. **Set this to a fixed value** for persistent sessions across restarts. |
| `AUTH_ALGORITHM` | `HS256` | Algorithm used for JWT signing. Unless you have a specific reason to change this, leave it as the default. |
| `AUTH_ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | How long a JWT access token remains valid, in minutes. |
| `ALLOW_UNAUTHENTICATED` | `false` | Allow users to use the app as a temporary guest account. WARNING: DO NOT EXPOSE TRANSMUTE PUBLICALLY IF YOU ENABLE THIS. |

> **Important:** If you don't set `AUTH_SECRET_KEY`, a new random key is generated each time the container starts. This means all logged-in users will be signed out and all existing JWTs will stop working after a restart. For production use, always set a fixed `AUTH_SECRET_KEY`.

**Generating a strong secret key:**

```bash
# Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(64))"

# Using OpenSSL
openssl rand -base64 64
```

### OIDC
For OIDC configuration variables, please see [OIDC / SSO Integration](/docs/oidc/).

### Server

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Network interface the server binds to. The default binds to all interfaces, which is required inside Docker. |
| `PORT` | `3313` | Port the server listens on inside the container. If you change this, update the `ports` mapping and health check URL in your Compose file to match. |
| `APP_URL` | `""` | Used for constructing URLs in OIDC API response, and also used for setting the displayed URL in the API docs. |

### Storage

| Variable | Default | Description |
|----------|---------|-------------|
| `DATA_DIR` | `data` | Base directory for all persistent data (database, uploads, outputs, temp files). Inside Docker this is typically `/app/data` and should be backed by a volume. |

> **Tip:** You generally don't need to change `DATA_DIR` when using Docker — just mount a volume to `/app/data` as shown in the example Compose file above.

### Database Table Names

These control the SQLite table names. You should not change them unless you have a very specific reason.

| Variable | Default | Description |
|----------|---------|-------------|
| `FILE_TABLE_NAME` | `FILES_METADATA` | Table for uploaded file metadata |
| `CONVERSION_TABLE_NAME` | `CONVERSIONS_METADATA` | Table for conversion output metadata |
| `CONVERSION_RELATIONS_TABLE_NAME` | `CONVERSION_RELATIONS` | Table linking conversions to source files |
| `APP_SETTINGS_TABLE_NAME` | `APP_SETTINGS` | Table for per-user application settings |
| `USER_TABLE_NAME` | `USERS` | Table for user accounts |
