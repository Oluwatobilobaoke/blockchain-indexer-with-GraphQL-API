CREATE TABLE sale (
	id serial PRIMARY KEY,
	transaction_hash TEXT NOT NULL ,
	seller_address  TEXT  NOT NULL,
	buyer_address  TEXT  NOT NULL,
	nft_token_id TEXT NOT NULL,
	nft_collection_address  TEXT  NOT NULL,
	quantity_sold SMALLINT NOT NULL CHECK (quantity_sold > 0),
	amount_paid  TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
