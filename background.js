chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'convertUSDtoLKR',
    title: 'Convert %s USD to LKR',
    contexts: ['selection']
  });
});

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === 'convertUSDtoLKR') {
    const usdAmount = parseFloat(info.selectionText.replace(/[^0-9.-]+/g, ''));
    if (isNaN(usdAmount)) return;

    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      const rate = data.rates.LKR;
      const lkrAmount = usdAmount * rate;

      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'showConversion',
          usd: usdAmount,
          lkr: lkrAmount
        });
      });
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  }
});