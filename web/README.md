# PulsePay - AI-Powered Emergency Payment Platform

PulsePay is a modern, AI-powered emergency payment platform designed for health crises. It enables instant, secure, and verifiable payments during emergencies, leveraging blockchain, AI, and modern authentication.

![PulsePay Logo](public/image.png)

## 🚀 Features

### Core Features
- **Instant Emergency Payments**: Process payments in under 30 seconds
- **AI-Powered Security**: Advanced fraud detection and identity verification
- **Blockchain Integration**: Secure, transparent payment processing
- **Global Hospital Network**: Partner hospitals worldwide
- **Real-time Monitoring**: Live payment tracking and status updates

### Admin Features
- **User Management**: Complete user administration and verification
- **Payment Monitoring**: Real-time transaction tracking
- **Fraud Detection**: AI-powered risk assessment and alerts
- **System Settings**: Configurable security and payment limits
- **Audit Logging**: Complete system activity tracking

### User Features
- **Secure Authentication**: Email/password and magic link login
- **Payment History**: Complete transaction records
- **Profile Management**: User settings and preferences
- **Emergency Contacts**: Quick access to important contacts

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Material-UI** - Modern UI components
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Utility-first styling

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security (RLS)** - Database-level security
- **Real-time subscriptions** - Live data updates

### External Integrations
- **OpenAI API** - AI-powered text analysis and fraud detection
- **Telesign** - Device and phone verification
- **IDAnalyzer** - Global ID verification
- **Blockchain** - Payment processing (Base/Polygon testnets)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- (Optional) External API keys

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PulsePay/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL script from `supabase-setup.sql`
   - Follow the [Admin Setup Guide](ADMIN_SETUP.md)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Automatic Setup
1. Copy the contents of `supabase-setup.sql`
2. Go to your Supabase dashboard → SQL Editor
3. Paste and execute the entire script
4. Verify all tables are created in the Table Editor

### Manual Verification
Check that these tables exist:
- `users` - User profiles and roles
- `payments` - Payment transactions
- `hospitals` - Partner hospitals
- `banks` - Partner banks
- `fraud_checks` - Fraud detection records
- `id_verifications` - ID verification records
- `audit_logs` - System audit trail
- `email_templates` - Email templates
- `admin_settings` - System configuration

## 👤 Admin Access

### Default Admin Account
- **Email**: `admin@pulsepay.com`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials immediately after setup!

### Admin Dashboard
Access the admin dashboard at `/admin` with admin credentials.

**Features**:
- User management and verification
- Payment monitoring and analytics
- Fraud detection monitoring
- System settings configuration
- Real-time statistics

## 🎨 Design System

### Color Palette
- **Primary**: Pink (#E573B7) → Purple (#7B61FF) → Gold (#FFD166)
- **Accent**: White (#FFFFFF), Deep Blue (#232946)
- **Background**: Light Blue (#f8f9ff)

### Typography
- **Headings**: Inter, Montserrat, Poppins (bold)
- **Body**: Inter, Roboto (regular)

### Components
- **AnimatedLogo**: Heartbeat pulse animation
- **Navigation**: Responsive navbar with smooth transitions
- **Cards**: Glassmorphism design with hover effects
- **Buttons**: Gradient backgrounds with scale animations

## 📱 Pages & Routes

### Public Pages
- `/` - Landing page with features and testimonials
- `/how-it-works` - Step-by-step process explanation
- `/hospitals` - Partner hospitals directory
- `/banks` - Partner banks directory
- `/login` - User authentication
- `/register` - User registration

### Protected Pages
- `/profile` - User dashboard and settings
- `/pay` - Payment processing interface
- `/admin` - Admin dashboard (admin only)

## 🔐 Security Features

### Authentication
- **Supabase Auth**: Secure email/password authentication
- **Magic Links**: Passwordless login option
- **Session Management**: Automatic token refresh
- **Role-based Access**: User/admin role separation

### Data Protection
- **Row Level Security (RLS)**: Database-level access control
- **Encrypted Passwords**: bcrypt hashing
- **Input Validation**: Client and server-side validation
- **Audit Logging**: Complete action tracking

### Fraud Prevention
- **AI-powered Detection**: OpenAI integration for risk assessment
- **Multi-provider Verification**: Telesign and IDAnalyzer
- **Real-time Monitoring**: Live fraud score tracking
- **Configurable Thresholds**: Adjustable risk levels

## 🚀 Deployment

### Vercel Deployment
1. **Connect repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** automatically on push to main branch

### Environment Variables
```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (for full functionality)
OPENAI_API_KEY=your_openai_key
TELESIGN_API_KEY=your_telesign_key
IDANALYZER_API_KEY=your_idanalyzer_key
```

### Production Checklist
- [ ] Update Supabase project to production
- [ ] Change default admin credentials
- [ ] Configure production API keys
- [ ] Set up monitoring and alerts
- [ ] Test all payment flows
- [ ] Verify security settings

## 📊 Analytics & Monitoring

### Built-in Analytics
- **User Statistics**: Registration, activity, and engagement
- **Payment Analytics**: Volume, success rates, and trends
- **Security Metrics**: Fraud detection and risk assessment
- **System Performance**: Response times and error rates

### Monitoring Tools
- **Supabase Dashboard**: Database performance and logs
- **Vercel Analytics**: Frontend performance and errors
- **Custom Admin Dashboard**: Real-time system monitoring

## 🔧 Development

### Project Structure
```
web/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable UI components
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── supabase-setup.sql      # Database schema
├── ADMIN_SETUP.md          # Admin setup guide
└── README.md              # This file
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Code Standards
- Follow TypeScript best practices
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

## 📚 Documentation

### Guides
- [Admin Setup Guide](ADMIN_SETUP.md) - Complete admin system setup
- [API Documentation](API.md) - Backend API reference
- [Component Library](COMPONENTS.md) - UI component documentation

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Material-UI Documentation](https://mui.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 🆘 Support

### Common Issues
1. **Database Connection**: Verify Supabase credentials
2. **Admin Access**: Check user role and RLS policies
3. **Payment Processing**: Ensure API keys are configured
4. **Build Errors**: Check TypeScript and ESLint errors

### Getting Help
- Check the [troubleshooting section](ADMIN_SETUP.md#troubleshooting)
- Review the [Supabase documentation](https://supabase.com/docs)
- Open an issue on GitHub
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the excellent backend platform
- **Material-UI** for the beautiful component library
- **Framer Motion** for smooth animations
- **OpenAI** for AI-powered features
- **Community contributors** for feedback and improvements

---

**PulsePay** - Making emergency payments instant, secure, and accessible worldwide. 🚀
