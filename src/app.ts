require("dotenv").config();
import pool from './dbconfig';
import { Contract, providers } from "ethers";
import { createSaleRecord, filterData } from "./utils";



import seaportABI from './abi/seaport.json'; // ABI for the seaport contract

const apikey = process.env.ALCHEMY_API_KEY;

const seaportContract = "0x00000000006c3852cbEf3e08E8dF289169EdE581";

const ETHEREUM_RPC_URL = "wss://eth-mainnet.g.alchemy.com/v2/" + apikey;

const provider = new providers.WebSocketProvider(ETHEREUM_RPC_URL);

const connectToDb = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to DB");
    client.release();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

connectToDb();


const EventArray: any[] = [];

const getData = async () => {
  const contract = new Contract(seaportContract, seaportABI, provider);
   contract.on("OrderFulfilled", async (orderHash, offerer, zone, recipient,  offer,  consideration, event) => {
    
  let eventResults = {
    orderHash: orderHash,
    offerer: offerer,
    zone: zone,
    recipient: recipient,
    offer: offer,
    consideration: consideration,
    data: event,
  };

  console.log("=========getting event from SeaPort =======");

  EventArray.push(eventResults);



  console.log("=========Filtering Results from SeaPort =======");

  const filtererdArray = filterData(EventArray);
  //  console.log("=====filtererdArray Results======");
  //  console.log(JSON.stringify(filtererdArray, null, 6));
  //  console.log("=====filtererdArray Results======");
  
  console.log("=========Saving Results to Db =======");
  await createSaleRecord(filtererdArray);
   
  });


    




}

getData();

