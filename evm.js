const RPC={

eth:"https://ethereum.publicnode.com",

bsc:"https://bsc-dataseed.binance.org",

polygon:"https://polygon-bor-rpc.publicnode.com",

arb:"https://arbitrum-one.publicnode.com",

base:"https://mainnet.base.org",

op:"https://mainnet.optimism.io"

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


let networks;


if(selected==="all"){
networks=Object.keys(RPC);
}else{
networks=[selected];
}



for(let addr of addresses){

for(let chain of networks){

try{

let url=RPC[chain];


let balance=await rpcCall(
"eth_getBalance",
[addr,"latest"],
url
);


let tx=await rpcCall(
"eth_getTransactionCount",
[addr,"latest"],
url
);


let code=await rpcCall(
"eth_getCode",
[addr,"latest"],
url
);


let row={

address:addr,
network:chain,
balance:parseInt(balance.result,16)/1e18,
tx:parseInt(tx.result,16),
type:code.result==="0x"?"EOA":"Contract"

};


results.push(row);


output.innerHTML+=`

<tr>
<td>${row.address}</td>
<td>${row.network}</td>
<td>${row.balance}</td>
<td>${row.tx}</td>
<td>${row.type}</td>
</tr>

`;


await sleep(200);


}

catch(e){

output.innerHTML+=`

<tr>
<td>${addr}</td>
<td>${chain}</td>
<td colspan="3">Error</td>
</tr>

`;

}

}

}

}



function downloadCSV(){

let csv="Address,Network,Balance,TX Count,Type\n";


results.forEach(r=>{

csv+=`${r.address},${r.network},${r.balance},${r.tx},${r.type}\n`;

});


let blob=new Blob([csv]);

let a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="evm-wallets.csv";

a.click();

}
