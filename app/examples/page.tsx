import WalletHeader from "@/components/WalletHeader";

export default function Examples() {
    return (
        <div className="min-h-screen bg-white text-black relative ">
            <WalletHeader />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <a href="/dashboard">Back</a>
                <div className="mt-5 grid grid-cols-1 md:gap-2 gap-6">
                    <a className="cursor-pointer" href="/guides/creating-wallets">
                        <div className="border border-gray-300 py-8 px-3.5 cursor-pointer relative flex mb-1.5">
                            <h6 className="">
                                Creating{" "}
                                <span className="text-purple-500">
                                    Passkey-Enabled Wallets
                                </span>
                                {''} with Lazorkit
                            </h6>
                        </div>
                    </a>
                    <a className="cursor-pointer" href="/exmaples/triggering-gasless-txns">
                        <div className="border border-gray-300 py-8 px-3.5 cursor-pointer relative flex mb-1.5">
                            <h6>Triggering Gasless Transactions With Lazorkit</h6>
                        </div>
                    </a>
                    <a className="cursor-pointer" href="/">
                        <div className="border border-gray-300 py-8 px-3.5 cursor-pointer relative flex mb-1.5">
                            <h6>Swap Exchanges with Lazorkit</h6>
                        </div>
                    </a>
                    <a className="cursor-pointer" href="/">
                        <div className="border border-gray-300 py-8 px-3.5 cursor-pointer relative flex mb-1.5">
                            <h6>Whats a wallet</h6>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}
