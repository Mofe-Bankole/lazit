"use client";
import { JetBrains_Mono } from "next/font/google";


const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export default function CreatingPasskeyEnabledWallets() {
  function copyCode(text: string) {
    navigator.clipboard.writeText(text);
  }
  return (
    <div className="min-h-screen bg-white text-black relative --font-outfit">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <a href="/dashboard"> 👈 Back</a>
        <h2 className="md:text-3xl text-[20.7px] mb-6 mt-1.5">
          Creating Passkey-Based Wallets with Lazorkit
        </h2>
        <p className="mb-1.5">
          Many people in the web3 space use seed-phrase wallets such as{" "}
          <a href="https://phantom.com/" target="_blank">
            <span className="font-semibold text-[#AB9FF2]">Phantom</span>
          </a>{" "}
          or{" "}
          <a href="https://solflare.com/" target="_blank">
            <span className="font-semibold text-[#fff046fb] contrast-less:">
              Solflare
            </span>
          </a>
          . Users with little knowledge of the blockchain have to install this
          third-party apps in order to send , receive tokens. They might forget
          to save their seed phrases and might even get tired of the onboarding
          process
        </p>
        <p>
          With{" "}
          <a
            href="https://lazorkit.com/"
            target="_blank"
            className="text-[#8b79f4]"
          >
            Lazorkit
          </a>{" "}
          developers can create wallets that are passkey-enabled and use them in
          several applications
          <br />
        </p>
        <p className="mt-1.5">Wanna know how ? Then Lets Begin...</p>
        <h3 className="w-full border border-gray-300 my-5"></h3>
        <div className="flex flex-col">
          <h4 className="mb-2 md:text-[19px]">Prerequisites</h4>
          <ul className="space-y-0.5 mb-2">
            <li>
              <a
                href="https://nodejs.org/en"
                target="_blank"
                className="text-green-900"
              >
                Nodejs
              </a>{" "}
              v20 or later
            </li>
            <li>Visual Studio Code, Zed, Cursor or any IDE of your choice</li>
            <li>Chrome Browser (Recommended)</li>
          </ul>
        </div>
        <p className="mb-2">
          Locate your destination folder (I usually use documents on my PC) and
          open the terminal there, then paste this command to create a new
          nextjs app
        </p>
        <div className="bg-[#080807c4] text-white px-3 py-3 rounded-sm mb-2.5">
          <code
            lang="shell code-1"
            className={`${jetbrainsMono.variable} text-sm`}
          >
            npx create-next-app@latest passkey_build
          </code>
        </div>
        <p>
          This will create a new nextjs project in that folder upon completion{" "}
        </p>
        <div className="mt-8">
          <h4 className="mb-3">Install Dependencies : </h4>
          <div className="bg-[#080807c4] text-white px-3 py-3 rounded-sm mb-2.5">
            <code
              lang="shell code-1"
              className={`${jetbrainsMono.variable} text-sm`}
            >
              cd passkey_build
              <br />
              npm install @lazorkit/wallet @solana/web3js @coral-xyz/anchor
              @solana/spl-token
            </code>
          </div>
          <h4>
            Preferably if using Vscode or any of the recommended IDES, run
            either
          </h4>
          <div className="mt-4">
            <h5 className="mb-5">For Visual Studio Code :</h5>
            <div className="bg-[#080807c4] text-white px-3 py-3 rounded-sm mb-2.5">
              <code
                lang="shell code-1"
                className={`${jetbrainsMono.variable} text-sm`}
              >
                code passkey_build
              </code>
            </div>
          </div>
          <div className="mt-4">
            <h5 className="mb-5">For Zed :</h5>
            <div className="bg-[#080807c4] text-white px-3 py-3 rounded-sm mb-2.5">
              <code
                lang="shell code-1"
                className={`${jetbrainsMono.variable} text-sm`}
              >
                zed passkey_build
              </code>
            </div>
          </div>
          <div className="mt-4">
            <h5 className="mb-5">For Cursor :</h5>
            <div className="bg-[#080807c4] text-white px-3 py-3 rounded-sm mb-2.5">
              <code
                lang="shell code-1"
                className={`${jetbrainsMono.variable} text-sm`}
              >
                cursor passkey_build
              </code>
            </div>
          </div>
          <p>This opens the folder in your preferred IDE</p>
          <h3 className="w-full border border-gray-300 my-5"></h3>
          <h6 className="text-2xl mb-2">Edit app/layout.tsx</h6>
          <p className="mb-2.5">
            Wrapping your app in the Lazorkit Provider is paramount to the apps
            functionality simply replace the contents of your layout.tsx with
            this
          </p>
          <div className="bg-[#080807c4] text-white px-3 py-3 rounded-sm mb-2.5">
            <pre className={`${jetbrainsMono.variable} text-sm`}>
              {`"use client";

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
        <body className={\`\${geist.className} antialiased\`}>
          <LazorkitProvider
            rpcUrl={CONFIG.RPC_URL}
            portalUrl={CONFIG.PORTAL_URL}
            paymasterConfig={CONFIG.PAYMASTER}
          >
            {children}
          </LazorkitProvider>
        </body>
      </html>
    );
}
`}
            </pre>
          </div>
          <div>
            <h6 className="text-2xl mb-2">
              Adding Wallet Connection Functionality
            </h6>
            <p className="mb-3">
              Connecting wallets in lazorkit is as simple as ever 🚀🚀🚀
              <br />
              You simply call the connect function from the useWallet() hook and
              then poof you have a passkey-based wallet
            </p>
            <p className="mb-3 font-outfit">
              Heres a starter component based on the functionality above, you
              can create a component named "WalletConnect.tsx" and then call it
              in your app/page.tsx
            </p>
            <div className="bg-[#080807c4] text-white px-3 py-3 rounded-sm mb-2.5">
              <pre
                className={`whitespace-pre overflow-x-auto text-sm ${jetbrainsMono.variable} scroll-smooth`}
              >
                {`"use client";

import { useWallet } from "@lazorkit/wallet";
  
export default function WalletConnect() {
  const { connect, isConnected, isConnecting, wallet, disconnect } = useWallet();

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
`}
              </pre>
            </div>
            <p>
              For simplicity's sake you can view your newly created wallet
              address by simply calling the "smartWalletPubkey" from the
              useWallet() hook <br className="mt-1" />
              Example Component:
            </p>
            <div className="bg-[#080807c4] text-white px-3 py-3 rounded-sm mb-2.5">
            <pre
              className={`whitespace-pre overflow-x-auto text-sm ${jetbrainsMono.variable}`}
            >
              {`
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
              `}
            </pre>
          </div>
          <p className="mb-2.5">And there u have it you can now create a passkey-based wallet
          we can now use this wallet to make transactions</p>
          <p>We can now move to </p>
        </div>
        </div>
      </div>
    </div>
  );
}
