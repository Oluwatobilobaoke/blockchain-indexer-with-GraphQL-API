import pool from './dbconfig';
import { BigNumber, ethers } from 'ethers';

// they are displaying data easy for humans to read, and storing data in a way that is easy for machines to read and write.

// recieve an array of objects and bulk insert into db
export async function createSaleRecord(salesArray: any) {
  // take data from dataObj and insert into db
  const client = await pool.connect();
  try {
    const parameters: string[][] = [];
    const parametersValues = [];

    const parameterNames = [
      'transaction_hash',
      'seller_address',
      'buyer_address',
      'nft_token_id',
      'nft_collection_address',
      'quantity_sold',
      'amount_paid',
    ];

    // define the parameters for the query
    for (let i = 0; i < salesArray.length * 7; i++) {
      const j = i % 7;

      if (j === 0) {
        parameters.push([]);
      }
      parameters[parameters.length - 1].push(`\$${i + 1}`);
      parametersValues.push(salesArray[Math.floor(i / 7)][parameterNames[j]]);
    }

    const query = `INSERT INTO app.sale (${parameterNames.join(',')}) VALUES ${parameters
      .map((p) => `(${p.join(',')})`)
      .join(',')} RETURNING *`;
    // const query =  `INSERT INTO sale (${parameterNames.join(',')}) VALUES ${parameters.map((p) => `(${p.join(',')})`).join(',')} RETURNING *`;
    // console.log(query)
    // insert into db
    await client.query(query, parametersValues);

    console.log('=========Saved new Sales to Db=======');
  } catch (err) {
    console.log(err);
  }
  client.release();
}

export function hexToDecimal(hex: string) {
  return parseInt(hex, 16);
}

// convert wei to ether
export function weiToEther(wei: string) {
  const weiString = wei.toString();
  const weiBN = ethers.BigNumber.from(weiString);
  const etherValue = Number(ethers.utils.formatEther(weiBN));
  return etherValue;
}

export function filterData(arr: any[]) {
  return arr
    .map((res) => {
      const { offerer, recipient, offer, consideration, data } = res;
      const { transactionHash } = data;

      let acceptedOffers: any[] = [];
      let rejectedOffers: any[] = [];

      offer.map((offerRes: any[]) => {
        if (offerRes[0] !== 2) {
          rejectedOffers.push(offerRes);
        } else {
          acceptedOffers.push(offerRes);
        }
      });

      let acceptedData: any;

      if (acceptedOffers.length !== 0) {
        acceptedData = acceptedOffers.map((accepted) => {
          if (accepted[0] === 2) {
            return {
              contractAddress: accepted[1],
              tokenId: accepted[2]?._hex,
              quantity: hexToDecimal(accepted[3]?._hex),
            };
          }
          return acceptedData;
        })[0];
      }

      const considerationData = consideration.map((considerationRes: { _hex: any }[], index: number) => {
        if (index === 0) {
          return {
            price: considerationRes[3]?._hex,
          };
        }
      })[0];

      if (acceptedData !== undefined) {
        return {
          transaction_hash: transactionHash,
          seller_address: offerer,
          buyer_address: recipient,
          nft_token_id: acceptedData?.tokenId,
          nft_collection_address: acceptedData?.contractAddress,
          quantity_sold: acceptedData?.quantity,
          amount_paid: considerationData?.price,
        };
      }
    })
    .filter((d) => d);
}
