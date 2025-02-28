const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');  // Sesuaikan ID dengan elemen asli
const toCurrency = document.getElementById('to-currency');    // Sesuaikan ID dengan elemen asli
const swapButton = document.getElementById('swap-btn');       // Sesuaikan ID dengan elemen asli
const convertButton = document.getElementById('convert-btn'); // Sesuaikan ID dengan elemen asli
const resultDiv = document.getElementById('result');

// Status konversi otomatis
let autoConvert = false;

// Tombol convert pertama kali
convertButton.addEventListener('click', async () => {
  autoConvert = true; // Aktifkan konversi otomatis
  await convertCurrency();
  convertButton.style.display = 'none'; // Sembunyikan tombol setelah konversi
});

// Swap mata uang
swapButton.addEventListener('click', async () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;

  // Reset hasil dan konversi ulang setelah swap
  resultDiv.innerHTML = '';
  await convertCurrency();
});

// Input perubahan jumlah
amountInput.addEventListener('input', async () => {
  if (autoConvert) {
    await convertCurrency(); // Konversi otomatis saat input berubah
  }
});

// Perubahan mata uang
[fromCurrency, toCurrency].forEach(element => {
  element.addEventListener('change', () => {
    autoConvert = false;  // Reset status jika mata uang diubah
    convertButton.style.display = 'block'; // Tampilkan tombol Convert
    resultDiv.innerHTML = ''; // Kosongkan hasil
  });
});

// Fungsi konversi
async function convertCurrency() {
  const amount = amountInput.value;
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!amount || amount <= 0 || isNaN(amount)) {
    resultDiv.innerHTML = 'Please enter a valid amount.';
    return;
  }

  try {
    const apiKey = '3ebe2ccf9eeea2aaef280201';
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.result === 'success') {
      const rate = data.conversion_rates[to];
      const convertedAmount = (amount * rate).toFixed(2);
      resultDiv.innerHTML = `${amount} ${from} = ${convertedAmount} ${to}`;
    } else {
      resultDiv.innerHTML = `Error: ${data['error-type']}`;
    }
  } catch (error) {
    resultDiv.innerHTML = 'Error fetching conversion rate. Please try again later.';
    console.error(error);
  }
}
