// Import required Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
  } = require("@solana/web3.js");

  
      // Connect to the Devnet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
  // Get user's PUBLIC KEY from CLI
  const user_PublicKey = process.argv[2]

  // Get the wallet balance for the provided user_PublicKey
  const getWalletBalance = async () => {
    try {
  
      // Get wallet balance for the provided user_PublicKey
      const walletBalance = await connection.getBalance(
        new PublicKey(user_PublicKey)
      );
      console.log(
        `Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`
      );
    } catch (err) {
      console.log(err);
    }
  };
  
  const airDropSol = async () => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
      // Request airdrop of 2 SOL to the wallet
      console.log("Airdropping some SOL to my wallet!");
      const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(user_PublicKey),
        1 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
      console.log(err);
    }
  };
  
  // Show the wallet balance before and after airdropping SOL
  const mainFunction = async () => {
    if (user_PublicKey != null) {
      try {
        await getWalletBalance();
        await airDropSol();
        await getWalletBalance();
      } catch (error) {
        console.log(error)
      }
      
    } else {
      console.log('\nPlease Enter your PUBLIC KEY in the CLI as shown below -> \n\nuse: node challenge1.js <your-public-key>\n')
    }
  };
  
  mainFunction();