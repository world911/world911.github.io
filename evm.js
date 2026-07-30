const RPC = {

eth:"https://ethereum.publicnode.com",
bsc:"https://bsc-dataseed.binance.org",
polygon:"https://polygon-bor-rpc.publicnode.com",
arb:"https://arbitrum-one.publicnode.com",
base:"https://mainnet.base.org",
op:"https://mainnet.optimism.io"

};


const COIN = {

eth:"ethereum",
bsc:"binancecoin",
polygon:"matic-network",
arb:"ethereum",
base:"ethereum",
op:"ethereum"

};


let results=[];


async function rpcCall(method,params,url){

let r = await fetch(url,{
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

let r = await fetch(
"https://api.coingecko.com/api/v3/simple/price?ids="+id+"&vs_currencies=usd"
);

let data = await r.json();

return data[id].usd || 0;

}catch{

return 0;

}

}



function formatBalance(value){

if(value===0) return "0";

return Number(value)
.toFixed(12)
.replace(/\.?0+$/,"");

}



function sleep(ms){

return new Promise(resolve=>setTimeout(resolve,ms));

}



async function scan(){

results=[];

let output=document.getElementById("result");

output.innerHTML="";


let addresses=document
.getElementById("addresses")
.value
.split("\n")
.map(x=>x.trim())
.filter(x=>x);



let selected=document
.getElementById("network")
.value;


let networks = selected==="all"
? Object.keys(RPC)
: [selected];



for(let addr of addresses){

for(let chain of networks){

try{


let balanceData = await rpcCall(
"eth_getBalance",
[addr,"latest"],
RPC[chain]
);



let txData = await rpcCall(
"eth_getTransactionCount",
[addr,"latest"],
RPC[chain]
);



let codeData = await rpcCall(
"eth_getCode",
[addr,"latest"],
RPC[chain]
);



let balance =
parseInt(balanceData.result,16) / 1e18;



let price =
await getPrice(COIN[chain]);



let usd =
balance * price;



let row={

address:addr,
network:chain,
balance:formatBalance(balance),
usd:"$"+usd.toFixed(2),
tx:parseInt(txData.result,16),
type:codeData.result==="0x"
?"EOA"
:"Contract"

};



results.push(row);



output.innerHTML += `

<tr>
<td>${row.address}</td>
<td>${row.network}</td>
<td>${row.balance}</td>
<td>${row.usd}</td>
<td>${row.tx}</td>
<td>${row.type}</td>
</tr>

`;



await sleep(500);


}catch(e){


output.innerHTML += `

<tr>
<td>${addr}</td>
<td>${chain}</td>
<td colspan="4">Error</td>
</tr>

`;

}


}

}


}



function downloadCSV(){

let csv =
"Address,Network,Balance,USD Value,TX Count,Type\n";


results.forEach(r=>{

csv +=
`${r.address},${r.network},${r.balance},${r.usd},${r.tx},${r.type}\n`;

});


let blob=new Blob([csv]);

let a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="evm-wallets.csv";

a.click();

}
