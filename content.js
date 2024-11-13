let currentRate = 0;

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

async function fetchExchangeRate() {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    currentRate = data.rates.LKR;
    return currentRate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return null;
  }
}

// Initialize exchange rate
(async () => {
  await fetchExchangeRate();
  // Update exchange rate periodically
  setInterval(fetchExchangeRate, 3600000); // Every hour
})();

// Handle manual conversion requests from context menu
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'showConversion') {
    // Remove any existing tooltips
    const existingTooltip = document.getElementById('usd-lkr-tooltip');
    if (existingTooltip) {
      existingTooltip.remove();
    }

    const tooltip = document.createElement('div');
    tooltip.id = 'usd-lkr-tooltip';
    tooltip.style.cssText = `
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      background: #2563eb;
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
      animation: slideInDown 0.3s ease-out;
    `;
    
    // Add animation styles if not already present
    if (!document.getElementById('usd-lkr-styles')) {
      const style = document.createElement('style');
      style.id = 'usd-lkr-styles';
      style.textContent = `
        @keyframes slideInDown {
          from { 
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to { 
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    tooltip.textContent = `${formatCurrency(message.usd)} USD = ${formatCurrency(message.lkr)} LKR`;
    document.body.appendChild(tooltip);
    
    // Remove tooltip after 3 seconds
    setTimeout(() => tooltip.remove(), 3000);
  }
});