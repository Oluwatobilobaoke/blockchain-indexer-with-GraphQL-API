# blockchain-indexer-with-GraphQL-API

This is a liteflow assessment project: Blockchain Indexer  powered by Nodejs, Pg, PostGraphile and TS

## Requirements
- NodeJS runtime
- NPM or Yarn package manager
- Typescript
- Postgres
- PostGraphile

## Features
- Completely written in [Typescript](https://typescriptlang.org/)

## How to install
- Clone the repository
- `git clone https://github.com/Oluwatobilobaoke/blockchain-indexer-with-GraphQL-API`
- `cd blockchain-indexer-with-GraphQL-API`
- Install dependencies
- `npm install`
- Setup your database
- Install PostGraphile
- `npm install postgraphile` or `yarn global add postgraphile`
- Setup environment variable
- `cp .env.example .env`
- Run the server in dev env
- `npm run dev`
- Using PostGraphile to create a GraphQL API
- `npx postgraphile -c {{connectionurl}} -s {{schema}} --watch -p {{desiredPort}}`
- To run the service in production env
- `npm build && npm start`



## How to create a new table

```
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


```
