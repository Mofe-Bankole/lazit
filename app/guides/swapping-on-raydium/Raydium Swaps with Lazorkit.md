This guide assumes you have completed [[Creating Passkey-Based Wallets with Lazorkit]]

As as time of writing , swapping on Raydium devnet is really tricky and sometimes swapping from SOL-USDC might not execute , if so please try swapping from USDC-SOL.
This is an issue with Raydium itself , do not assume it is a code issue/bug.
Developers at Raydium are working on this and trying their best to iron it out.

**Prerequisites**

Nodejs v20 or later
Visual Studio Code, Zed, Cursor or any IDE of your choice
Chrome Browser (Recommended)
Basic Knowledge of Raydium
Devnet SOL and USDC (visit faucet.solana.com and faucet.circle.com respectively)


```
SWAP FLOW

-----------         --------------------        -------------------------
|   UI     | -----> ¦ Raydium Trade API ¦ ----> | BUILD TXN / GET QUOTES |
| (Nextjs) |        |    (Trade API)    |       |   (Legace Txn build)   |
-----------          --------------------        -------------------------
															|
															|
															|
															|
															|
															|
															|
															|
															|
															|
															|
															▼ 
						--------------------------------------------------------
						| Lazorkit signs the transactions and pays all gas fees |
						|                   (Lazorkit + Kora)                   |
						--------------------------------------------------------
```
															
----
Edit app/page.tsx or any given file 
###### 1.In your Nextjs app / Project Folder install the raydium SDK

```shell
npm i @raydium-io/raydium-sdk-v2
```
###### 2.Declare a token array containing info about swappable tokens

```typescript
// Pls note that this are all devnet addresses
const TOKENS = {
    SOL: {
        symbol: 'SOL',
        name: 'Solana',
        mint: 'So11111111111111111111111111111111111111112',
        decimals: 9,
    },
    USDC: {
        symbol: 'USDC',
        name: 'USD Coin',
        mint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
        decimals: 6,
    },
};
```

###### 3. Import required libraries

```ts
"use client"
import { DEV_API_URLS } from '@raydium-io/raydium-sdk-v2';
import { Connection, PublicKey, Transaction, useWallet } from "@lazorkit/wallet"
import React, { useState } from "react"
import axios from "axios";
import useBalance from "@/hooks/useBalances";


// useBalance hook can be found in app/hooks/useBalance.ts 
```
###### 4. Declare state for swapping , the two pairs in this guide are SOL and USDC

```ts
 const { smartWalletPubkey, isConnected , signAndSendTransaction
    } = useWallet()
    const [swapping, setSwapping] = useState(false);
    const [swapToken, setSwapToken] = useState<"SOL" | "USDC">("SOL");
    const [outputToken, setOutputToken] = useState<"SOL" | "USDC">("USDC");
    const [inputAmount, setInputAmount] = useState('');
    const [outputAmount, setOutputAmount] = useState('');
    const [quoteSuccess, setQuoteSuccess] = useState(false)
    const [error, setError] = useState("");
    const [quote, setQuote] = useState<any>(null)
    const [swapStatus, setSwapStatus] = useState<"idle" | "success" | "error">("idle");
```

###### 5.Compute the Swap Amount

```ts
  const compueOutputAmount = async () => {
        // CHekcs some params
        if (!smartWalletPubkey || isConnected == false || !inputAmount || parseFloat(inputAmount) <= 0) {
            setError("Multiple Variables Unset")
            setOutputAmount('')
            return
        }
        
        setError('')

        try {
            const inputMint = TOKENS[swapToken].mint;
            const outputMint = TOKENS[outputToken].mint;
            const swapAmount = parseFloat(inputAmount) * Math.pow(10, TOKENS[swapToken].decimals);
            const quoteResponse = await axios.get(
                `${DEV_API_URLS.SWAP_HOST}/compute/swap-base-in?` +
                `inputMint=${inputMint}&` +
                `outputMint=${outputMint}&` +
                `amount=${Math.floor(swapAmount)}&` +
                `slippageBps=50&` +
                `txVersion=LEGACY`
            );

			// Do this to view the response
            console.log(quoteResponse.data)  

            if (!quoteResponse.data) {
                setQuoteSuccess(false)
                setError("Failed to Get Quote")
                setQuote(null);
                setSwapStatus("error")
                return;
            }

            const rawOutputAmount = parseFloat(quoteResponse.data.outputAmount)
            const formattedOutput = (rawOutputAmount / Math.pow(10, TOKENS[outputToken].decimals)).toFixed(6);
            setOutputAmount(formattedOutput);
        } catch (error) {
            console.error(error)
            setError(`${error}`)
        }
    }
```

###### 6.Execute the Swap

```ts
 const executeSwap = async () => {
        if (!quote || !quoteSuccess) {
            setError("Error Fetching Quotes");
            return;
        }

        if (!inputAmount) {
            setError("Amount Not Set");
            return
        }
        setSwapping(true);
        setError("");
        setSwapStatus("idle")

        try {
            const inputMint = TOKENS[swapToken as keyof typeof TOKENS].mint;
            const outputMint = TOKENS[outputToken as keyof typeof TOKENS].mint;
            // const swapAmount = parseFloat(inputAmount) * Math.pow(10, TOKENS[swapToken as keyof typeof TOKENS].decimals);

            // fetch the swap from raydium
            const { data: swapResponse } = await axios.get(`${DEV_API_URLS.SWAP_HOST}/compute/swap-base-in?...&txVersion=LEGACY`)

            const { data: swapData } = await axios.post(`${DEV_API_URLS.SWAP_HOST}/transaction/swap-base-in`, {
                swapResponse,
                TxVersion: "LEGACY",
                wallet: smartWalletPubkey?.toString(),
                wrapSol: inputMint === TOKENS.SOL.mint,
                unwrapSol: outputMint === TOKENS.SOL.mint,
            })

            const transactionBuffer = Buffer.from(swapData.data[0].transaction, 'base64');
            const legacyTx = Transaction.from(transactionBuffer);
	           
	        
            // got this fix from Codex on X
            // LazorKit manages compute budget automatically so to remidiate this filter out ComputeBudget instructions from the transaction.
            const COMPUTE_BUDGET_PROGRAM = new PublicKey('ComputeBudget111111111111111111111111111111');
            const instructions = legacyTx.instructions.filter(
                ix => !ix.programId.equals(COMPUTE_BUDGET_PROGRAM)
            );

            instructions.forEach((ix) => {
                const hasSmartWallet = ix.keys.some(k => k.pubkey.toBase58() === smartWalletPubkey?.toString());
                if (!hasSmartWallet) {
                    ix.keys.push({ pubkey: smartWalletPubkey as PublicKey, isSigner: false, isWritable: false });
                }
            });


            const signature = await signAndSendTransaction({
                instructions,
                transactionOptions: { computeUnitLimit: 600_000 }
            });
            console.log(signature)
        } catch (error : any) {
            console.error(error)
            alert(`Swap Unsuccessful : ${error}`)
        }
    }
```

###### 7. Create a component for swapping that utilizes all the above functions

```ts
 <form className="md:w-1/2 py-3 px-4 border border-gray-300 w-full mx-auto space-y-6 rounded-sm"
                            onSubmit={e => {
                                e.preventDefault();
                            }}
                        >
                            <div className="mb-6">
                                <SwapBalances pubkey={smartWalletPubkey as PublicKey} />
                                <label
                                    className="block text-sm text-gray-700 mb-2"
                                    htmlFor="swap-amount"
                                >
                                    Amount in {swapToken}
                                </label>
                                <input
                                    id="swap-amount"
                                    type="number"
                                    step="0.0001"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
                                    placeholder="0.00"
                                    value={inputAmount}
                                    onChange={e => {
                                        setInputAmount(e.target.value);
                                        setError("");
                                    }}
                                    onBlur={compueOutputAmount}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-6">
                                <button
                                    className={`px-8 py-1.5 rounded-sm cursor-pointer focus:outline-none ${swapToken === "SOL" ? "bg-black text-white" : "bg-white border border-gray-300 text-black"}`}
                                    type="button"
                                    onClick={setSOL}
                                >
                                    SOL
                                </button>
                                <button
                                    className={`px-8 py-1.5 rounded-sm cursor-pointer ${swapToken === "USDC" ? "bg-black text-white" : "bg-white border border-gray-300 text-black"} focus:outline-none`}
                                    type="button"
                                    onClick={setUSDC}
                                >
                                    USDC
                                </button>
                            </div>
                            <h6 className="text-center">Swap {swapToken} for {outputToken}</h6>
                            {
                                outputAmount && (
                                    <div className="text-center mb-2">
                                        <p className="text-sm">
                                            You will get: <span className="font-mono">{outputAmount} {outputToken}</span>
                                        </p>
                                    </div>
                                )
                            }
                            {
                                error && <div className="text-red-500 text-sm text-center">{error}</div>
                            }
                            <button
                                className="w-full py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                                type="submit"
                                onClick={executeSwap}
                                disabled={!inputAmount || swapping || !isConnected}
                           >
                                {swapping ? "Swapping..." : "Swap"}
                            </button>
                        </form>
```


Common Problems

<li>Swapping on Raydium devent has a low success rate and as such tends be unable to work with. If a pair doesnt work (e.g SOL-USDC) try another pair (eg USDC-SOL)