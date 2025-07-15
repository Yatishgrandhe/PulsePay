"use client";

import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  Button, 
  Chip, 
  Rating, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Avatar,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AccountBalance, 
  Phone, 
  Email, 
  Language, 
  Search, 
  Verified,
  TrendingUp,
  Shield,
  Payment,
  Business,
  LocationOn,
  Speed,
  Security,
  Support
} from '@mui/icons-material';
import Navigation from '@/components/Navigation';
import ThemeProvider from '@/components/ThemeProvider';

const HeroSection = styled(Box)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '120px 0 80px',
  color: 'white',
  textAlign: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 1000 1000\\"><polygon fill=\\"rgba(255,255,255,0.05)\\" points=\\"0,1000 1000,0 1000,1000\\"/></svg>")',
    backgroundSize: 'cover',
  }
});

const BankCard = styled(Card)({
  height: '100%',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(123, 97, 255, 0.1)',
  borderRadius: 20,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(123, 97, 255, 0.2)',
  }
});

const PartnershipCard = styled(Card)({
  background: 'linear-gradient(135deg, rgba(123, 97, 255, 0.1) 0%, rgba(229, 115, 183, 0.1) 100%)',
  border: '1px solid rgba(123, 97, 255, 0.2)',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 12px 32px rgba(123, 97, 255, 0.15)',
  }
});

// Fake bank data
const banks = [
  {
    id: 1,
    name: "Chase Bank",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
    phone: "+1 (800) 935-9935",
    email: "partnerships@chase.com",
    website: "https://www.chase.com",
    rating: 4.7,
    partnershipLevel: "Platinum",
    services: ["Digital Banking", "Mobile Payments", "International Transfers", "Business Banking"],
    benefits: ["Instant Transfers", "24/7 Support", "Fraud Protection", "Competitive Rates"],
    description: "Leading financial institution with extensive digital banking capabilities and global reach.",
    headquarters: "New York, NY",
    founded: 1799,
    customers: "50M+",
    assets: "$3.7T"
  },
  {
    id: 2,
    name: "Bank of America",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
    phone: "+1 (800) 432-1000",
    email: "partnerships@bankofamerica.com",
    website: "https://www.bankofamerica.com",
    rating: 4.5,
    partnershipLevel: "Gold",
    services: ["Online Banking", "Mobile App", "Investment Services", "Credit Cards"],
    benefits: ["Real-time Processing", "Advanced Security", "Multi-currency Support", "Business Solutions"],
    description: "Comprehensive banking solutions with strong focus on digital innovation and customer service.",
    headquarters: "Charlotte, NC",
    founded: 1904,
    customers: "66M+",
    assets: "$2.4T"
  },
  {
    id: 3,
    name: "Wells Fargo",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
    phone: "+1 (800) 869-3557",
    email: "partnerships@wellsfargo.com",
    website: "https://www.wellsfargo.com",
    rating: 4.3,
    partnershipLevel: "Silver",
    services: ["Personal Banking", "Business Banking", "Wealth Management", "Insurance"],
    benefits: ["Secure Transactions", "Mobile Banking", "Customer Support", "Financial Planning"],
    description: "Trusted financial partner with comprehensive banking and investment services.",
    headquarters: "San Francisco, CA",
    founded: 1852,
    customers: "70M+",
    assets: "$1.9T"
  },
  {
    id: 4,
    name: "Citibank",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
    phone: "+1 (800) 374-9700",
    email: "partnerships@citi.com",
    website: "https://www.citi.com",
    rating: 4.6,
    partnershipLevel: "Platinum",
    services: ["Global Banking", "Investment Banking", "Credit Cards", "Wealth Management"],
    benefits: ["Global Network", "Premium Services", "Investment Options", "International Banking"],
    description: "Global banking leader with extensive international presence and premium financial services.",
    headquarters: "New York, NY",
    founded: 1812,
    customers: "200M+",
    assets: "$2.3T"
  },
  {
    id: 5,
    name: "Capital One",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
    phone: "+1 (800) 227-4825",
    email: "partnerships@capitalone.com",
    website: "https://www.capitalone.com",
    rating: 4.4,
    partnershipLevel: "Gold",
    services: ["Digital Banking", "Credit Cards", "Auto Loans", "Business Banking"],
    benefits: ["Digital-First", "Innovative Products", "Competitive Rates", "Customer Experience"],
    description: "Technology-driven bank focused on digital innovation and customer-centric financial products.",
    headquarters: "McLean, VA",
    founded: 1994,
    customers: "100M+",
    assets: "$471B"
  }
];

const partnershipBenefits = [
  {
    title: "Instant Payment Processing",
    description: "Real-time payment processing with blockchain verification for immediate confirmation.",
    icon: <Speed sx={{ fontSize: 32, color: '#7B61FF' }} />
  },
  {
    title: "Enhanced Security",
    description: "Multi-layer security protocols including AI fraud detection and blockchain immutability.",
    icon: <Security sx={{ fontSize: 32, color: '#E573B7' }} />
  },
  {
    title: "Global Network",
    description: "Access to our extensive network of partner hospitals and healthcare providers worldwide.",
    icon: <Business sx={{ fontSize: 32, color: '#FFD166' }} />
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock technical support and customer service for all partnership needs.",
    icon: <Support sx={{ fontSize: 32, color: '#4CAF50' }} />
  }
];

export default function BanksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBank, setSelectedBank] = useState<typeof banks[number] | null>(null);

  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.partnershipLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.services.some(service => 
      service.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleBankClick = (bank: typeof banks[number]) => {
    setSelectedBank(bank);
  };

  const handleCloseDialog = () => {
    setSelectedBank(null);
  };

  const getPartnershipLevelColor = (level: string) => {
    switch (level) {
      case 'Platinum': return '#E5E4E2';
      case 'Gold': return '#FFD700';
      case 'Silver': return '#C0C0C0';
      default: return '#7B61FF';
    }
  };

  return (
    <ThemeProvider>
      <Box>
        <Navigation />
        
        {/* Hero Section */}
        <HeroSection>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h1" 
                fontWeight={800}
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
              >
                Partner Banks
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4,
                  maxWidth: 800,
                  mx: 'auto',
                  opacity: 0.9,
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  lineHeight: 1.6,
                  fontSize: '1.2rem'
                }}
              >
                Trusted financial institutions powering PulsePay&apos;s secure payment network. 
                Our partner banks ensure fast, reliable, and secure transactions.
              </Typography>
            </motion.div>
          </Container>
        </HeroSection>

        {/* Partnership Benefits */}
        <Box sx={{ py: 8, background: '#f8f9ff' }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h2" 
                fontWeight={700}
                textAlign="center"
                sx={{ mb: 6, color: '#232946' }}
              >
                Partnership Benefits
              </Typography>
            </motion.div>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
              {partnershipBenefits.map((benefit, index) => (
                <Box key={benefit.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <PartnershipCard>
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box sx={{ mb: 3 }}>
                          {benefit.icon}
                        </Box>
                        <Typography 
                          variant="h6" 
                          fontWeight={600}
                          sx={{ mb: 2, color: '#232946' }}
                        >
                          {benefit.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ color: '#666', lineHeight: 1.6 }}
                        >
                          {benefit.description}
                        </Typography>
                      </CardContent>
                    </PartnershipCard>
                  </motion.div>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Banks Section */}
        <Box sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {/* Search and Filters */}
              <Box sx={{ width: { xs: '100%', md: '33.333%' }, px: 1 }}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Find Partner Banks
                    </Typography>
                    
                    <TextField
                      fullWidth
                      placeholder="Search banks, services, or partnership level..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                      sx={{ mb: 3 }}
                    />

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                        Partnership Levels:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {['Platinum', 'Gold', 'Silver'].map((level) => (
                          <Chip
                            key={level}
                            label={level}
                            size="small"
                            sx={{
                              background: getPartnershipLevelColor(level),
                              color: level === 'Gold' ? '#000' : '#fff',
                              fontWeight: 600
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Paper>

                  {/* Bank List */}
                  <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
                    <AnimatePresence>
                      {filteredBanks.map((bank, index) => (
                        <motion.div
                          key={bank.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <BankCard 
                            onClick={() => handleBankClick(bank)}
                            sx={{ mb: 2 }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar 
                                  src={bank.logo} 
                                  sx={{ width: 50, height: 50, mr: 2 }}
                                >
                                  <AccountBalance />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h6" fontWeight={600} sx={{ color: '#232946' }}>
                                    {bank.name}
                                  </Typography>
                                  <Chip
                                    label={bank.partnershipLevel}
                                    size="small"
                                    sx={{
                                      background: getPartnershipLevelColor(bank.partnershipLevel),
                                      color: bank.partnershipLevel === 'Gold' ? '#000' : '#fff',
                                      fontWeight: 600,
                                      mt: 0.5
                                    }}
                                  />
                                </Box>
                                <Rating value={bank.rating} readOnly size="small" />
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <LocationOn sx={{ fontSize: 16, color: '#7B61FF', mr: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {bank.headquarters}
                                </Typography>
                              </Box>

                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {bank.services.slice(0, 2).map((service) => (
                                  <Chip
                                    key={service}
                                    label={service}
                                    size="small"
                                    sx={{
                                      background: 'rgba(123, 97, 255, 0.1)',
                                      color: '#7B61FF',
                                      fontSize: '0.75rem'
                                    }}
                                  />
                                ))}
                              </Box>
                            </CardContent>
                          </BankCard>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </Box>
                </motion.div>
              </Box>

              {/* Partnership Info */}
              <Box sx={{ width: { xs: '100%', md: '66.666%' }, px: 1 }}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
                    <Typography variant="h4" fontWeight={700} sx={{ mb: 3, color: '#232946' }}>
                      Why Partner with PulsePay?
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Verified sx={{ color: '#4CAF50', mr: 2 }} />
                          <Typography variant="h6" fontWeight={600}>
                            Verified Transactions
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          All transactions are verified through blockchain technology, ensuring transparency and security.
                        </Typography>
                      </Box>
                      
                      <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TrendingUp sx={{ color: '#FFD166', mr: 2 }} />
                          <Typography variant="h6" fontWeight={600}>
                            Growing Market
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Access to the rapidly growing emergency healthcare payment market with expanding global reach.
                        </Typography>
                      </Box>
                      
                      <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Shield sx={{ color: '#E573B7', mr: 2 }} />
                          <Typography variant="h6" fontWeight={600}>
                            Risk Mitigation
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Advanced AI-powered fraud detection and risk assessment for all transactions.
                        </Typography>
                      </Box>
                      
                      <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Payment sx={{ color: '#7B61FF', mr: 2 }} />
                          <Typography variant="h6" fontWeight={600}>
                            Instant Settlements
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Real-time payment processing with immediate settlement and confirmation.
                        </Typography>
                      </Box>
                    </Grid>
                  </Paper>

                  <Paper sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(135deg, rgba(123, 97, 255, 0.1) 0%, rgba(229, 115, 183, 0.1) 100%)' }}>
                    <Typography variant="h5" fontWeight={600} sx={{ mb: 3, color: '#232946' }}>
                      Partnership Statistics
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Box sx={{ width: { xs: '50%', md: '25%' }, px: 1, mb: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" fontWeight={700} sx={{ color: '#7B61FF' }}>
                            5
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Partner Banks
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ width: { xs: '50%', md: '25%' }, px: 1, mb: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" fontWeight={700} sx={{ color: '#E573B7' }}>
                            500+
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Partner Hospitals
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ width: { xs: '50%', md: '25%' }, px: 1, mb: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" fontWeight={700} sx={{ color: '#FFD166' }}>
                            50+
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Countries
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ width: { xs: '50%', md: '25%' }, px: 1, mb: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" fontWeight={700} sx={{ color: '#4CAF50' }}>
                            99.9%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Uptime
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Paper>
                </motion.div>
              </Box>
            </Grid>
          </Container>
        </Box>

        {/* Bank Details Dialog */}
        <Dialog
          open={!!selectedBank}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          {selectedBank && (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={selectedBank.logo} 
                    sx={{ width: 60, height: 60, mr: 2 }}
                  >
                    <AccountBalance />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      {selectedBank.name}
                    </Typography>
                    <Chip
                      label={selectedBank.partnershipLevel}
                      sx={{
                        background: getPartnershipLevelColor(selectedBank.partnershipLevel),
                        color: selectedBank.partnershipLevel === 'Gold' ? '#000' : '#fff',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Box>
              </DialogTitle>
              
              <DialogContent>
                <Grid container spacing={3}>
                  <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 3 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Contact Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <Phone sx={{ color: '#7B61FF' }} />
                        </ListItemIcon>
                        <ListItemText primary={selectedBank.phone} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Email sx={{ color: '#7B61FF' }} />
                        </ListItemIcon>
                        <ListItemText primary={selectedBank.email} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Language sx={{ color: '#7B61FF' }} />
                        </ListItemIcon>
                        <ListItemText primary={selectedBank.website} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <LocationOn sx={{ color: '#7B61FF' }} />
                        </ListItemIcon>
                        <ListItemText primary={selectedBank.headquarters} />
                      </ListItem>
                    </List>
                  </Box>
                  
                  <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 3 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Bank Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Founded" 
                          secondary={selectedBank.founded}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Customers" 
                          secondary={selectedBank.customers}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Assets" 
                          secondary={selectedBank.assets}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Rating" 
                          secondary={
                            <Rating value={selectedBank.rating} readOnly size="small" />
                          }
                        />
                      </ListItem>
                    </List>
                  </Box>
                  
                  <Box sx={{ width: '100%', px: 1, mb: 3 }}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Services & Benefits
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                          Services:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selectedBank.services.map((service) => (
                            <Chip
                              key={service}
                              label={service}
                              size="small"
                              sx={{
                                background: 'rgba(123, 97, 255, 0.1)',
                                color: '#7B61FF'
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                      
                      <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                          Benefits:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selectedBank.benefits.map((benefit) => (
                            <Chip
                              key={benefit}
                              label={benefit}
                              size="small"
                              variant="outlined"
                              sx={{ borderColor: '#E573B7', color: '#E573B7' }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: '100%', px: 1 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Description
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {selectedBank.description}
                    </Typography>
                  </Box>
                </Grid>
              </DialogContent>
              
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleCloseDialog}>
                  Close
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Business />}
                  onClick={() => window.open(selectedBank.website, '_blank')}
                  sx={{
                    background: 'linear-gradient(45deg, #7B61FF, #E573B7)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #6B51EF, #D563A7)',
                    }
                  }}
                >
                  Visit Website
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}