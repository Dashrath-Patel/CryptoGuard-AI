// Quick test to check what the API returns
const testWallet = '0xd34da7d8b2df194f026813a382e62054ccf5c58b';

fetch(`http://localhost:3000/api/market-guardian/data?wallet=${testWallet}`)
  .then(response => response.json())
  .then(data => {
    console.log('Full API Response:', JSON.stringify(data, null, 2));
    if (data.userWallet) {
      console.log('\nUser Wallet Data:', JSON.stringify(data.userWallet, null, 2));
      if (data.userWallet.error) {
        console.log('\nAPI Error:', data.userWallet.error);
      }
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
