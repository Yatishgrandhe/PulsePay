# Google OAuth Setup Guide for Health AI

## 🔧 Supabase Configuration

### Step 1: Enable Google OAuth in Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Navigate to your project: https://tmwnnilandaxdxneafeg.supabase.co
   - Go to **Authentication** → **Providers**

2. **Enable Google Provider**
   - Find "Google" in the list
   - Toggle it to **Enabled**
   - Click **Save**

### Step 2: Configure Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project: `scholarspire`

2. **Configure OAuth Consent Screen**
   - Go to **APIs & Services** → **OAuth consent screen**
   - Set application type to **External**
   - Add authorized domains:
     - `localhost` (for development)
     - `your-domain.com` (for production)

3. **Create OAuth 2.0 Credentials**
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client IDs**
   - Application type: **Web application**
   - Name: `Health AI Web Client`
   - Authorized redirect URIs:
     ```
     https://tmwnnilandaxdxneafeg.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```

4. **Copy Credentials**
   - Copy the **Client ID** and **Client Secret**
   - You already have these:
     - Client ID: `66799651721-fl1pqulhsi2s4lhm1bbcibbqkjge56gp.apps.googleusercontent.com`
     - Client Secret: `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`

### Step 3: Add Credentials to Supabase

1. **In Supabase Dashboard**
   - Go to **Authentication** → **Providers** → **Google**
   - Enter the credentials:
     - **Client ID**: `66799651721-fl1pqulhsi2s4lhm1bbcibbqkjge56gp.apps.googleusercontent.com`
     - **Client Secret**: `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`
   - Click **Save**

### Step 4: Update Environment Variables

Add these to your `.env.local` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=66799651721-fl1pqulhsi2s4lhm1bbcibbqkjge56gp.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_PROJECT_ID=scholarspire
```

## 🚀 Testing OAuth

### Local Testing
1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Click "Continue with Google"
4. Complete the OAuth flow

### Production Testing
1. Deploy to Vercel with environment variables
2. Test OAuth flow on production domain
3. Ensure redirect URIs are properly configured

## 🔒 Security Considerations

### Redirect URI Security
- Only add authorized domains to redirect URIs
- Use HTTPS in production
- Validate redirect URIs server-side

### Environment Variables
- Keep client secrets secure
- Use different credentials for dev/prod
- Rotate secrets regularly

## 📝 Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Check that redirect URI is exactly matched in Google Console
   - Ensure protocol (http/https) matches

2. **"OAuth consent screen not configured"**
   - Complete OAuth consent screen setup
   - Add test users if in testing mode

3. **"Client ID not found"**
   - Verify client ID is correct
   - Check that OAuth is enabled in Supabase

### Debug Steps
1. Check browser console for errors
2. Verify Supabase logs in dashboard
3. Test with different browsers
4. Clear browser cache and cookies

## ✅ Verification Checklist

- [ ] Google OAuth enabled in Supabase
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URIs added to Google Console
- [ ] Credentials added to Supabase
- [ ] Environment variables set
- [ ] Local testing successful
- [ ] Production testing successful

## 🎯 Next Steps

After OAuth is configured:
1. Test user registration flow
2. Test user login flow
3. Verify user data is stored in Supabase
4. Test account setup completion
5. Deploy to production

---

**Note**: The OAuth flow will redirect users to `/auth/callback` which is already implemented in the codebase. Users will be automatically redirected to the dashboard after successful authentication. 