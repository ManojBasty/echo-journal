# Database Schema – Echo

## Users Table
Stores registered users.

Fields:
- id (UUID, primary key)
- email (unique)
- password_hash
- created_at

## Journal Entries Table
Stores private journal entries for each user.

Fields:
- id (UUID, primary key)
- user_id (foreign key → users.id)
- content (text)
- emotion (string)
- ai_response (text)
- created_at

## Notes
- Each journal entry belongs to exactly one user
- AI responses are stored for consistency
- Schema is intentionally minimal for MVP
