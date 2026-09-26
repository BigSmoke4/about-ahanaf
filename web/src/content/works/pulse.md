---
title: PULSE — Distributed Job Processing & Workflow Platform
banner: /works/pulse/banner.jpg
year: 2025
role: Full-Stack Developer
tags: [Distributed Systems, RabbitMQ, Job Orchestration, ASP.NET Core]
link: https://github.com/BigSmoke4/Pulse-Job-Orchestrator
---

PULSE is a fault-tolerant distributed job-processing and workflow platform for submitting, prioritizing, scheduling, executing, and monitoring background jobs. It uses real RabbitMQ durable priority queues, dead-letter exchanges, Redis distributed locks, idempotency keys, worker heartbeats, retry policies, exponential backoff, scheduled jobs, and failure handling.

The system is implemented as a modular monolith that can be deployed as a single unit while maintaining clear internal module boundaries.

## Key Features

- **Durable Queues**: RabbitMQ priority queues with dead-letter exchanges
- **Fault Tolerance**: Redis distributed locks, idempotency protection, and retry policies
- **Worker Management**: Heartbeat monitoring and worker orchestration
- **Job Lifecycle**: Scheduled jobs, cancellation, and failure simulation
- **Modular Architecture**: Clear internal boundaries within a deployable monolith

## Technologies

ASP.NET Core MVC, C#, RabbitMQ, Redis, SQL Server, EF Core, Docker
