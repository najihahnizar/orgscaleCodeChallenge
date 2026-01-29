# Scoreboard API Service

## Overview

This module is an API service responsible for maintaining and serving a live-updating top-10 scoreboard for a website.
Users perform an action on the frontend; upon successful completion, the backend validates the request, increments the user’s score, and pushes updates to connected clients in real time.

Security is a first-class concern: the system must prevent malicious users from artificially inflating scores.

---

## Security Considerations

1. Authentication
    - All write endpoints require authenticated users
    - JWT must be validated and not expired

2. Authorization
    - User can only update their own score
    - User ID must be derived from token, not request body

3. Action Validation
    - action_signature generated server-side or via trusted mechanism
    - Prevents arbitrary API calls from incrementing score

4. Idempotency
    - Idempotency-Key ensures replayed requests do not double-increment
    - Store processed keys temporarily (Redis / DB)

5. Rate Limiting
    - Per-user and per-IP limits on score update endpoint

---

## High-Level Architecture
Components:
- API Service (this module)
- Authentication Provider (JWT / OAuth / Session)
- Database (persistent scores)
- Cache (fast leaderboard reads)
- Realtime Transport (WebSocket / SSE)
- Frontend Clients

---

## API Responsibilities
- Accept score update requests
- Verify user identity & authorization
- Validate action legitimacy
- Update user score atomically
- Recalculate top-10 leaderboard
- Broadcast live updates to clients

---

## Data Model (Simplified)
| Field      | Type      | Notes                 |
| ---------- | --------- | --------------------- |
| user_id    | UUID      | Primary key           |
| score      | Integer   | Non-negative          |
| updated_at | Timestamp | For ordering & audits |

---

## API Endpoints

### Update Score

POST 
```bash
/api/v1/score/update
```

Request Headers:
- Authorization: Bearer <JWT>
- Idempotency-Key: <UUID>

Request Body:
```bash
{
  "action_id": "string",
  "action_signature": "string"
}
```

Response:
```bash
{
  "success": true,
  "new_score": 120
}
```

Behavior:
1. Authenticate user via JWT
2. Verify action_signature
3. Enforce idempotency
4. Atomically increment score
5. Trigger leaderboard refresh
6. Publish realtime update

### Get Top 10 Scores

GET 
```bash
/api/v1/scoreboard/top
```

Response:
```bash
{
  "scores": [
    { "user_id": "uuid", "score": 150 },
    ...
  ]
}
```

Behavior:
1. Served primarily from cache
2. Falls back to database if cache miss

### Realtime Scoreboard Updates
WebSocket / SSE Endpoint

GET 
```bash
/api/v1/scoreboard/stream
```

Events:
```bash
{
  "type": "SCOREBOARD_UPDATE",
  "payload": {
    "scores": [...]
  }
}
```

---

## Execution Flow Diagram

```bash
sequenceDiagram
    participant Client as Frontend Client
    participant API as Scoreboard API Service
    participant Auth as Auth Service / Middleware
    participant Validator as Action Validator
    participant DB as Score Database
    participant Cache as Leaderboard Cache
    participant Realtime as Realtime Gateway (WS/SSE)

    Client->>API: POST /api/v1/score/update
    Note right of Client: Triggered only after successful user action

    API->>Auth: Validate JWT / Session
    Note right of Auth: Ensures user identity and token freshness

    Auth-->>API: Authenticated user_id
    Note right of API: user_id derived from token, never from request body

    API->>Validator: Verify action signature + idempotency key
    Note right of Validator: Prevents replay attacks and forged requests

    Validator-->>API: Action valid
    Note right of API: Invalid requests are rejected with 403 / 409

    API->>DB: Atomic score increment (UPDATE score = score + 1)
    Note right of DB: Guarantees consistency under concurrent updates

    DB-->>API: Updated score value
    Note right of API: Single source of truth is always the database

    API->>Cache: Recompute & update\nTop-10 leaderboard
    Note right of Cache: Optimized for high read volume TTL + explicit invalidation

    API->>Realtime: Publish SCOREBOARD_UPDATE event
    Note right of Realtime: Fan-out to all connected clients

    Realtime-->>Client: Push updated leaderboard
    Note right of Client: UI updates instantly without polling
```

---

## Suggested Improvements & Future Enhancements

1. Cheat Detection
    Detect anomalous score growth patterns

2. Event Sourcing
    Store all score events for audits & rollback

3. Shard Leaderboards
    Support regional or game-mode leaderboards

4. Soft Real-Time Updates
    Batch updates to reduce broadcast pressure

5. Admin Moderation Tools
    Manual score correction & bans

---

## Summary
This module provides:
- Secure score mutation
- Real-time leaderboard updates
- Scalable read performance
- Strong protection against abuse

It is intentionally decoupled from frontend logic and ready for distributed deployment.
