-- name: GetAccount :one
SELECT id, email_address, token, created_at, updated_at, deleted_at
FROM accounts
WHERE id = $1
LIMIT 1;

-- name: Login :one
SELECT id, password
FROM accounts
WHERE email_address = $1
LIMIT 1;

-- name: Signup :one
INSERT INTO accounts (id, email_address, password, token, created_at, updated_at, deleted_at)
VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email_address, token, created_at, updated_at, deleted_at;

