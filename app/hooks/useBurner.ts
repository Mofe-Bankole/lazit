import { useWallet } from "@lazorkit/wallet";
import { BurnerTransferProps, BurnerTransaction } from "../../lib/types";
import useBalance from "./useBalances";
import { useCallback, useState } from "react";
import {
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction as SolanaTransaction,
  sendAndConfirmTransaction,
  Keypair,
  PublicKey
} from "@solana/web3.js";
import { createConnection } from "../../lib/solana";

export function useBurner(props: BurnerTransferProps) {
  const { SolBalance } = useBalance(
    props.sender
  );

  const [burner, setBurner] = useState<BurnerTransaction>({
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
        sender: props.sender as PublicKey,
        txStatus: "pending",
      }));

      const connection = createConnection();
      const senderPubkey = props.sender;
      const recipientPubkey = new PublicKey(props.recipient as string);
      const lamports = parseFloat(props.amount as string) *LAMPORTS_PER_SOL;

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

      const keypair = Keypair.fromSecretKey( Uint8Array.from(props.signingKey))

      const signature = await sendAndConfirmTransaction(connection, tx, [
        keypair
      ]);

      const solscanurl = `https://solscan.io/tx/${signature}?cluster=devnet`;
      
      setBurner({
        recipient : props.recipient,
        sender : props.sender,
        amount : props.amount,
        txStatus : "success",
        solscanurl,
        signature,
        error : null
      })
    } catch (error) {
      console.error(`Theres an error : ${error}`);
      setBurner((prev) => ({
        ...prev,
        error: `${error}`,
        txStatus: "error",
      }));
    }
  }, [props.recipient , props.amount , props.sender , props.signingKey]);

  return{
    recipient : burner.recipient,
    explorerURL : burner.solscanurl,
    signature : burner.signature,
    error : burner.error,
    amount : burner.amount,
    status : burner.txStatus,
    handleBurnerSweep,
  }
}
