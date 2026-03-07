---
title: Authentication & Users
description: How Transmute handles accounts, roles, API keys, and authentication.
order: 2
---

# Authentication & Users

Transmute requires every user to authenticate before uploading, converting, or downloading files. Each user's data (uploads, conversions, settings, default formats) is fully isolated — you can only see and manage your own files.

---

## First-Time Setup

When Transmute starts with an empty database, it enters **bootstrap mode**. The first screen you see is a **Create Admin** form instead of the usual login page.

1. Choose a **username** and **password** (minimum 8 characters).
2. Optionally fill in an **email** and **full name**.
3. Click **Create Admin**.

This account becomes the initial administrator. Once created, bootstrap mode is permanently disabled and all future visitors see the standard login page.

> **Tip:** If you're deploying with Docker and want to script the initial setup, you can `POST` to `/api/users` with a JSON body — the first user created is always promoted to admin regardless of the `role` field.

---

## Roles

Transmute has two roles:

| Role | Capabilities |
|------|-------------|
| **Admin** | Full access — manage all users, configure cleanup settings, and access everything a member can |
| **Member** | Upload, convert, and download their own files; manage their own account, settings, default formats, and API keys |

Key differences:

- Only admins can **create, edit, disable, or delete** other users.
- Only admins can change **cleanup TTL** and **cleanup interval** settings (under Settings → Data Management).
- Admins **cannot demote themselves** or **delete their own account** — another admin must do it.
- Members cannot see or access other users' files or conversion history.

---

## Logging In

Navigate to your Transmute instance in a browser. Enter your **username** and **password**, then click **Log In**. A session token (JWT) is issued and stored in your browser — you stay logged in until the token expires (default: 60 minutes) or you log out.

---

## Managing Your Account

Click your **username** in the header to open the **Account** page. From here you can:

- Update your **username**, **email**, or **full name**
- Change your **password** (minimum 8 characters)
- Manage your **API keys** (see below)

Changes take effect immediately after clicking **Save Changes**.

---

## Managing Users (Admin)

Admins can access the **Users** page from the navigation bar. From this page you can:

### Create a User

1. Click **Create User**.
2. Fill in the username, password, and optionally email and full name.
3. Choose a **role** (admin or member).
4. Click **Create**.

### Edit a User

Click the **edit** button on any user card to change their username, email, full name, password, or role. You cannot edit your own role or disabled status from the Users page — use the Account page for self-service changes.

### Disable a User

Toggle the **Disabled** switch on a user card. Disabled users cannot log in or use API keys, but their data is preserved. Re-enable them at any time.

### Delete a User

Click the **delete** button on a user card. This permanently removes the user and **cascade-deletes all of their data** — uploads, conversions, conversion history, settings, default formats, and API keys. This action cannot be undone.

> **Warning:** You cannot delete your own admin account. If you need to remove yourself, another admin must do it.

---

## API Keys

API keys let you authenticate with the Transmute API without using a username and password. They're ideal for scripts, CI pipelines, and other automated workflows.

### Creating an API Key

1. Go to **Account** → **API Keys**.
2. Enter a descriptive **name** (e.g. "CI pipeline" or "Backup script").
3. Click **Create**.
4. **Copy the key immediately** — it is shown only once and cannot be retrieved later.

Each user can have up to **25 API keys**.

### Using an API Key

Pass the key as a Bearer token in the `Authorization` header, exactly as you would with a JWT:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:3313/api/files
```

API keys have the same permissions as the user who created them. If the user account is disabled, all of its API keys stop working immediately.

### Deleting an API Key

Click the **×** button next to any key on the Account page. The key is revoked immediately.

---

## Using Authentication with the API

All API endpoints (except health checks and bootstrap status) require a valid Bearer token. You can obtain one in two ways:

### Option 1 — Username & Password (JWT)

```bash
curl -X POST http://localhost:3313/api/users/authenticate \
  -H "Content-Type: application/json" \
  -d '{ "username": "alice", "password": "correct horse battery staple" }'
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "uuid": "...",
    "username": "alice",
    "role": "member",
    "disabled": false
  }
}
```

Use the `access_token` value in subsequent requests:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  http://localhost:3313/api/files
```

JWTs expire after the configured lifetime (default: 60 minutes). Request a new token when the current one expires.

> **Tip:** The OAuth2 token endpoint `POST /api/users/token` is also available if your HTTP client supports the standard `application/x-www-form-urlencoded` OAuth2 password flow.

### Option 2 — API Key

Generate an API key from the Account page (or via `POST /api/api-keys`) and pass it directly as a Bearer token:

```bash
curl -H "Authorization: Bearer tm_abc123..." \
  http://localhost:3313/api/files
```

API keys do not expire on their own — they remain valid until deleted or the owning user is disabled.

---

## Quick Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/users/bootstrap-status` | None | Check if first-time setup is needed |
| `POST` | `/api/users` | None (bootstrap) / Admin | Create a user |
| `POST` | `/api/users/authenticate` | None | Log in with username & password |
| `POST` | `/api/users/token` | None | OAuth2 password-flow token endpoint |
| `GET` | `/api/users/me` | User | Get the authenticated user |
| `PATCH` | `/api/users/me` | User | Update your own account |
| `GET` | `/api/users` | Admin | List all users |
| `GET` | `/api/users/{uuid}` | Admin | Get a user by UUID |
| `PATCH` | `/api/users/{uuid}` | Admin | Update a user |
| `DELETE` | `/api/users/{uuid}` | Admin | Delete a user and all their data |
| `GET` | `/api/api-keys` | User | List your API keys |
| `POST` | `/api/api-keys` | User | Create an API key |
| `DELETE` | `/api/api-keys/{id}` | User | Delete an API key |
