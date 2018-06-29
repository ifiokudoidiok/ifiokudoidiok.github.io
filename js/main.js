import Database from './idb-test/index';

if ('serviceWorker' in navigator) { 
  // Register a service worker hosted at the root of the
  // site using the default scope.
  navigator.serviceWorker.register('/js/service-worker.js').then(function(registration) {
    console.log('Service worker registration succeeded:', registration);
  }).catch(function(error) {
    console.log('Service worker registration failed:', error);
  });
} else {
  console.log('Service workers are not supported.');
}
document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const currencyConvertFrom = document.querySelector('.currency__convert-from');
  const currencyConvertTo = document.querySelector('.currency__convert-to');
  const button = document.querySelector('.convert');
  const originalCurrencyInputField = document.querySelector(
    'input#original_amount',
  );
  const convertedCurrencyInputField = document.querySelector(
    'input#converted_amount',
  );

  
   // Create HTML Element and set inline value of the currency
   
  function createNode(nodeType, currency) {
    if (arguments.length !== 2) {
      return 'You need to specify both arguments for the node to be created correctly.';
    }

    const node = document.createElement(nodeType);
    node.innerText = currency;

    return node;
  }

  
   //Add each currency to both select HTML Elements on the DOM
   
  function addCurrenciesToDOM(currencies) {
    if (currencies.length === 0 || typeof currencies === 'undefined') {
      return 'Currencies array cannot be empty or undefined.';
    }

    const nodeTypeToCreate = 'option';

    currencies.map(currency => {
      currencyConvertFrom.appendChild(createNode(nodeTypeToCreate, currency));
      currencyConvertTo.appendChild(createNode(nodeTypeToCreate, currency));
    });
  }

  
   //Get amount in the input field
   
  function getInputAmount() {
    const inputAmount = document.querySelector('input#amount').value;
    return inputAmount;
  }

  
  //  Get a list of all the currencies using the API
   
  function fetchListOfCurrencies() {
    const url = 'https://free.currencyconverterapi.com/api/v5/currencies';

    // Before we fetch from the API itself, check if we don't have a cached version locally
    if ('caches' in window) {
      caches.match(url).then(response => {
        if (response) {
          response.json().then(data => {
            const currencies = Object.keys(data.results).sort();

            addCurrenciesToDOM(currencies);
          });
        }
      });
    }

    // fetch data from API if no cached version
    fetch(url, {
      cache: 'default',
    })
      .then(res => res.json())
      .then(data => {
        const currencies = Object.keys(data.results).sort();

        addCurrenciesToDOM(currencies);
      })
      .catch(err =>
        console.error(
          `The following error occured while trying to get the list of currencies. ${err}`,
        ),
      );
  }

  
   // Fetch exchange rate between two currencies
   
  function fetchCurrencyRate(url, queryString) {
    if (arguments.length !== 2) {
      return 'You need to specify both arguments for fetch to work.';
    }

    const inputAmount = getInputAmount();

    fetch(url, {
      cache: 'default',
    })
      .then(res => res.json())
      .then(data => {
        const exchangeRate = Object.values(data);

        // Save currency exchange rate to IndexedDB to be used when the user is offline
        Database.saveCurrencies(queryString, exchangeRate);

        calculateExchangeRate(...exchangeRate, inputAmount);
      })
      .catch(err => {
        console.error(
          `The following error occured while trying to get the conversion rate. ${err}`,
        );
        // Get currency exchange rate when the user is offline
        Database.getCurrencies(queryString).then(data => {
          if (typeof data === 'undefined') return;
          calculateExchangeRate(data, inputAmount);
        });
      });
  }
  
    //Build the API URL to use to get the conversion rate for a specific set of currencies
   
  function buildAPIUrl(queryString) {
    if (typeof queryString === 'undefined') {
      return 'The parameter passed to the function is undefined.';
    }

    const currencyUrl = `https://free.currencyconverterapi.com/api/v5/convert?q=${queryString}&compact=ultra`;
    return currencyUrl;
  }

  function getExchangeRate() {
    const currency1 = document.querySelector('.currency__convert-from').value;
    const currency2 = document.querySelector('.currency__convert-to').value;

    const currencyQueryString = `${currency1}_${currency2}`;

    const url = buildAPIUrl(currencyQueryString);
    fetchCurrencyRate(url, currencyQueryString);
  }

  function detectEnterPressed(event) {
    if (typeof event === 'undefined') {
      return "Most likely the DOM key event listener wasn't started. 'Enter' key will not fire.";
    }

    if (event.keyCode === 13) {
      getExchangeRate();
    }
  }
   // Calculate the exchange rate based on the amount entered and the currencies selected
   
  function calculateExchangeRate(exchangeRate, input) {
    if (arguments.length !== 2) {
      return 'You need to specify both arguments for the exchange rate to be calculated correctly.';
    }

    const convertedCurrency = input * exchangeRate;

    originalCurrencyInputField.value = input;
    convertedCurrencyInputField.value = convertedCurrency.toFixed(2);
  } 
  function addEventListeners() {
    button.addEventListener('click', getExchangeRate);
    body.addEventListener('keydown', e => detectEnterPressed(e));
  }
  
  function init() {
    addEventListeners();
    fetchListOfCurrencies();
  }

  init();
});