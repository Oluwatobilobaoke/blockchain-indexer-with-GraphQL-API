import pool from './dbconfig';
import { BigNumber, ethers } from "ethers";


export async function createSaleRecordOnDB(saleObject: any) {
  const client = await pool.connect();
  try {
    const query = {
      text: `INSERT INTO sales (transactionHash, sellerAddress, buyerAddress, nftTokenId, nftCollectionAddress, quantitySold, amountPaid) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      values: [
        saleObject.transactionHash,
        saleObject.offerer,
        saleObject.recipient,
        saleObject.tokenId,
        saleObject.contractAddress,
        saleObject.quantity,
        saleObject.price,
      ],
    };
    await client.query(query);
  } catch (err) {
    console.error(err);
  }
}
// export async function createSaleOnDB(sale: any) {
//   const client = await pool.connect();
//   const query = {
//     text: 'INSERT INTO sales(order_hash, offerer, zone, recipient, offer, consideration, data) VALUES($1, $2, $3, $4, $5, $6, $7)',
//     values: [sale.orderHash, sale.offerer, sale.zone, sale.recipient, sale.offer, sale.consideration, sale.data],
//   };
//   client.query(query, (err, res) => {
//     console.log(err, res);
//     client.release();
//   });
// }

export function hexToDecimal(hex: string) {
  return parseInt(hex, 16);
}

// convert wei to ether
export function weiToEther(wei: string) {
  if (wei !== undefined) {
    const weiString = wei.toString();
    const weiBN = ethers.BigNumber.from(weiString);
    const etherValue = Number(ethers.utils.formatEther(weiBN));
    return etherValue;
  }
}


export function filterData(arr: any[]){
  return arr.map(async (res) => {
    const { offerer, recipient, offer, consideration, data } = res;
    const { transactionHash } = data;

    const offerData = offer.map((offerRes: any []) => {
      if (offerRes[0] === 2) {
        return {
          contractAddress: offerRes[1],
          tokenId: hexToDecimal(offerRes[2]?._hex),
          quantity: hexToDecimal(offerRes[3]?._hex),
        };
      }
    });

    // console.log("=====offerData Results======");
    // console.log(offerData);
    // console.log("=====offerData Results======");
    

    const considerationData = consideration.map((considerationRes: any[]) => {
      if (considerationRes[0] === 0) {
        // if the consideration is in empty, then remove the consideration
        
        return {
          price: hexToDecimal(considerationRes[3]?._hex),
        };
      }
    });


    // await createSaleRecordOnDB({
    //   transactionHash,
    //   offerer,
    //   recipient,
    //   ...offerData[0],
    //   ...considerationData[0],
    // });

    return {
      offerer,
      recipient,
      contractAddress: offerData[0]?.contractAddress,
      tokenId: offerData[0]?.tokenId,
      quantity: offerData[0]?.quantity,
      price: weiToEther((considerationData[0]?.price)),
      transactionHash,
    };
  });
};
