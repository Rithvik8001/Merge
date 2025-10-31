# Mobile App - Quick Start Guide

## 🚀 Start Development

### Option 1: Local Backend (localhost:3000)
```bash
# Terminal 1: Start backend
cd server && pnpm dev

# Terminal 2: Start mobile
cd mobile && npx expo start
# App automatically uses .env (localhost:3000)
```

### Option 2: Deployed Backend
```bash
# Create local override (gitignored)
echo "EXPO_PUBLIC_API_URL=https://merge-n7ht.onrender.com" > mobile/.env.local
echo "EXPO_PUBLIC_SOCKET_URL=https://merge-n7ht.onrender.com" >> mobile/.env.local
echo "EXPO_PUBLIC_DEBUG=true" >> mobile/.env.local

# Start mobile
cd mobile && npx expo start
# App automatically uses .env.local
```

## 📱 Open App

### iOS Simulator
Press `i` in Expo terminal

### Android Emulator
Press `a` in Expo terminal

### Physical Device
Scan QR code with Expo Go app

## 🔐 Test Authentication

### Test Login
```
Email: test@example.com
Password: Test@123456
```

### Test Signup
Create new account with:
- Username: (6-15 chars, alphanumeric + underscore)
- Email: valid email address
- Password: (8+ chars, upper, lower, number, special char)
- Confirm Password: must match

### Test Session Persistence
1. Log in successfully
2. Go home screen (don't force close)
3. Close app completely
4. Reopen app
5. ✅ Should see dashboard directly (no login screen)

### Test Logout
1. Open app (logged in)
2. Tap logout button
3. Close app
4. Reopen app
5. ✅ Should see login screen

## 🔧 Common Commands

```bash
# Clear Expo cache and restart
npx expo start --clear

# Check what environment is loaded
# Look at console logs: "=== Environment Configuration ==="

# Run TypeScript check
npx tsc --noEmit

# Format code
npx prettier --write .

# Lint code
npx eslint --fix .
```

## 📁 Key Files

### Authentication
- `store/authStore.ts` - Auth state & persistence
- `hooks/useLogin.ts` - Login logic
- `hooks/useSignup.ts` - Signup logic
- `hooks/useEmailVerification.ts` - OTP verification

### Configuration
- `config/env.ts` - Environment configuration
- `.env` - Development defaults
- `.env.local` - Local overrides (gitignored)
- `.env.production` - Production config

### Validation & Error Handling
- `validations/` - Zod schemas
- `utils/errorHandler.ts` - Error parsing
- `utils/AppError.ts` - Error class

### API & Networking
- `lib/api.ts` - Axios client with interceptors

### Navigation
- `app/_layout.tsx` - Root layout with hydration

## 🐛 Debugging

### Enable Debug Logging
Set in .env or .env.local:
```env
EXPO_PUBLIC_DEBUG=true
```

### View Configuration
Check console on app startup:
```
=== Environment Configuration ===
API URL: http://localhost:3000
Socket URL: http://localhost:3000
Debug Mode: true
Environment: Development
==================================
```

### Common Issues

**"API URL is undefined"**
- Check .env file exists in mobile/ directory
- Verify EXPO_PUBLIC_ prefix on variable names
- Run `npx expo start --clear`

**"Changes to .env not picked up"**
- Kill Expo server (Ctrl+C)
- Run `npx expo start --clear`
- Reload app (press 'r' in Expo)

**"Session not persisting"**
- Check SecureStore working: Look for "Storing token in SecureStore..." log
- Check AsyncStorage working: Look for "AsyncStorage rehydration complete" log
- Ensure server is sending token in response body
- Try clearing app data and re-login

**"Infinite loop error"**
- This shouldn't happen with current implementation
- If it does, clear node_modules and reinstall: `npm install`

## 📚 Documentation

For detailed information, see:
- `MOBILE_ENV_SETUP.md` - Environment configuration deep dive
- `MOBILE_IMPLEMENTATION_SUMMARY.md` - Complete implementation details
- `MOBILE_SETUP_VERIFICATION.md` - Verification checklist

## 🎯 Next Steps

After getting familiar with the setup:

1. **Dashboard Screen** - Display user info and posts
2. **Profile Screen** - View and edit profile
3. **Search/Feed** - Discover other developers
4. **Messaging** - Real-time chat
5. **Push Notifications** - Alert users of new messages

## 🚀 Deploy to Production

### Build for iOS
```bash
eas build --platform ios --profile production
# Uses .env.production automatically
```

### Build for Android
```bash
eas build --platform android --profile production
# Uses .env.production automatically
```

### Monitor Build
```bash
eas build:list
eas build:view <BUILD_ID>
```

## ❓ Need Help?

1. Check `MOBILE_SETUP_VERIFICATION.md` for verification checklist
2. Check console logs for detailed debugging info
3. Verify backend is running and accessible
4. Check environment variables in .env/.env.local
5. Review error messages in app (usually very descriptive)

---

**Pro Tips:**
- Always use Config module instead of process.env
- Use .env.local to test with different backends
- Keep debug logging in development for troubleshooting
- Use Zod for new form validations
- Use parseApiError() for error handling

Happy coding! 🎉
