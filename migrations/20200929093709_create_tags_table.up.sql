CREATE TABLE IF NOT EXISTS tags (
  id UUID UNIQUE PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);