CREATE TABLE app.sale (
	id serial,
	transaction_hash TEXT UNIQUE NOT NULL PRIMARY KEY,
	seller_address  TEXT  NOT NULL,
	buyer_address  TEXT  NOT NULL,
	nft_token_id SMALLINT NOT NULL CHECK (nft_token_id > 0),
	nft_collection_address  TEXT  NOT NULL,
	quantity_sold SMALLINT NOT NULL CHECK (quantity_sold > 0),
	amount_paid  NUMERIC(18, 5) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
