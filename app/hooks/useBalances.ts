'use client'
import React, { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { Balances } from '../../lib/types';
import { createConnection, getBalances } from '../../lib/solana';

export function useBalance(walletAddr: PublicKey | null) {
    const [balance, setBalance] = useState<Balances>({
        sol: null,
        usdc: null,
        loading: false,
        error: null
    });

    // Fetches balances ONLY when called
    const fetchBalances = async () => {
        if (!walletAddr) {
            setBalance(prev => ({
                ...prev,
                error: "Wallet Address Was Not Supplied",
                loading: false
            }));
            return;
        }

        setBalance(prev => ({
            ...prev,
            error: null,
            loading: true
        }));

        try {
            const connection = createConnection();
            const { sol, usdc } = await getBalances(connection, walletAddr);
            setBalance({
                sol,
                usdc,
                loading: false,
                error: null
            });
        } catch (error) {
            setBalance(prev => ({
                ...prev,
                loading: false,
                error: `${error}`
            }));
        }
    };

    return {
        SolBalance: balance.sol,
        UsdcBalance: balance.usdc,
        loading: balance.loading,
        error: balance.error,
        fetchBalances
    };
}

export default useBalance