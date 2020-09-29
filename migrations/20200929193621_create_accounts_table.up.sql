CREATE TABLE IF NOT EXISTS accounts (
  id UUID UNIQUE PRIMARY KEY,
  email_address VARCHAR(100) NOT NULL,
  password TEXT NOT NULL,
  token TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX accounts_email_address_idx ON public.accounts (email_address);
CREATE INDEX accounts_email_lookup_idx ON public.accounts (email_address);
