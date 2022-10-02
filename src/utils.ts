import pool from './dbconfig';
import { BigNumber, ethers } from "ethers";


export async function createSaleOnDB(sale: any) {
  const client = await pool.connect();
  const query = {
    text: 'INSERT INTO sales(order_hash, offerer, zone, recipient, offer, consideration, data) VALUES($1, $2, $3, $4, $5, $6, $7)',
    values: [sale.orderHash, sale.offerer, sale.zone, sale.recipient, sale.offer, sale.consideration, sale.data],
  };
  client.query(query, (err, res) => {
    console.log(err, res);
    client.release();
  });
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


export function filterData(arr: any[]){
  return arr.map((res) => {
    const { offerer, recipient, offer, consideration, data } = res;

    console.log("=====offerData Results======");
    console.log(offer);
    console.log("=====offerData Results======");
    
    const { transactionHash } = data;
// need to fix this to only pick offer array with type 2
    const offerData = offer.map((offerRes: any []) => {
      if (offerRes[0] === 2) {
        return {
          contractAddress: offerRes[1],
          tokenId: hexToDecimal(offerRes[2]?._hex),
          quantity: hexToDecimal(offerRes[3]?._hex),
        };
      }
    });

    

    const considerationData = consideration.map((considerationRes: any[]) => {
      if (considerationRes[0] === 0) {
        // if the consideration is in empty, then remove the
        return {
          price: hexToDecimal(considerationRes[3]?._hex),
          sender: considerationRes[4],
        };
      }
    });

    return {
      offerer,
      recipient,
      contractAddress: offerData[0].contractAddress,
      tokenId: offerData[0]?.tokenId,
      quantity: offerData[0]?.quantity,
      price: weiToEther((considerationData[0]?.price)),
      sender: considerationData[0]?.sender,
      transactionHash,
    };
  });
};
