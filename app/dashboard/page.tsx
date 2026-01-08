"use client";
import WalletHeader from "@/components/WalletHeader";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { useWallet } from "@lazorkit/wallet";
import React, { useEffect } from "react";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import config from "@/lib/config";
import AddressButton from "@/components/AddressButton";

export default function Dashboard() {
  // Connect app to the Solana Devnet
  const connection = new Connection(
    config?.SOLANA_RPC_URL || "https://api.devnet.solana.com",
    "confirmed"
  );
  const { signAndSendTransaction, isSigning, smartWalletPubkey, isConnected } =
    useWallet();
  const [loadingBalances, setLoadingBalances] = React.useState(false);
  const [recipient, setRecipient] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [solBalance, setSolBalance] = React.useState<number>(0);
  const [usdcBalance, setUsdcBalance] = React.useState<number | null>(null);
  const [txStatus, setTxStatus] = React.useState<"idle" | "success" | "error">(
    "idle"
  );
  const [txError, setTxError] = React.useState<string>("");

  // USDC Mint adddress required to check balances
  const USDC_MINT = new PublicKey(
    "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
  );

  // Fetches the users SOL and USDC balances respectively
  const fetchUserBalances = async () => {
    if (!smartWalletPubkey) {
      return;
    }

    setLoadingBalances(true);

    try {
      const lamports = await connection.getBalance(smartWalletPubkey);
      setSolBalance(lamports / LAMPORTS_PER_SOL);
      try {
        const token_address = await getAssociatedTokenAddress(
          USDC_MINT,
          smartWalletPubkey
        );
        const balance = await connection.getTokenAccountBalance(token_address);
        setUsdcBalance(Number(balance.value.amount));
      } catch (error) {
        setUsdcBalance(0);
      }
    } catch (error) {
      setSolBalance(0);
    }
    setLoadingBalances(false);
  };

  useEffect(() => {
    fetchUserBalances();
  }, [smartWalletPubkey]);

  // Function to handle sending transactions
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

  const fullAddress = smartWalletPubkey?.toString() as string;

  function copyAddressToClipboard() {
    navigator.clipboard.writeText(fullAddress);
  }
  return (
    <div className="min-h-screen bg-white text-black relative ">
      <WalletHeader />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Account Info */}
        <div className="mb-8 pb-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isConnected ? (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              ) : (
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              )}
              <span className="text-sm text-gray-600">
                {" "}
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <AddressButton />
          </div>
        </div>

        {/* Balances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div
            className="border border-gray-300 p-4 cursor-pointer"
            onClick={fetchUserBalances}
          >
            <div className="">
              <div className="text-xs text-gray-500 mb-1">SOL</div>
              <div className="text-lg font-medium">
                {loadingBalances ? (
                  <span className="text-gray-400">--</span>
                ) : (
                  `${solBalance?.toFixed(4) || "0.0000"} SOL`
                )}
              </div>
              <div></div>
            </div>
          </div>
          <div
            className="border border-gray-300 p-4 cursor-pointer relative"
            onClick={fetchUserBalances}
          >
            {/* <div className="absolute top-0 right-0 w-6 h-6 bg-gray-300   "></div> */}
            <div className="text-xs text-gray-500 mb-1">USDC</div>
            <div className="text-lg font-medium">
              {loadingBalances ? (
                <span className="text-gray-400">--</span>
              ) : (
                `${usdcBalance?.toFixed(2) || "0.00"} USDC`
              )}
            </div>
          </div>
        </div>

        {/* Send Form */}
        <div className="border border-gray-200 p-6">
          <div className="mb-6">
            <label
              className="block text-sm text-gray-700 mb-2"
              htmlFor="recipient"
            >
              Recipient Address
            </label>
            <input
              id="recipient"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 text-sm font-mono focus:outline-none focus:border-black"
              placeholder="Enter Solana address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-sm text-gray-700 mb-2"
              htmlFor="amount"
            >
              Amount (SOL)
            </label>
            <span>{txError}</span>
            <input
              id="amount"
              type="number"
              step="0.0001"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <button
            className="w-full py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            onClick={handleTransaction}
            disabled={!recipient || !amount || isSigning || loadingBalances}
          >
            {isSigning ? "Sending..." : "Send ✈️"}
          </button>

          {txStatus === "success" && (
            <div className="mt-4 text-sm text-green-600">
              Transaction successful
            </div>
          )}
          {txStatus === "error" && (
            <div className="mt-4 text-sm text-red-600">
              {txError || "Transaction failed"}
            </div>
          )}
        </div>
        <div className="mt-5 md:grid md:grid-cols-2 grid-rows-1 items-center gap-1">
          <a className="cursor-pointer" href="/guides/creating-wallets">
            <div className="border border-gray-300 py-8 px-3.5 cursor-pointer relative flex mb-1.5">
              <h6 className="">
                Creating{" "}
                <span className="text-purple-500">
                  Passkey-Enabled Wallets{" "}
                </span>
                with Lazorkit
              </h6>
            </div>
          </a>
          <a className="cursor-pointer" href="/guides/triggering-gasless-txns">
            <div className="border border-gray-300 py-8 px-3.5 cursor-pointer relative flex mb-1.5">
              <h6>Triggering Gasless Transactions With Lazorkit</h6>
            </div>
          </a>
          <a className="cursor-pointer" href="/">
            <div className="border border-gray-300 py-8 px-3.5 cursor-pointer relative flex mb-1.5">
              <h6>Introudction to Passkey-Enabled Wallets</h6>
            </div>
          </a>
          <a className="cursor-pointer" href="/">
            <div className="border border-gray-300 py-8 px-3.5 cursor-pointer relative flex mb-1.5">
              <h6>Whats a wallet</h6>
            </div>
          </a>
        </div>
      </div>

      {/* <footer className="absolute md:bottom-0 items-center justify-center w-full md:py-2 bottom-1 border border-gray-300">
                <div className="w-[85%] mx-auto text-center">
                        Powered by <a href="https://lazorkit.com" className="text-purple-500 contrast-125" target="_blank">lazorkit</a>
                </div>
            </footer> */}
    </div>
  );
}
