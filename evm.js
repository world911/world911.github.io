const RPC = {

eth:"https://ethereum.publicnode.com",
bsc:"https://bsc-dataseed.binance.org",
polygon:"https://polygon-bor-rpc.publicnode.com",
arb:"https://arbitrum-one.publicnode.com",
base:"https://mainnet.base.org",
op:"https://mainnet.optimism.io",

avax:"https://api.avax.network/ext/bc/C/rpc",
linea:"https://rpc.linea.build",
zksync:"https://mainnet.era.zksync.io",
scroll:"https://rpc.scroll.io",
mantle:"https://rpc.mantle.xyz",
blast:"https://rpc.blast.io",

gnosis:"https://rpc.gnosischain.com",
fantom:"https://rpc.ftm.tools",
cronos:"https://evm.cronos.org",
celo:"https://forno.celo.org",
moonbeam:"https://rpc.api.moonbeam.network",
metis:"https://andromeda.metis.io/?owner=1088",

kava:"https://evm.kava.io",
harmony:"https://api.harmony.one",
okc:"https://exchainrpc.okex.org",
aurora:"https://mainnet.aurora.dev",
moonriver:"https://rpc.api.moonriver.moonbeam.network",
core:"https://rpc.coredao.org",
taiko:"https://rpc.mainnet.taiko.xyz"

};



const COIN = {

eth:"ethereum",
bsc:"binancecoin",
polygon:"matic-network",
arb:"ethereum",
base:"ethereum",
op:"ethereum",

avax:"avalanche-2",
linea:"ethereum",
zksync:"ethereum",
scroll:"ethereum",
mantle:"mantle",
blast:"ethereum",

gnosis:"xdai",
fantom:"fantom",
cronos:"crypto-com-chain",
celo:"celo",
moonbeam:"moonbeam",
metis:"metis-token",

kava:"kava",
harmony:"harmony",
okc:"oec-token",
aurora:"aurora-near",
moonriver:"moonriver",
core:"coredao",
taiko:"ethereum"

};



let results=[];



async function rpcCall(method,params,url){

let r=await fetch(url,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({

jsonrpc:"2.0",
id:1,
method:method,
params:params

})
});


return await r.json();

}



async function getPrice(id){

try{

let r=await fetch(
"https://api.coingecko.com/api/v3/simple/price?ids="+id+"&vs_currencies=usd"
);

let d=await r.json();

return d[id]?.usd || 0;

}

catch{

return 0;

}

}




function formatBalance(value){

if(value===0) return "0";


return Number(value)
.toFixed(12)
.replace(/0+$/,"")
.replace(/\.$/,"");

}




function sleep(ms){

return new Promise(r=>setTimeout(r,ms));

}




async function scan(){

results=[];


let output=document.getElementById("result");


output.innerHTML=
"<tr><td colspan='6'>Scanning...</td></tr>";



let addresses=document
.getElementById("addresses")
.value
.split("\n")
.map(x=>x.trim())
.filter(x=>x);



let selected=document
.getElementById("network")
.value;



let networks =
selected==="all"
?
Object.keys(RPC)
:
[selected];



for(let addr of addresses){


for(let chain of networks){


try{


let bal=await rpcCall(
"eth_getBalance",
