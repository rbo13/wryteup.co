-- name: CreateTag :one
INSERT INTO tags (id, name, created_at, updated_at, deleted_at)
VALUES ($1, $2, $3, $4, $5) RETURNING *;
