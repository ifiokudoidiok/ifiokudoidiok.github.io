function loadCurrencies(){
    const from = document.getElementById('from');
    const to = document.getElementById('to');
    
    fetch('https://free.currencyconverterapi.com/api/v5/currencies')
        .then(response=> response.json())
        .then((currencies)=>{
            let options='';
            for(key in currencies.results){
                options=`${options}<option>${key}</option>`;
            }
            from.innerHTML=options;
            to.innerHTML=options;
        })
}

function convertCurrency(){
    const from=document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const amount = document.getElementById('amount-from').value;
    let result = document.getElementById('result')
    const query = `${from}_${to}`
    if(from.length>0 && to.length){

        fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`)
        .then(response=>response.json())
        .then((value)=>{
            newResult = amount*(value[query].val)
            if(newResult != undefined){
                result.innerHTML = parseFloat(newResult);
            }
        })
    }
}
