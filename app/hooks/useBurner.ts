import { PublicKey, useWallet } from "@lazorkit/wallet";
import useTransfer from "./useTransfer";
import { BurnerTransferProps, Transaction } from "../../lib/types";
import useBalance from "./useBalances";
import { useCallback, useState } from "react";
import {
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction as SolanaTransaction,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";
import { createConnection } from "../../lib/solana";

export function useBurner(props: BurnerTransferProps) {
  const { smartWalletPubkey } = useWallet();
  const { fetchBalances, SolBalance } = useBalance(
    new PublicKey(props.sender as string)
  );

  const [burner, setBurner] = useState<Transaction>({
    recipient: null,
    sender: null,
    amount: null,
    signature: null,
    error: null,
    txStatus: "idle",
    solscanurl: null,
  });

  const handleBurnerSweep = useCallback(async () => {
    if (!props.recipient || !props.amount || !props.sender) {
      setBurner((prev) => ({
        ...prev,
        error: "A Variable was not set",
        txStatus: "error",
      }));
      return;
    }
    const balance = SolBalance as number;

    if (SolBalance == 0) {
      setBurner((prev) => ({
        ...prev,
        error: "Insufficient Funds",
        txStatus: "error",
      }));
      return;
    }

    try {
      setBurner((prev) => ({
        ...prev,
        amount: props.amount,
        recipient: props.recipient,
        sender: props.sender,
        txStatus: "pending",
      }));
      const connection = createConnection();
      const senderPubkey = new PublicKey(props.sender as string);
      const recipientPubkey = new PublicKey(props.recipient as string);
      const lamports = balance * LAMPORTS_PER_SOL;

      if (isNaN(lamports) || lamports <= 0) {
        setBurner((prev) => ({
          ...prev,
          error: "INVALID AMOUNT",
          txStatus: "error",
        }));
        return;
      }

      const tx = new SolanaTransaction().add(
        SystemProgram.transfer({
          fromPubkey: senderPubkey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      const signature = await sendAndConfirmTransaction(connection, tx, [
        Keypair.fromSecretKey(props.signingKey),
      ]);
    } catch (error) {
      console.error(error);
      setBurner((prev) => ({
        ...prev,
        error: `${error}`,
        txStatus: "error",
      }));
    }
  }, [props.recipient]);
}
