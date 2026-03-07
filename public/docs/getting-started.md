---
title: Getting Started
description: How to install and run Transmute for the first time.
order: 1
---

# Getting Started

Transmute is a self-hosted file converter. Follow the steps below to get up and running.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed on your machine.

## Quick Start

> **Warning:** Think carefully before exposing Transmute to the public internet. Transmute includes built-in [authentication and per-user data isolation](/docs/authentication), but is designed for trusted networks. If you expose it beyond your LAN, place it behind a reverse proxy with TLS and rate limiting. The maintainers are not responsible for security issues arising from your deployment configuration.

Download the compose file and and start the stack with a single command:

```bash
wget "https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/docker-compose.yml" && docker compose up -d
```

Then open [http://localhost:3313](http://localhost:3313) in your browser.

## Verifying the Installation

Run the following command to check all services are healthy:

```bash
docker compose ps
```

You should see output similar to:

```bash
NAME                STATUS
transmute           running (healthy)
```

> **Tip:** If a container shows `unhealthy`, check its logs with `docker compose logs <service>`.
