## Triggering Gasless Transactions With Lazorkit

This guide assumes you have finished the Creating Passkey-Based Wallets with Lazorkit guide

To trigger transactions using Lazorkit, youll need to expose some functions provided by Lazorkits own useWallet() hook

```ts
import { useWallet } from "@lazorkit/wallet";
import React, { useEffect , useState } from "react";

  const { signAndSendTransaction, isSigning, smartWalletPubkey, isConnected } =
    useWallet();
  const [txStatus, setTxStatus] = useState<"idle" | "success" | "error" | "pending">("idle");
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
 
  const handleTransaction = async () => {
    if (!smartWalletPubkey || !recipient || !amount) return;

    try {
      setTxStatus("idle");
      setTxError("");
      const recipientPubkey = new PublicKey(recipient);
      const amountInLamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      if (isNaN(amountInLamports) || amountInLamports <= 0) {
        setTxError("Invalid amount");
        setTxStatus("error");
        return;
      }  

      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports: amountInLamports,
      });

      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          clusterSimulation : 'devnet' // This is for devnet
        },
      });

      if (signature) {
        setTxStatus("success");
        setRecipient("");
        setAmount("");
        await fetchUserBalances();
      }
        alert("Transaction Successful")
        // View the transaction on the Solscan Devnet
        console.log(`https://solscan.io/tx/${signature}?cluster=devnet`);
    } catch(error){
      console.error(error)
    }
}
```


