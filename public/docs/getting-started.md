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

> **Warning:** Bind Transmute only to networks you trust. Do not port-forward it to the internet, expose it directly through your router, or publish it on a public VPS without adding your own protective layer in front of it. There is currently no authentication or rate-limiting, and it allows uncontrolled file uploads. These features are in progress, but they need to be implemented properly.

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
