const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';
let currentRate = 0;

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

async function fetchExchangeRate() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    currentRate = data.rates.LKR;
    document.getElementById('rate').textContent = `1 USD = ${formatCurrency(currentRate)} LKR`;
    document.getElementById('lastUpdate').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    return currentRate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    document.getElementById('rate').textContent = 'Error fetching rate';
    return null;
  }
}

function convertCurrency(usd) {
  if (!currentRate) return;
  const lkr = usd * currentRate;
  document.getElementById('lkr').textContent = formatCurrency(lkr);
}

document.addEventListener('DOMContentLoaded', async () => {
  await fetchExchangeRate();
  
  const usdInput = document.getElementById('usd');
  usdInput.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 0;
    convertCurrency(value);
  });

  // Refresh rate every hour
  setInterval(fetchExchangeRate, 3600000);
});