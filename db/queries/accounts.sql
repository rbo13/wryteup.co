-- name: GetAccount :one
SELECT id, user_id, email_address, token, created_at, updated_at, deleted_at
FROM accounts
WHERE id = $1
LIMIT 1;

-- name: Login :one
SELECT password
FROM accounts
WHERE email_address = $1
LIMIT 1;

