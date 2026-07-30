async function scan(){

results=[];

let output=document.getElementById("result");

output.innerHTML="<tr><td colspan='6'>Scanning wallets...</td></tr>";


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



if(output.innerHTML.includes("Scanning wallets...")){
    output.innerHTML="";
}



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


if(output.innerHTML.includes("Scanning wallets...")){
    output.innerHTML="";
}


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
