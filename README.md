# blockchain-indexer-with-GraphQL-API
 # liteflow-assesment

This is a liteflow assessment project: Blockchain Indexer  powered by Nodejs, Pg, PostGraphile and TS

## Requirements
- NodeJS runtime
- NPM or Yarn package manager
- Typescript
- 

## Features
- Completely written in [Typescript](https://typescriptlang.org/)

## How to install
- Clone the repository
- `git clone https://github.com/Oluwatobilobaoke/blockchain-indexer-with-GraphQL-API`
- `cd blockchain-indexer-with-GraphQL-API`
- Install dependencies
- `npm install`
- Setup environment variable
- `cp .env.example .env`
- Run the server in dev env
- `npm run dev`
- To run the service in production env
- `yarn build && yarn start`



## How to create a new table

```
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
```
