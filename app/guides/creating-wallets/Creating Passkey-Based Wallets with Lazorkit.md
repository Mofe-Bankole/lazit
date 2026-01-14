## Creating Passkey-Based Wallets with Lazorkit

Many people in the web3 space use seed-phrase wallets such as **Phantom** or **Solflare**. Users with little knowledge of the blockchain have to install this third-party apps in order to send , receive tokens. They might forget to save their seed phrases and might even get tired of the onboarding process

With [Lazorkit](https://lazorkit.com)  developers can create wallets that are **passkey-enabled** and use them in **several** **applications**

Wanna know how ? Then Lets Begin...

**Prerequisites**

Nodejs v20 or later
Visual Studio Code, Zed, Cursor or any IDE of your choice
Chrome Browser (Recommended)

Locate your destination folder (I usually use documents on my PC) and open the terminal there, then paste this command to create a new nextjs app

```
npx create-next-app@latest passkey_build
```

This will create a new nextjs project in that folder upon completion 

##### Install dependencies

```
cd passkey_build
npm install @lazorkit/wallet @solana/web3js @coral-xyz/anchor @solana/spl-token
```

Preferably if using Vscode or any of the recommended IDES, run either 

**For Visual Studio Code:**

```
code passkey_build
```

**Zed**

```
zed passkey_build
```

**Cursor**

```
cursor passkey_build
```

This opens the folder in your preferred IDE
___
Now to the code part

##### Edit app/layout.tsx

Wrapping your app in the Lazorkit Provider is paramount to the apps functionality
simply replace the contents of your layout.tsx with this

```typescript
import { LazorkitProvider } from "@lazorkit/wallet";

export const CONFIG = {
  RPC_URL: "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: {
    paymasterUrl: "https://kora.devnet.lazorkit.com"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} antialiased`}
      >
        <LazorkitProvider rpcUrl={CONFIG.RPC_URL} portalUrl={CONFIG.PORTAL_URL} paymasterConfig={CONFIG.PAYMASTER}>
          {children}
        </LazorkitProvider>
      </body>
    </html>
  );
}
```

##### Adding Wallet Connection Functionality

Connecting wallets in lazorkit is as simple as ever 🚀🚀🚀
You simply call the connect function from the useWallet() hook and then poof you have a passkey-based wallet

Heres a **starter** **component** based on the functionality above, you can create a component named "WalletConnect.tsx" and then call it in your app/page.tsx

```ts
"use client";

import { useWallet } from "@lazorkit/wallet";
  
export default function WalletConnect() {
  const { connect, isConnected, isConnecting, wallet, disconnect } =
    useWallet();
    

  if (isConnected && wallet){
    
    return(
      <div className="min-h-screen flex items-center justify-center w-full">
        <button className="px-6 py-2 rounded-lg bg-slate-800 text-slate-100 cursor-pointer shadow-lg hover:bg-slate-700 transition-colors duration-200 font-medium text-lg" onClick={() => disconnect()}>
          Disconnect
        </button>
     </div>
    )
  }
  else{
    return (
      <div className="min-h-screen flex items-center justify-center w-full">
        <button
          className="px-6 py-2 rounded-lg bg-slate-800 text-slate-100 cursor-pointer shadow-lg hover:bg-slate-700 transition-colors duration-200 font-medium text-lg"
          onClick={() => connect()}
        >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>
    );
  }
}
```

Edit page.tsx
```ts
import WalletConnect from "./WalletConnect"

export default funtion Home(){

	return(
		<div>
			<h5 className="text-green-500 mb-2.5">Press the Button Below to Connect Your Wallet</>
			<WalletConnect/>
		</div>
	);
}
```
For simplicity's sake you can view your newly created wallet address by simply calling the "smartWalletPubkey" from the useWallet() hook

Example Component:
```ts
import { copyToClipboard } from "@/lib/clipboard";
import { useWallet } from "@lazorkit/wallet";

// For simplicitys sake , clicking on this header copies the address to the clipboard
export default function AddressButton(){
  const { smartWalletPubkey } = useWallet();
  const fullAddress = smartWalletPubkey?.toString() as string;

  function copyAddressToClipboard(){
    navigator.clipboard.writeText(fullAddress)
    alert("Address Copied To Clipboard")
  }
  
    return(
		 <span className="text-sm font-mono text-gray-900 border border-0.88 cursor-pointer px-3 py-2" onClick={copyAddressToClipboard}>{smartWalletPubkey?.toString()}</span>
    )
}
```

And there u have it you can now create a **passkey-based wallet**
we can now use this wallet to make transactions 

We can now move to [[Triggering Gasless Transactions Via Lazorkit]]
