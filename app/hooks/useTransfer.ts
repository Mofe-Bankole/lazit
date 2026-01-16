import { useWallet } from "@lazorkit/wallet";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { useState } from "react";
import { Transaction, TransactionProps } from "../../lib/types";

export function useTransfer(props: TransactionProps) {
  const { signAndSendTransaction } = useWallet();

  // Initial Values 
  const [transaction, setTransaction] = useState<Transaction>({
    recipient: null,
    sender: null,
    amount: null,
    signature: null,
    error: null,
    txStatus: "idle",
    solscanurl: null,
  });

  const handleTransactions = async () => {
    if (!props.recipient || !props.amount || !props.sender) {
      setTransaction((prev) => ({
        ...prev,
        error: "A Variable was not supplied",
        txStatus: "error",
      }));
      return;
    }

    try {
      setTransaction((prev) => ({
        ...prev,
        amount: props.amount,
        recipient: props.recipient,
        sender: props.sender,
        txStatus: "pending",
      }));

      const senderPubkey = new PublicKey(props.sender as string);
      const recipientPubkey = new PublicKey(props.recipient as string);
      const lamports = parseFloat(props.amount as string) * LAMPORTS_PER_SOL;

      if (isNaN(lamports) || lamports <= 0) {
        setTransaction((prev) => ({
          ...prev,
          error: "INVALID AMOUNT",
          txStatus: "error",
        }));
        return;
      }

      const instruction = SystemProgram.transfer({
        fromPubkey: senderPubkey,
        toPubkey: recipientPubkey,
        lamports,
      });

      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          clusterSimulation: "devnet",
        },
      });

      const solscanurl = `https://solscan.io/tx/${signature}?cluster=devnet`;

      setTransaction({
        recipient: props.recipient,
        sender: props.sender,
        amount: props.amount,
        txStatus: "success",
        error: null,
        signature,
        solscanurl,
      });


    } catch (error) {
      setTransaction((prev) => ({
        ...prev,
        error: `${error}`,
        txStatus: "error",
      }));
      console.error("Transaction error:", error);
    }
  };

  return {
    beneficiary: transaction.recipient,
    sender: transaction.sender,
    explorerUrl: transaction.solscanurl,
    error: transaction.error,
    signature: transaction.signature,
    status: transaction.txStatus,
    amount: transaction.amount,
    handleTransactions,
  };
}

export default useTransfer;
