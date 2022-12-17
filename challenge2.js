//import requires solana web3 functionalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

const Demo_secretKey = new Uint8Array([
    150, 170,   4, 210, 185,   6, 177, 255,  67,  61, 128,
      246,   4, 211,  46, 235,  92,  28, 150, 129,  70,  74,
      232,  15,  61, 125,  86, 206,  39, 205, 158, 243, 243,
      109, 253,  22, 198, 128, 108, 113,  88,   9,  14, 174,
      124,  67,  62,  81,  46, 225,  54, 173,  73, 174, 216,
      177, 231,  39, 211, 111, 144, 175, 109, 109
  ]);

//connect to devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// function to get wallet balance for the given publickey
const getWalletBalance = async (publickey, wallet = "Sender") => { 
    try {
        const walletBalance = await connection.getBalance(publickey);
        console.log(`Current ${wallet} Wallet Balance has : ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    }
    catch(err) {
        console.log(err);
    }
}

const transferSol = async () => 
{
    // The Sender Wallet
    const from = Keypair.fromSecretKey(Demo_secretKey);
    
    // The Receiver Wallet
    const reciever_publickey = 'B25EfCndiUxDXnoyPqmiGstL2cvXxLuWSg6Yop4CHzDW'
    
    // Airdrop SOL to the Sender Wallet
    console.log("Airdropping SOL to Sender Wallet.");
    const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(from.publicKey),
        2 * LAMPORTS_PER_SOL
    );

    let latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: fromAirDropSignature
    });

    // Display balance of the Sender Wallet after Airdrop
    getWalletBalance(from.publicKey);

    // Pass the 50% balance of the Sender Wallet to the Receiver Wallet
    const walletBalance = await connection.getBalance(from.publicKey);
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: new PublicKey(reciever_publickey),
            lamports: LAMPORTS_PER_SOL * ((parseInt(walletBalance) / LAMPORTS_PER_SOL) / 2)
        })
    );

    // Get the Transaction Signature
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Transaction Signature is ', signature);

    // Check the Balance of the Receiver Wallet
    getWalletBalance(new PublicKey(reciever_publickey), "Receiver");

    // Check the Balance of the Sender Wallet
    getWalletBalance(from.publicKey);

}

transferSol();