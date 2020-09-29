-- name: GetUsers :many
SELECT * FROM users;

-- name: GetUser :one
SELECT * FROM users
WHERE id = $1 LIMIT 1;

-- name: GetUserByAccount :one
SELECT * FROM users
WHERE account_id = $1 LIMIT 1;

-- name: DeactivateUser :one
UPDATE users
SET deleted_at = $1
WHERE account_id = $2
RETURNING *;

-- name: CreateUser :one
INSERT INTO users (id, account_id, first_name, last_name, birth_date, created_at, updated_at, deleted_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;