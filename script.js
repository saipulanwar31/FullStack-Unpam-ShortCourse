document.addEventListener("DOMContentLoaded", () => {

  const connectBtn = document.getElementById("connectBtn");
  const statusEl = document.getElementById("status");
  const addressEl = document.getElementById("address");
  const networkEl = document.getElementById("network");
  const balanceEl = document.getElementById("balance");
  const identityEl = document.getElementById("identity");

  // Avalanche Fuji Testnet
  const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

  let isConnected = false;
  let currentAccount = null;

  // Hide Name and NIM
  identityEl.style.display = "none";

  function shortenAddress(address) {
    if (!address) return "-";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function formatAvaxBalance(balanceWei) {
    const balance = parseInt(balanceWei, 16);
    return (balance / 1e18).toFixed(4);
  }

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Core Wallet tidak terdeteksi. Silakan install Core Wallet.");
      return;
    }

    try {
      statusEl.textContent = "Connecting...";

      // Request wallet accounts
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      currentAccount = accounts[0];
      isConnected = true;

      // Show Name and NIM
      identityEl.style.display = "block";

      addressEl.textContent = shortenAddress(currentAccount);
      connectBtn.textContent = "Disconnect Wallet";

       // Get chainId
      const chainId = await ethereum.request({
        method: "eth_chainId",
      });

      if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
        networkEl.textContent = "Avalanche Fuji Testnet";
        statusEl.textContent = "Connected ✅";
        statusEl.style.color = "#4cd137";

        // Get AVAX balance
        const balanceWei = await ethereum.request({
          method: "eth_getBalance",
          params: [currentAccount, "latest"],
        });

        balanceEl.textContent = formatAvaxBalance(balanceWei);
      } else {
        networkEl.textContent = "Wrong Network ❌";
        statusEl.textContent = "Switch to Fuji";
        statusEl.style.color = "#fbc531";
        balanceEl.textContent = "-";
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent = "Connection Failed ❌";
    }
  }

  function disconnectWallet() {
    isConnected = false;
    currentAccount = null;

    identityEl.style.display = "none";

    statusEl.textContent = "Not Connected";
    statusEl.style.color = "#ffffff";
    addressEl.textContent = "-";
    networkEl.textContent = "-";
    balanceEl.textContent = "-";

    connectBtn.textContent = "Connect Wallet";
  }

  connectBtn.addEventListener("click", () => {
    if (!isConnected) {
      connectWallet();
    } else {
      disconnectWallet();
    }
  });

  if (window.ethereum) {
    ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        currentAccount = accounts[0];
        addressEl.textContent = shortenAddress(currentAccount);
      }
    });

    ethereum.on("chainChanged", () => {
      window.location.reload();
    });
  }
});
