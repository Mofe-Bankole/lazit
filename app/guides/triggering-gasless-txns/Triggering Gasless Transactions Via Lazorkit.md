## Triggering Gasless Transactions With Lazorkit

This guide assumes you have finished the Creating Passkey-Based Wallets with Lazorkit guide

To trigger transactions using Lazorkit, youll need to expose some functions provided by Lazorkits own useWallet() hook

```ts
 import { useWallet } from "@lazorkit/wallet";
 import React, { useEffect } from "react";
  
 const { signAndSendTransaction, isSigning, smartWalletPubkey, isConnected } =
    useWallet();
   
 const [recipient, setRecipient] = React.useState<string>("");
 const [amount, setAmount] = React.useState<string>("");
 
 const handleTransaction = async () => {
    if (!smartWalletPubkey || !recipient || !amount) return;
    if (Number(amount) > solBalance) {
      setTxError("Balance is less than Sending Amount");
      setTxStatus("idle");
    }

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
          feeToken: "USDC",
        },
      });

      if (signature) {
        setTxStatus("success");
        setRecipient("");
        setAmount("");
        await fetchUserBalances();
      }
      alert(`Transaction Confirmed : ${signature}`);
    } catch (error: any) {
      setTxStatus("error");
      setTxError(error.message || "Transaction failed");
      console.log(error);
      alert(error);
    }
  };
```


