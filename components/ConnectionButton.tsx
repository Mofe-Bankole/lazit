import { useWallet } from "@lazorkit/wallet";

// Main UI component
// Toggles connection status
export default function DisconnectButton(){
  const {wallet ,connect, smartWalletPubkey, disconnect, isConnected} = useWallet();
  const fullAddress = smartWalletPubkey?.toString() as string;
  function copyAddressToClipboard(){
    navigator.clipboard.writeText(fullAddress)
}

async function toggleConnection(){
    if (isConnected){
        await disconnect();
    }else{
        await connect()
    }
}
    return(
        <span className={`text-sm border-058 cursor-pointer border px-3 py-2 inset-0 duration-750 ${isConnected ? "text-red-500" : "text-green-600" }`} onClick={toggleConnection} >{isConnected ? "Disconnect" : "Connect"}</span>
    )
}