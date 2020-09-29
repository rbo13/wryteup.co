/* CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_email" */
/* ON accounts USING btree (email_address); */

CREATE TABLE IF NOT EXISTS accounts (
  id UUID UNIQUE PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_address VARCHAR(100) NOT NULL,
  password TEXT NOT NULL,
  token TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX accounts_email_address_idx ON public.accounts (email_address);
CREATE INDEX accounts_user_id_idx ON public.accounts (user_id,email_address);
