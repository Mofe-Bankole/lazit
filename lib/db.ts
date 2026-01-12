// lib/db.ts
import type { BurnerWallet } from './burner';

export type Subscription = {
  id: string;
  owner: string; 
  plan: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  amount: number;
  createdAt : number;
  currency: string;
};

// In-memory stores
class LazitDB {
  private burnerWallets: Map<string, BurnerWallet> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();
  private userSubscriptions: Map<string, string[]> = new Map(); // userId -> subscriptionIds[]

  // Burner Wallet methods
  createBurnerWallet(wallet: BurnerWallet) {
    const expiresAt = wallet.expiresAt;
    
    const walletData = {
      ...wallet,
      createdAt: wallet.createdAt,
      expiresAt,
    };
    

    this.burnerWallets.set(wallet.publicKey, walletData);
    return walletData;
  }

  getBurnerWallet(publicKey: string) {
    const wallet = this.burnerWallets.get(publicKey);
    if (!wallet) return null;
    
    // Check if expired
    if (Date.now() > wallet.expiresAt) {
      this.burnerWallets.delete(publicKey);
      return null;
    }
    
    return wallet;
  }

  getAllBurnerWallets() {
    const now = Date.now();
    const validWallets: typeof this.burnerWallets = new Map();
    
    // Clean up expired wallets and return valid ones
    for (const [key, wallet] of this.burnerWallets.entries()) {
      if (now > wallet.expiresAt) {
        this.burnerWallets.delete(key);
      } else {
        validWallets.set(key, wallet);
      }
    }
    
    return Array.from(validWallets.values());
  }

  deleteBurnerWallet(publicKey: string) {
    return this.burnerWallets.delete(publicKey);
  }

  // Subscription methods
  createSubscription(subscription: Omit<Subscription, 'id' | 'createdAt'>) {
    const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    
    const sub: Subscription = {
      ...subscription,
      id,
      createdAt: now,
    };
    
    this.subscriptions.set(id, sub);
    
    // Track user subscriptions
    const userSubs = this.userSubscriptions.get(subscription.owner) || [];
    userSubs.push(id);
    this.userSubscriptions.set(subscription.owner, userSubs);
    
    return sub;
  }

  getSubscription(id: string) {
    return this.subscriptions.get(id) || null;
  }

  getUserSubscriptions(userId: string) {
    const subIds = this.userSubscriptions.get(userId) || [];
    return subIds
      .map(id => this.subscriptions.get(id))
      .filter((sub): sub is Subscription => sub !== undefined);
  }

  updateSubscription(id: string, updates: Partial<Subscription>) {
    const sub = this.subscriptions.get(id);
    if (!sub) return null;
    
    const updated = { ...sub, ...updates };
    this.subscriptions.set(id, updated);
    return updated;
  }

  deleteSubscription(id: string) {
    const sub = this.subscriptions.get(id);
    if (!sub) return false;
    
    this.subscriptions.delete(id);
    
    // Remove from user's subscription list
    const userSubs = this.userSubscriptions.get(sub.owner) || [];
    const index = userSubs.indexOf(id);
    if (index > -1) {
      userSubs.splice(index, 1);
      this.userSubscriptions.set(sub.owner, userSubs);
    }
    
    return true;
  }

  getAllSubscriptions() {
    return Array.from(this.subscriptions.values());
  }
}


export const db = new LazitDB();