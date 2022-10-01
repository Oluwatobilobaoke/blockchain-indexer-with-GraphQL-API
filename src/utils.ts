import pool from './dbconfig';
import { BigNumber } from "ethers";


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

export function weiToEther(wei: BigNumber): number {
  return wei.div(BigNumber.from(10).pow(18)).toNumber();
}
