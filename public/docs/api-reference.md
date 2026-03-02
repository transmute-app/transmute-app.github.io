---
title: API Reference
description: Interact with Transmute programmatically — upload files, convert formats, and download results via a simple REST API.
order: 4
---

# API Reference

Transmute exposes a REST API so you can automate file conversions without the web UI. No authentication is required.

> **Interactive docs** — Every Transmute instance serves auto-generated ReDoc documentation at [`/api/docs`](http://localhost:3313/api/docs). The full OpenAPI specification is also available on [GitHub](https://github.com/transmute-app/openapi-specifications/blob/main/openapi.json).

---

## Core Workflow

The typical automation flow is: **upload → convert → download**. Each step is a single API call.

### 1. Upload a File

```bash
curl -X POST http://localhost:3313/api/files \
  -F "file=@photo.jpg"
```

**Response** (`200 OK`):

```json
{
  "message": "File uploaded successfully",
  "metadata": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "original_filename": "photo.jpg",
    "media_type": "jpg",
    "extension": ".jpg",
    "size_bytes": 204800,
    "sha256_checksum": "abc123def456...",
    "compatible_formats": ["png", "gif", "webp", "bmp", "tiff", "ico"]
  }
}
```

The `compatible_formats` array tells you exactly which output formats are supported for this file. Use one of these values in the next step.

---

### 2. Start a Conversion

```bash
curl -X POST http://localhost:3313/api/conversions \
  -H "Content-Type: application/json" \
  -d '{
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "output_format": "png"
  }'
```

**Response** (`200 OK`):

```json
{
  "id": "987fcdeb-51a2-43f1-b789-123456789abc",
  "original_filename": "photo.png",
  "media_type": "png",
  "extension": ".png",
  "size_bytes": 153600,
  "sha256_checksum": "def789abc123..."
}
```

The returned `id` is the converted file's identifier — use it to download the result.

---

### 3. Download the Result

```bash
curl -OJ http://localhost:3313/api/files/987fcdeb-51a2-43f1-b789-123456789abc
```

The response is the raw file binary (`application/octet-stream`).

---

### 4. Batch Download as ZIP

If you have multiple converted files, you can download them all at once as a ZIP archive:

```bash
curl -X POST http://localhost:3313/api/files/batch \
  -H "Content-Type: application/json" \
  -d '{
    "file_ids": [
      "987fcdeb-51a2-43f1-b789-123456789abc",
      "aabbccdd-1122-3344-5566-778899aabbcc"
    ]
  }' \
  --output converted_files.zip
```

The response is an `application/zip` archive containing all requested files.

---

## Other Endpoints

### List Uploaded Files

```bash
curl http://localhost:3313/api/files
```

Returns a `files` array with metadata for every uploaded file.

### List Completed Conversions

```bash
curl http://localhost:3313/api/conversions/complete
```

Returns a `conversions` array with metadata for every completed conversion, including reference to the original file.

### Delete a File

```bash
curl -X DELETE http://localhost:3313/api/files/{file_id}
```

### Delete a Conversion

```bash
curl -X DELETE http://localhost:3313/api/conversions/{conversion_id}
```

### Delete All Files / Conversions

```bash
# Delete all uploaded files
curl -X DELETE http://localhost:3313/api/files/all

# Delete all conversions
curl -X DELETE http://localhost:3313/api/conversions/all
```

---

## Health Check Endpoints

Use these for monitoring and container orchestration (Docker health checks, Kubernetes probes, etc.).

### Liveness — `GET /api/health/live`

Confirms the server process is running.

```bash
curl http://localhost:3313/api/health/live
```

```json
{ "status": "alive" }
```

### Readiness — `GET /api/health/ready`

Confirms the server is ready to handle requests (database and storage are accessible).

```bash
curl http://localhost:3313/api/health/ready
```

```json
{
  "status": "ready",
  "checks": {
    "database": "ok",
    "storage": "ok"
  }
}
```

Returns `503` if any check fails.

### App Info — `GET /api/health/info`

Returns the application name and version.

```bash
curl http://localhost:3313/api/health/info
```

```json
{
  "name": "Transmute",
  "version": "v1.0.0"
}
```

---

## Settings

You can read and update application settings (theme, auto-download, cleanup TTL, etc.) via the API.

### Get Current Settings

```bash
curl http://localhost:3313/api/settings
```

```json
{
  "theme": "rubedo",
  "auto_download": false,
  "keep_originals": true,
  "cleanup_ttl_minutes": 60
}
```

### Update Settings

```bash
curl -X PATCH http://localhost:3313/api/settings \
  -H "Content-Type: application/json" \
  -d '{ "theme": "nigredo", "auto_download": true }'
```

Only the fields you include are updated.

---

## Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/files` | Upload a file |
| `GET` | `/api/files` | List uploaded files |
| `GET` | `/api/files/{id}` | Download a file |
| `DELETE` | `/api/files/{id}` | Delete a file |
| `DELETE` | `/api/files/all` | Delete all files |
| `POST` | `/api/files/batch` | Batch download as ZIP |
| `POST` | `/api/conversions` | Start a conversion |
| `GET` | `/api/conversions/complete` | List completed conversions |
| `DELETE` | `/api/conversions/{id}` | Delete a conversion |
| `DELETE` | `/api/conversions/all` | Delete all conversions |
| `GET` | `/api/health/live` | Liveness check |
| `GET` | `/api/health/ready` | Readiness check |
| `GET` | `/api/health/info` | App metadata |
| `GET` | `/api/settings` | Get settings |
| `PATCH` | `/api/settings` | Update settings |
