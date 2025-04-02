'use client';
import { VencuraSdk } from '@repo/sdk';
import {
  useDynamicContext,
  getAuthToken,
  DynamicWidget,
} from '@dynamic-labs/sdk-react-core';
import { useEffect, useState } from 'react';
import { Button } from '@repo/ui/button';
import { Wallet } from '@repo/api/wallet/entities/wallet.entities';
import { User } from '@repo/api/user/entities/user.entities';
import styles from './wallet.module.css';

const WalletPage = () => {
  const { user: dynamicUserObj } = useDynamicContext();
  const [sdk, setSdk] = useState<VencuraSdk | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [activeWallet, setActiveWallet] = useState<Wallet | null>(null);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [user, setUser] = useState<User | null>(null);

  // Transaction form state
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [signatureResult, setSignatureResult] = useState<{ signature: string; message: string } | null>(null);

  // Add new state for transaction result
  const [transactionResult, setTransactionResult] = useState<{ signature: string; amount: string; recipient: string } | null>(null);

  // Initialize SDK and fetch user data
  useEffect(() => {
    if (dynamicUserObj) {
      const token = getAuthToken();
      if (token) {
        const newSdk = new VencuraSdk(process.env.NEXT_PUBLIC_API_URL!, token);
        setSdk(newSdk);
        if (!user) {
          checkUserExists(newSdk);
        }
      }
    }
  }, [dynamicUserObj]);

  // Fetch wallets and their balances
  useEffect(() => {
    if (sdk && user) {
      fetchWallets();
    }
  }, [sdk, user]);

  const checkUserExists = async (sdkInstance: VencuraSdk) => {
    try {
      const user = await sdkInstance.getUser();
      setUser(user);
    } catch (error) {
      setUser(null);
    }
  };

  const fetchWallets = async () => {
    if (!sdk) return;
    try {
      const userWallets = await sdk.getWallets(user?.id as string);
      console.log('userWallets', userWallets);
      setWallets(userWallets);
      // Fetch balances for each wallet
      const balancePromises = userWallets.map(async (wallet: Wallet) => {
        const walletBalance = await sdk.getWalletBalance(wallet.public_key);
        console.log('walletBalance', walletBalance);
        return { walletId: wallet.public_key, balance: walletBalance.balance };
      });
      const walletBalances = await Promise.all(balancePromises);
      console.log('walletBalances', walletBalances);
      const balanceMap: Record<string, number> = {};
      walletBalances.forEach(({ walletId, balance }) => {
        balanceMap[walletId] = balance;
      });
      console.log('balanceMap', balanceMap);
      setBalances(balanceMap);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  const handleCreateUser = async () => {
    if (!sdk || !dynamicUserObj) return;
    try {
      await sdk.createUser({
        name: dynamicUserObj.alias,
      });
      setUser(user);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleCreateWallet = async () => {
    if (!sdk) return;
    try {
      await sdk.createWallet({
        label: 'My Wallet',
        owner: dynamicUserObj?.userId as string,
      });
      fetchWallets();
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  };

  const handleTransaction = async () => {
    if (!sdk || !activeWallet || !recipient || !amount) return;
    setLoading(true);
    try {
      const result = await sdk.sendTransaction({
        owner: user?.auth_id as string,
        publicKey: activeWallet.public_key,
        to: recipient,
        amount: parseFloat(amount) * 10 ** 9,
      });
      
      // Store transaction result
      setTransactionResult({
        signature: result.signature,
        amount: amount,
        recipient: recipient
      });
      
      setRecipient('');
      setAmount('');
      fetchWallets(); // Refresh balances
    } catch (error) {
      console.error('Error creating transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!sdk || !activeWallet || !message) return;
    setLoading(true);
    try {
      const result = await sdk.signMessage({
        publicKey: activeWallet.public_key,
        message,
        owner: user?.auth_id as string,
      });
      setSignatureResult({
        signature: result.signed_message,
        message: message
      });
      setMessage('');
    } catch (error) {
      console.error('Error signing message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Wallet Dashboard</h1>
            {user && (
              <p className={styles.userEmail}>{dynamicUserObj?.alias}</p>
            )}
          </div>
          <DynamicWidget />
        </div>
      </header>

      <main className={styles.main}>
        {/* User Creation Section */}
        {dynamicUserObj && !user && (
          <div className={styles.welcomeCard}>
            <h2 className={styles.sectionTitle}>Welcome! Let's get started</h2>
            <Button onClick={handleCreateUser} appName="vencura">
              Create User Profile
            </Button>
          </div>
        )}

        {/* Wallet Management Section */}
        {user && (
          <div className={styles.section}>
            {/* Wallet List */}
            <div className={styles.welcomeCard}>
              <div className={styles.walletHeader}>
                <h2 className={styles.sectionTitle}>Your Wallets</h2>
                <div className={styles.walletNewButton}>
                  <Button onClick={handleCreateWallet} appName="vencura">
                    Create New Wallet
                  </Button>
                </div>
              </div>
              <div className={styles.walletGrid}>
                {wallets.map((wallet) => (
                  <div
                    key={wallet.public_key}
                    className={`${styles.walletCard} ${
                      activeWallet?.public_key === wallet.public_key
                        ? styles.walletCardActive
                        : ''
                    }`}
                    onClick={() => setActiveWallet(wallet)}
                  >
                    <div className={styles.walletContent}>
                      <div className={styles.walletInfo}>
                        <p className={styles.walletLabel}>Wallet ID:</p>
                        <p className={styles.walletId}>{wallet.public_key}</p>
                      </div>
                      <div>
                        <p className={styles.walletBalance}>
                          {balances[wallet.public_key]} SOL
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction and Message sections */}
            {activeWallet && (
              <div className={styles.formGrid}>
                <div className={styles.formCard}>
                  <h2 className={styles.sectionTitle}>Send Transaction</h2>
                  <div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Recipient</label>
                      <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className={styles.input}
                        placeholder="Recipient address"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Amount</label>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={styles.input}
                        placeholder="Amount"
                      />
                    </div>
                    <Button onClick={handleTransaction} appName="vencura">
                      {loading ? 'Processing...' : 'Send Transaction'}
                    </Button>

                    {transactionResult && (
                      <div className={styles.signatureResult}>
                        <h3 className={styles.subsectionTitle}>Transaction Result</h3>
                        <div className={styles.resultField}>
                          <label>Amount:</label>
                          <p>{transactionResult.amount} SOL</p>
                        </div>
                        <div className={styles.resultField}>
                          <label>Recipient:</label>
                          <p className={styles.addressText}>{transactionResult.recipient}</p>
                        </div>
                        <div className={styles.resultField}>
                          <label>Transaction Signature:</label>
                          <p className={styles.signatureText}>{transactionResult.signature}</p>
                        </div>
                        <a
                          href={`https://solscan.io/tx/${transactionResult.signature}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.verifyLink}
                        >
                          View transaction on Solscan →
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formCard}>
                  <h2 className={styles.sectionTitle}>Sign Message</h2>
                  <div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Message</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={styles.textarea}
                        placeholder="Enter message to sign"
                      />
                    </div>
                    <Button onClick={handleMessage} appName="vencura">
                      {loading ? 'Signing...' : 'Sign Message'}
                    </Button>

                    {signatureResult && (
                      <div className={styles.signatureResult}>
                        <h3 className={styles.subsectionTitle}>Signature Result</h3>
                        <div className={styles.resultField}>
                          <label>Message:</label>
                          <p>{signatureResult.message}</p>
                        </div>
                        <div className={styles.resultField}>
                          <label>Wallet:</label>
                          <p>{activeWallet.public_key}</p>
                        </div>
                        <div className={styles.resultField}>
                          <label>Signature:</label>
                          <p className={styles.signatureText}>{signatureResult.signature}</p>
                        </div>
                        <a
                          href="https://solscan.io/verifiedsignatures"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.verifyLink}
                        >
                          Verify this signature on Solscan →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default WalletPage;
