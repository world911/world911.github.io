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

gnosis:"https://rpc.gnosischain.com",
fantom:"https://rpc.ftm.tools",
cronos:"https://evm.cronos.org",
celo:"https://forno.celo.org",
moonbeam:"https://rpc.api.moonbeam.network"

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

gnosis:"xdai",
fantom:"fantom",
cronos:"crypto-com-chain",
celo:"celo",
moonbeam:"moonbeam"

};



let results=[];

let prices={};



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




async function loadPrices(){

let ids=[...new Set(Object.values(COIN))].join(",");


try{

let r=await fetch(
"https://api.coingecko.com/api/v3/simple/price?ids="+ids+"&vs_currencies=usd"
);


let data=await r.json();


for(let c in COIN){

prices[c]=data[COIN[c]]?.usd || 0;

}


}catch(e){

console.log("Price error");

}

}





function formatBalance(value){

return Number(value)
.toFixed(12)
.replace(/0+$/,"")
.replace(/\.$/,"");

}




async function scan(){


results=[];


let output=document.getElementById("result");


output.innerHTML=
"<tr><td colspan='6'>Scanning...</td></tr>";



await loadPrices();



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


let balance=await rpcCall(
"eth_getBalance",
[addr,"latest"],
RPC[chain]
);



let tx=await rpcCall(
"eth_getTransactionCount",
[addr,"latest"],
RPC[chain]
);



let code=await rpcCall(
"eth_getCode",
[addr,"latest"],
RPC[chain]
);



let amount =
parseInt(balance.result,16)/1e18;



let usd =
amount * (prices[chain] || 0);



results.push({

address:addr,

network:chain,

balance:formatBalance(amount),

usd:usd,

tx:parseInt(tx.result,16),

type:
code.result==="0x"
?
"EOA"
:
"Contract"

});



}catch(e){

console.log("Failed:",chain);

}


}


}



// highest USD first

results.sort((a,b)=>b.usd-a.usd);



output.innerHTML="";



results.forEach(r=>{


output.innerHTML+=`

<tr>

<td>${r.address}</td>

<td>${r.network}</td>

<td>${r.balance}</td>

<td>$${r.usd.toFixed(2)}</td>

<td>${r.tx}</td>

<td>${r.type}</td>

</tr>

`;

});


}





function downloadCSV(){


let csv =
"Address,Network,Balance,USD Value,TX Count,Type\n";


results.forEach(r=>{

csv+=
`${r.address},${r.network},${r.balance},$${r.usd.toFixed(2)},${r.tx},${r.type}\n`;

});


let blob=new Blob([csv]);

let a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="evm-wallets.csv";

a.click();


}
