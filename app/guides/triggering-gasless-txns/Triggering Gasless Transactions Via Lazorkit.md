## Triggering Gasless Transactions With Lazorkit

This guide assumes you have finished the Creating Passkey-Based Wallets with Lazorkit guide

To trigger transactions using Lazorkit, youll need to expose some functions provided by Lazorkits own useWallet() hook

```ts
import { useWallet } from "@lazorkit/wallet";
import React, { useEffect, useState } from "react";

const { signAndSendTransaction, isSigning, smartWalletPubkey, isConnected } =
  useWallet();
const [txStatus, setTxStatus] = useState<
  "idle" | "success" | "error" | "pending"
>("idle");
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
        clusterSimulation: "devnet", // This is for devnet
      },
    });

    if (signature) {
      setTxStatus("success");
      setRecipient("");
      setAmount("");
      await fetchUserBalances();
    }
    alert("Transaction Successful");
    // View the transaction on the Solscan Devnet
    console.log(`https://solscan.io/tx/${signature}?cluster=devnet`);
  } catch (error) {
    console.error(error);
  }
};
```

Then build a UI responsible for submitting transactions

```ts
import { useState } from "react";

export default function TransferForm() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  if (!isConnected) return null;

  return (
    <div className="border border-gray-300 p-6 rounded-md mt-6">
      <label className="block text-sm mb-2">Recipient Address</label>
      <input
        className="w-full border px-3 py-2 mb-4 text-sm font-mono"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />

      <label className="block text-sm mb-2">Amount (SOL)</label>
      <input
        type="number"
        className="w-full border px-3 py-2 mb-4 text-sm"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={() => handleTransaction()}
        disabled={isSigning}
        className="w-full bg-black text-white py-3 rounded-md text-sm"
      >
        {isSigning ? "Sending..." : "Send SOL"}
      </button>

      {status === "success" && (
        <p className="text-green-600 text-sm mt-4 text-center">
          Transaction successful 🎉
        </p>
      )}
    </div>
  );
}
```

And there you have it you now have a production-ready gasless transaction flow.


Refresh your app / balance to see the changes

###### Common Mistakes

  <li>Passing SOL instead of lamports</li>
  <li>Not checking wallet connection</li>
  <li>Forgetting <code>clusterSimulation: "devnet"</code></li>
