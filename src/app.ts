require("dotenv").config();
import { BigNumber, Contract, providers, Wallet } from "ethers";


import seaportABI from './abi/seaport.json'; // ABI for the seaport contract

const apikey = process.env.ALCHEMY_API_KEY;

const seaportContract = "0x00000000006c3852cbEf3e08E8dF289169EdE581";

const ETHEREUM_RPC_URL = "wss://eth-mainnet.g.alchemy.com/v2/" + apikey;



const provider = new providers.WebSocketProvider(ETHEREUM_RPC_URL);

const getData = async () => {
  const contract = new Contract(seaportContract, seaportABI, provider);
  contract.on("OrderFulfilled", (orderHash, offerer, zone, recipient,  offer,  consideration, event) => {

    let eventResults = {
      orderHash: orderHash,
      offerer: offerer,
      zone: zone,
      recipient: recipient,
      offer: offer,
      data: event,
    };
    
    console.log(JSON.stringify(eventResults, null, 7));
  });
}

getData();

