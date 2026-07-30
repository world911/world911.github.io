const RPC = {

eth:"https://ethereum.publicnode.com",
bsc:"https://bsc-dataseed.binance.org",
arb:"https://arbitrum-one.publicnode.com",
base:"https://mainnet.base.org",
polygon:"https://polygon-bor-rpc.publicnode.com",
op:"https://mainnet.optimism.io",
avax:"https://api.avax.network/ext/bc/C/rpc",
linea:"https://rpc.linea.build",
zksync:"https://mainnet.era.zksync.io",
gnosis:"https://rpc.gnosischain.com"

};


const COIN = {

eth:"ethereum",
bsc:"binancecoin",
arb:"ethereum",
base:"ethereum",
polygon:"matic-network",
op:"ethereum",
avax:"avalanche-2",
linea:"ethereum",
zksync:"ethereum",
gnosis:"xdai"

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

let ids=Object.values(COIN).join(",");

let r=await fetch(
"https://api.coingecko.com/api/v3/simple/price?ids="+ids+"&vs_currencies=usd"
);

let data=await r.json();


for(let key in COIN){

prices[key]=data[COIN[key]]?.usd || 0;

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



let amount=
parseInt(balance.result,16)/1e18;



let usd=
amount*(prices[chain]||0);



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

console.log(chain,e);

}


}

}



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
