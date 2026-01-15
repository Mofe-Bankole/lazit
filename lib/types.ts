export interface BurnerModalProps {
  owner: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (wallet: BurnerWallet) => void;
}

export type BurnerWalletProps = {
  name: string;
  owner: string;
};

export type BurnerWallet = {
  name: string;
  owner: string;
  publicKey: string;
  secretKey: number[];
  createdAt: number;
  expiresAt: number;
};

export type Subscription = {
  id: string;
  owner: string;
  plan: string;
  status: "active" | "cancelled" | "expired" | "pending";
  amount: number;
  createdAt: number;
  currency: string;
};

export interface Balances {
  sol: number | null;
  usdc: number | null;
  loading: boolean;
  error: string | null;
}

export interface TransactionProps {
  recipient: string | null;
  sender: string | null;
  amount: string | null;
}

export interface BurnerTransferProps {
  recipient: string | null;
  signingKey: Uint8Array;
  sender: string | null;
  amount: string | null;
}

export interface Transaction {
  recipient: string | null;
  sender: string | null;
  amount: string | null;
  error: string | null;
  txStatus: "idle" | "success" | "error" | "pending";
  signature: string | null;
  solscanurl: string | null;
}
