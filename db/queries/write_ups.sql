-- name: GetWriteUpsByTags :many
SELECT write_ups.*
FROM write_ups
INNER JOIN write_up_tags
ON write_ups.id = write_up_tags.write_up_id
WHERE write_up_tags.tag_id = $1
ORDER BY write_up.created_at DESC;

-- name: GetAllPublishedWriteups :many
SELECT *
FROM write_ups
WHERE is_published = true
ORDER BY created_at DESC;

-- name: GetWriteupFromSlugURL :one
SELECT *
FROM write_ups
WHERE slug_url = $1
LIMIT 1;

-- name: GetWriteUpFromOwner :many
SELECT *
FROM write_ups
WHERE user_id = $1
ORDER BY created_at DESC;

-- name: CreateWriteup :one
INSERT INTO write_ups (id, user_id, title, content, slug_url, created_at, updated_at, deleted_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
