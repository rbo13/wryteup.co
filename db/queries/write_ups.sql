-- name: GetWriteUpsByTags :many
SELECT write_ups.*
FROM write_ups
INNER JOIN write_up_tags
ON write_ups.id = write_up_tags.write_up_id
WHERE write_up_tags.tag_id = $1
ORDER BY write_up.created_at DESC;
