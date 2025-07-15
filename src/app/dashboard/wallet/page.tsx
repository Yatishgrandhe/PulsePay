"use client";

import { useState, useEffect } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Avatar, 
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  LinearProgress
} from "@mui/material";
import {
  AccountBalanceWallet as WalletIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Security as SecurityIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";

interface WalletData {
  id: string;
  wallet_address: string;
  balance: number;
  wallet_type: string;
  is_active: boolean;
}

interface Transaction {
  id: string;
  transaction_hash: string;
  transaction_type: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch wallet
        const { data: walletData } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (walletData) {
          setWallet(walletData);

          // Fetch transactions
          const { data: txData } = await supabase
            .from('wallet_transactions')
            .select('*')
            .eq('wallet_id', walletData.id)
            .order('created_at', { ascending: false })
            .limit(10);

          setTransactions(txData || []);
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSendTransaction = async () => {
    if (!wallet || !sendAmount || !recipientAddress) return;

    try {
      // Here you would integrate with blockchain API
      // For now, we'll simulate a transaction
      const newTransaction = {
        id: Date.now().toString(),
        transaction_hash: `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        transaction_type: 'transfer',
        amount: parseFloat(sendAmount),
        status: 'pending',
        created_at: new Date().toISOString()
      };

      setTransactions([newTransaction, ...transactions]);
      setShowSendDialog(false);
      setSendAmount("");
      setRecipientAddress("");
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <TrendingUpIcon />;
      case 'withdrawal': return <TrendingDownIcon />;
      case 'transfer': return <SendIcon />;
      default: return <WalletIcon />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit': return '#4CAF50';
      case 'withdrawal': return '#F44336';
      case 'transfer': return '#FF9800';
      default: return '#2196F3';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
      </Box>
    );
  }

  if (!wallet) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          No wallet found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Please complete your account setup to create a wallet.
        </Typography>
        <Button variant="contained" href="/account-setup">
          Complete Setup
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            mb: 1,
            background: "linear-gradient(90deg, #E573B7, #7B61FF)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Digital Wallet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your PulsePay digital wallet and transactions.
          </Typography>
        </Box>
      </motion.div>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        {/* Wallet Overview */}
        <Box>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              mb: 3
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ 
                    background: 'linear-gradient(135deg, #E573B7, #7B61FF)',
                    width: 64,
                    height: 64,
                    mr: 3
                  }}>
                    <WalletIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      ${wallet.balance.toFixed(2)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Available Balance
                    </Typography>
                  </Box>
                  <Chip 
                    label={wallet.wallet_type.toUpperCase()} 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Wallet Address
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    background: 'rgba(0,0,0,0.02)', 
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace', 
                        flex: 1,
                        wordBreak: 'break-all'
                      }}
                    >
                      {wallet.wallet_address}
                    </Typography>
                    <IconButton 
                      onClick={() => copyToClipboard(wallet.wallet_address)}
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      {copied ? <CheckCircleIcon color="success" /> : <CopyIcon />}
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => setShowSendDialog(true)}
                    sx={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #E573B7, #7B61FF)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #D563A7, #6B51EF)',
                      }
                    }}
                  >
                    Send
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => setShowReceiveDialog(true)}
                    sx={{ flex: 1 }}
                  >
                    Receive
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Recent Transactions
                </Typography>
                
                {transactions.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {transactions.map((tx, index) => (
                      <Box key={tx.id}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Avatar sx={{ 
                              width: 40, 
                              height: 40,
                              background: getTransactionColor(tx.transaction_type)
                            }}>
                              {getTransactionIcon(tx.transaction_type)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={`$${tx.amount.toFixed(2)}`}
                            secondary={tx.transaction_type.charAt(0).toUpperCase() + tx.transaction_type.slice(1)}
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ fontSize: '0.8rem' }}
                          />
                          <Box sx={{ textAlign: 'right' }}>
                            <Chip 
                              label={tx.status} 
                              size="small"
                              color={tx.status === 'confirmed' ? 'success' : 'warning'}
                            />
                            <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
                              {new Date(tx.created_at).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </ListItem>
                        {index < transactions.length - 1 && (
                          <Divider sx={{ my: 1 }} />
                        )}
                      </Box>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No transactions yet
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Security & Info */}
        <Box>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              mb: 3
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Security
                  </Typography>
                </Box>
                
                <Alert severity="info" sx={{ mb: 2 }}>
                  Your wallet is secured with blockchain technology
                </Alert>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  • Private keys are encrypted and stored securely
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  • All transactions are verified on the blockchain
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  • 24/7 monitoring for suspicious activity
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Quick Stats
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Transactions
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {transactions.length}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Network
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {wallet.wallet_type.toUpperCase()}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip 
                    label={wallet.is_active ? 'Active' : 'Inactive'} 
                    color={wallet.is_active ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>

      {/* Send Transaction Dialog */}
      <Dialog open={showSendDialog} onClose={() => setShowSendDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Transaction</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Recipient Address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            sx={{ mb: 3, mt: 1 }}
            placeholder="0x..."
          />
          <TextField
            fullWidth
            label="Amount (USD)"
            type="number"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            Available: ${wallet.balance.toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSendDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSendTransaction}
            variant="contained"
            disabled={!sendAmount || !recipientAddress || parseFloat(sendAmount) > wallet.balance}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receive Dialog */}
      <Dialog open={showReceiveDialog} onClose={() => setShowReceiveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Receive Funds</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Share this address to receive funds:
          </Typography>
          <Box sx={{ 
            p: 2, 
            background: 'rgba(0,0,0,0.02)', 
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.1)',
            mb: 2
          }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {wallet.wallet_address}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<CopyIcon />}
            onClick={() => copyToClipboard(wallet.wallet_address)}
            fullWidth
          >
            Copy Address
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReceiveDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 