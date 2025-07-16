-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE payment_type AS ENUM ('regular', 'emergency');
CREATE TYPE emergency_type AS ENUM ('medical', 'dental', 'pharmacy', 'ambulance', 'other');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE transaction_type AS ENUM ('payment', 'deposit', 'withdrawal', 'refund');
CREATE TYPE email_type AS ENUM ('welcome', 'payment_confirmation', 'password_reset', 'alert');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone_number TEXT,
    date_of_birth DATE,
    emergency_contact TEXT,
    kyc_status TEXT DEFAULT 'pending',
    fraud_score INTEGER DEFAULT 0,
    setup_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    wallet_address TEXT UNIQUE,
    balance DECIMAL(20, 8) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL,
    payment_type payment_type NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    currency TEXT DEFAULT 'USD',
    recipient_name TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    recipient_phone TEXT,
    description TEXT,
    emergency_type emergency_type,
    status payment_status DEFAULT 'pending',
    tx_hash TEXT,
    blockchain_network TEXT,
    ai_verification_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE NOT NULL,
    transaction_hash TEXT NOT NULL,
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    status payment_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id TEXT NOT NULL,
    messages JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, session_id)
);

-- Email notifications table
CREATE TABLE IF NOT EXISTS email_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_type email_type NOT NULL,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health tools usage table
CREATE TABLE IF NOT EXISTS health_tools_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tool_name TEXT NOT NULL,
    usage_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fitness routines table
CREATE TABLE IF NOT EXISTS fitness_routines (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    routine_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User images table (stores image URLs, not the actual images)
CREATE TABLE IF NOT EXISTS user_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    image_type TEXT NOT NULL, -- 'profile', 'id_document', 'posture_check', etc.
    image_url TEXT NOT NULL,
    file_name TEXT,
    file_size INTEGER,
    mime_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_user_id ON email_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_user_images_user_id ON user_images(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fitness_routines_updated_at BEFORE UPDATE ON fitness_routines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_tools_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_images ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Wallets policies
CREATE POLICY "Users can view own wallets" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own wallets" ON wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallets" ON wallets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own payments" ON payments FOR UPDATE USING (auth.uid() = user_id);

-- Wallet transactions policies
CREATE POLICY "Users can view own wallet transactions" ON wallet_transactions FOR SELECT USING (
    EXISTS (SELECT 1 FROM wallets WHERE wallets.id = wallet_transactions.wallet_id AND wallets.user_id = auth.uid())
);
CREATE POLICY "Users can insert own wallet transactions" ON wallet_transactions FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM wallets WHERE wallets.id = wallet_transactions.wallet_id AND wallets.user_id = auth.uid())
);

-- Chat sessions policies
CREATE POLICY "Users can view own chat sessions" ON chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own chat sessions" ON chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat sessions" ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Email notifications policies
CREATE POLICY "Users can view own email notifications" ON email_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own email notifications" ON email_notifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Audit logs policies
CREATE POLICY "Users can view own audit logs" ON audit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own audit logs" ON audit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Health tools usage policies
CREATE POLICY "Users can view own health tools usage" ON health_tools_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health tools usage" ON health_tools_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fitness routines policies
CREATE POLICY "Users can view own fitness routines" ON fitness_routines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own fitness routines" ON fitness_routines FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own fitness routines" ON fitness_routines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own fitness routines" ON fitness_routines FOR DELETE USING (auth.uid() = user_id);

-- User images policies
CREATE POLICY "Users can view own images" ON user_images FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own images" ON user_images FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own images" ON user_images FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own images" ON user_images FOR DELETE USING (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create user profile
    INSERT INTO user_profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    
    -- Create default wallet
    INSERT INTO wallets (user_id, wallet_address, balance)
    VALUES (NEW.id, 'wallet_' || NEW.id, 1000.00); -- Starting balance
    
    -- Create audit log
    INSERT INTO audit_logs (user_id, action, resource_type, new_values)
    VALUES (NEW.id, 'user_registered', 'user', jsonb_build_object('email', NEW.email));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to get user dashboard stats
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'totalPayments', COALESCE(payment_stats.total_count, 0),
        'totalAmount', COALESCE(payment_stats.total_amount, 0),
        'walletBalance', COALESCE(wallet_stats.balance, 0),
        'emergencyPayments', COALESCE(payment_stats.emergency_count, 0),
        'recentPayments', COALESCE(recent_payments.payments, '[]'::json)
    ) INTO result
    FROM (
        SELECT 
            COUNT(*) as total_count,
            SUM(amount) as total_amount,
            COUNT(*) FILTER (WHERE payment_type = 'emergency') as emergency_count
        FROM payments 
        WHERE user_id = user_uuid AND status = 'completed'
    ) payment_stats
    CROSS JOIN (
        SELECT COALESCE(balance, 0) as balance
        FROM wallets 
        WHERE user_id = user_uuid AND is_active = true
        LIMIT 1
    ) wallet_stats
    CROSS JOIN (
        SELECT json_agg(
            json_build_object(
                'id', id,
                'amount', amount,
                'payment_type', payment_type,
                'emergency_type', emergency_type,
                'recipient_name', recipient_name,
                'recipient_email', recipient_email,
                'description', description,
                'status', status,
                'tx_hash', tx_hash,
                'created_at', created_at
            )
        ) as payments
        FROM (
            SELECT * FROM payments 
            WHERE user_id = user_uuid 
            ORDER BY created_at DESC 
            LIMIT 5
        ) recent
    ) recent_payments;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 