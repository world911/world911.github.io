const networks = {
    ethereum: {
        name: "Ethereum",
        rpc: "https://ethereum-rpc.publicnode.com",
        symbol: "ETH",
        price: "ethereum"
    },
    bsc: {
        name: "BNB Chain",
        rpc: "https://bsc-dataseed.binance.org",
        symbol: "BNB",
        price: "binancecoin"
    },
    polygon: {
        name: "Polygon",
        rpc: "https://polygon-rpc.com",
        symbol: "POL",
        price: "matic-network"
    },
    arbitrum: {
        name: "Arbitrum",
        rpc: "https://arb1.arbitrum.io/rpc",
        symbol: "ETH",
        price: "ethereum"
    },
    optimism: {
        name: "Optimism",
        rpc: "https://mainnet.optimism.io",
        symbol: "ETH",
        price: "ethereum"
    },
    avalanche: {
        name: "Avalanche",
        rpc: "https://api.avax.network/ext/bc/C/rpc",
        symbol: "AVAX",
        price: "avalanche-2"
    },
    fantom: {
        name: "Fantom",
        rpc: "https://rpc.ftm.tools",
        symbol: "FTM",
        price: "fantom"
    },
    base: {
        name: "Base",
        rpc: "https://mainnet.base.org",
        symbol: "ETH",
        price: "ethereum"
    },
    cronos: {
        name: "Cronos",
        rpc: "https://evm.cronos.org",
        symbol: "CRO",
        price: "crypto-com-chain"
    },
    gnosis: {
        name: "Gnosis",
        rpc: "https://rpc.gnosischain.com",
        symbol: "xDAI",
        price: "xdai"
    }
};


let prices = {};


async function loadPrices(){

    let ids = [...new Set(
        Object.values(networks).map(x => x.price)
    )].join(",");


    let res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids="
        + ids +
        "&vs_currencies=usd"
    );

    let data = await res.json();

    prices = {};

    for(let id in data){
        prices[id] = data[id].usd;
    }
}



async function getBalance(rpc,address){

    let response = await fetch(rpc,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            jsonrpc:"2.0",
            method:"eth_getBalance",
            params:[address,"latest"],
            id:1
        })
    });


    let data = await response.json();

    return Number(BigInt(data.result || "0")) / 1e18;
}



function formatNumber(num){

    if(num === 0) return "0";

    if(num < 0.000001)
        return num.toFixed(10);

    return Number(num.toFixed(8)).toString();
}



async function checkWallets(){

    let addresses =
    document.getElementById("addresses")
    .value
    .split("\n")
    .map(x=>x.trim())
    .filter(x=>x);


    let selected =
    document.getElementById("network").value;


    let networksToCheck =
    selected === "all"
    ? Object.keys(networks)
    : [
