---
title: OIDC / SSO Integration
description: Allow login and user account creation via OIDC providers such as Authentik and Authelia
order: 3
---

OIDC support allows users to sign in to Transmute using an external identity provider such as Authentik, Authelia, or another OpenID Connect compatible SSO solution. If you are using Transmute with OIDC, and your Transmute instance is behind a reverse proxy, please make sure to set your `APP_URL` evironment variable as well. See [environment variables](/docs/environment-variables/).

# Configuration

OIDC is configured through the following environment variables:

```bash
# Examples for Authentik
OIDC_ISSUER_URL="http://<USER_FACING_URL>/application/o/transmute/"
OIDC_INTERNAL_URL="http://<INTERNAL_URL>/application/o/transmute/"
OIDC_CLIENT_ID="<REPLACE_ME>"
OIDC_CLIENT_SECRET="<REPLACE_ME>"
OIDC_DISPLAY_NAME="Authentik"
OIDC_AUTO_CREATE_USERS=true
OIDC_AUTO_LAUNCH=true
```

If your provider requires you to set a "callback" or "redirect" URI, the value should be `<TRANSMUTE_URL>/api/oidc/callback`.

Examples:
- `https://transmute.domain.com/api/oidc/callback`
- `http://192.168.1.1:3313/api/oidc/callback`

Again - if you are using Transmute with OIDC, and your Transmute instance is behind a reverse proxy, please make sure to set your `APP_URL` evironment variable as well. See [environment variables](/docs/environment-variables/).

## Environment Variables

### OIDC_ISSUER_URL

The public issuer URL for your OIDC provider.

This should be the URL Transmute uses to redirect users to your identity provider in the browser. In most setups, this is the externally accessible URL.

Example:

```bash
OIDC_ISSUER_URL="https://auth.domain.com/application/o/transmute/"
```

### OIDC_INTERNAL_URL

The internal URL Transmute uses to communicate with the OIDC provider from inside your Docker network or local environment.

This is useful when the public URL is not reachable from the Transmute container, or when you want to avoid unnecessary external routing.

If not set, this defaults to `OIDC_ISSUER_URL`.

Example:

```bash
OIDC_INTERNAL_URL="http://192.168.1.1:9000/application/o/transmute/"
```

### OIDC_CLIENT_ID

The client ID for your OIDC application.

### OIDC_CLIENT_SECRET

The client secret for your OIDC application.

### OIDC_DISPLAY_NAME

The label shown on the login button in the Transmute UI.

Defaults to `SSO`.

Example:

```bash
OIDC_DISPLAY_NAME="Authentik"
```

![OIDC_DISPLAY_NAME set to "Authentik"](https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/assets/screenshots/login.png)

### OIDC_AUTO_CREATE_USERS

Controls whether users are automatically created in Transmute the first time they successfully sign in through OIDC.

* `true`: users are created automatically on first login
* `false`: users must already exist in Transmute before they can log in with OIDC

Defaults to `true`.

### OIDC_AUTO_LAUNCH

Controls whether or not `/auth` automatically triggers the OAUTH flow, or if users should have to click "Log in with SSO" first. Setting this to true means you cannot use username and password to log in through the UI.

# URL Example

A common setup uses a public URL for browser redirects and an internal URL for container-to-container communication:

```bash
OIDC_ISSUER_URL="https://auth.domain.com/application/o/transmute/"
OIDC_INTERNAL_URL="http://192.168.1.1:9000/application/o/transmute/"
```

# Docker Compose Example

Below is a working example for integrating Transmute with Authentik:

```yaml
services:
  transmute:
    image: ghcr.io/transmute-app/transmute:latest
    container_name: transmute
    restart: unless-stopped
    ports:
      - 3313:3313
    volumes:
      - transmute_data:/app/data
    environment:
      - OIDC_ISSUER_URL=http://<AUTHENTIK_IP>:9000/application/o/transmute/
      - OIDC_CLIENT_ID=<REPLACE_ME>
      - OIDC_CLIENT_SECRET=<REPLACE_ME>
      - OIDC_DISPLAY_NAME=Authentik
    healthcheck:
      test:
        - CMD
        - wget
        - -q
        - -O
        - /dev/null
        - --tries=1
        - http://localhost:3313/api/health/ready
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  transmute_data:
```

# Notes

* Your OIDC provider must be configured with the correct redirect URL for Transmute.
* `OIDC_ISSUER_URL` should usually be the user-facing URL that browsers can access.
* `OIDC_INTERNAL_URL` is only needed when Transmute cannot reliably reach the provider through the public URL.
* Providers such as Authentik and Authelia should work as long as they expose a standard OpenID Connect issuer. If a specific provider does not work, please [open an issue](https://github.com/transmute-app/transmute/issues).