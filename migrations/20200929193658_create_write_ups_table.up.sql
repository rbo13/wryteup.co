CREATE TABLE IF NOT EXISTS write_ups (
  id UUID UNIQUE PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  slug_url TEXT NOT NULL,
  appreciates INT NOT NULL DEFAULT 0, -- our term for upvote, like, and etc...
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX write_ups_user_id_idx ON public.write_ups (user_id,slug_url);
