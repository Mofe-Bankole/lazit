// RPC URL resposnible for allowing us broacast, sacn the Solana chain
// Devnet is used for lazit as at time of writing
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string;

// PORTAL URL
// Required to create wallets via passkeys on lazorkit
const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL;

// PAYMASTER URL
// Allows us to initiate smart, gasless transactions on the Solana chain
// We use Kora as our paymaster
const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL as string;

const config = { SOLANA_RPC_URL, PORTAL_URL, PAYMASTER_URL };
export default config;
