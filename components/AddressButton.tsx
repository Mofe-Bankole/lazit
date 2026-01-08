import { copyToClipboard } from "@/lib/clipboard";
import { useWallet } from "@lazorkit/wallet";

// For simplicitys sake , clicking on this header copies the address to the clipboard
export default function AddressButton(){
  const { smartWalletPubkey } = useWallet();
  const fullAddress = smartWalletPubkey?.toString() as string;

  function copyAddressToClipboard(){
    copyToClipboard(fullAddress)
    alert("Address Copied To Clipboard")
  }

    return(
        <span className="text-sm font-mono text-gray-900 border-0.88 cursor-pointer border px-3 py-2" onClick={copyAddressToClipboard}>{smartWalletPubkey?.toString().slice(0,4)}........{smartWalletPubkey?.toString().slice(-4)}</span>
    )
}