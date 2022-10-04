import pool from './dbconfig';
import { BigNumber, ethers } from 'ethers';

// they are displaying data easy for humans to read, and storing data in a way that is easy for machines to read and write.

// recieve an array of objects and bulk insert into db
export async function createSaleRecord(sale: any) {
  // take data from dataObj and insert into db
  const client = await pool.connect();
  try {
    const query = {
      text: 'INSERT INTO sale(transaction_hash, seller_address, buyer_address, nft_token_id, nft_collection_address, quantity_sold, amount_paid) VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [
        sale.transaction_hash,
        sale.seller_address,
        sale.buyer_address,
        sale.nft_token_id,
        sale.nft_collection_address,
        sale.quantity_sold,
        sale.amount_paid,
      ],
    };
    await client.query(query);
    console.log('=========Saved new Sales to Db=======');
  } catch (err) {
    return err;
  }
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

export function filterData(res: any) {
  const { offerer, recipient, offer, consideration, data } = res;
  const { transactionHash } = data;

  const acceptedOffers = offer.filter((item: any, index: number) => {
    return item[index] === 2;
  });

  let acceptedData: any;

  acceptedData = acceptedOffers.map((accepted: any) => {
    if (accepted[0] === 2) {
      return {
        contractAddress: accepted[1],
        tokenId: accepted[2]?._hex,
        quantity: hexToDecimal(accepted[3]?._hex),
      };
    }
  })[0];

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
}
