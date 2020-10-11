-- name: GetUserAndAccountInfo :one
SELECT u.*, a.email_address, a.token,
a.created_at AS account_created_at,
a.updated_at AS account_updated_at
FROM users u
INNER JOIN accounts a
ON u.account_id = a.id 
WHERE a.id = $1
LIMIT 1;
