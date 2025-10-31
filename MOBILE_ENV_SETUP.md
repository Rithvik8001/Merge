# Mobile Environment Configuration Guide

## Overview

The Merge mobile app uses a multi-environment setup to handle different configurations for development, local testing, and production builds.

## File Structure

```
mobile/
├── .env                 # Default development environment
├── .env.local          # Local machine overrides (gitignored)
├── .env.production     # Production build configuration
├── config/
│   └── env.ts          # Centralized config module
└── lib/
    └── api.ts          # API client using config
```

## Environment Files

### 1. `.env` (Committed to Git)
**Purpose:** Default development environment
**Use case:** Running locally with local backend

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
EXPO_PUBLIC_DEBUG=true
```

**When to use:**
```bash
# Development with local backend
npx expo start
```

### 2. `.env.local` (Gitignored, Local Only)
**Purpose:** Override defaults for your local machine
**Use case:** Testing with deployed backend without redeploying

```env
EXPO_PUBLIC_API_URL=https://merge-n7ht.onrender.com
EXPO_PUBLIC_SOCKET_URL=https://merge-n7ht.onrender.com
EXPO_PUBLIC_DEBUG=true
```

**When to use:**
```bash
# Development with deployed backend
npx expo start
# Automatically uses .env.local if it exists
```

### 3. `.env.production` (Committed to Git)
**Purpose:** Production build configuration
**Use case:** Building for app stores

```env
EXPO_PUBLIC_API_URL=https://merge-n7ht.onrender.com
EXPO_PUBLIC_SOCKET_URL=https://merge-n7ht.onrender.com
EXPO_PUBLIC_DEBUG=false
```

**When to use:**
```bash
# Production build
eas build --platform ios --profile production
```

## How It Works

### Loading Order (Highest to Lowest Priority)

1. **`.env.local`** (if exists) - Your local overrides
2. **`.env.production`** (if building for production) - Production config
3. **`.env`** (default) - Fallback defaults

### Accessing Variables

**In any component:**
```typescript
import Config from '../config/env';

console.log(Config.api.baseUrl);      // "http://localhost:3000"
console.log(Config.api.socketUrl);    // "http://localhost:3000"
console.log(Config.debug);            // true
console.log(Config.isDevelopment);    // true
```

**Direct access (not recommended):**
```typescript
// ✅ Only works with EXPO_PUBLIC_ prefix
const url = process.env.EXPO_PUBLIC_API_URL;

// ❌ Won't work (no EXPO_PUBLIC_ prefix)
const secret = process.env.SOME_SECRET; // undefined
```

## Common Workflows

### Scenario 1: Local Development with Local Backend

```bash
# Backend running on localhost:3000
cd server && pnpm dev

# Mobile app uses .env (default)
cd mobile && npx expo start
```

**Result:**
- API URL: `http://localhost:3000`
- Socket URL: `http://localhost:3000`
- Debug: `true`

### Scenario 2: Local Development with Deployed Backend

```bash
# Create .env.local with deployed URL
echo "EXPO_PUBLIC_API_URL=https://merge-n7ht.onrender.com" > mobile/.env.local

# Run expo (automatically uses .env.local)
cd mobile && npx expo start
```

**Result:**
- API URL: `https://merge-n7ht.onrender.com` (from .env.local)
- Socket URL: `https://merge-n7ht.onrender.com` (from .env.local)
- Debug: `true` (from .env.local)

### Scenario 3: Production Build

```bash
# Uses .env.production automatically
eas build --platform ios --profile production
```

**Result:**
- API URL: `https://merge-n7ht.onrender.com` (from .env.production)
- Socket URL: `https://merge-n7ht.onrender.com` (from .env.production)
- Debug: `false`

## Important Notes

### ✅ DO

- ✅ Commit `.env` and `.env.production` to git
- ✅ Add `.env.local` to `.gitignore` (already done)
- ✅ Use `Config` module to access variables
- ✅ Prefix public variables with `EXPO_PUBLIC_`
- ✅ Use different endpoints for different environments

### ❌ DON'T

- ❌ Commit `.env.local` (contains personal/sensitive data)
- ❌ Store secrets without `EXPO_PUBLIC_` (they won't work in Expo anyway)
- ❌ Hardcode API URLs in components
- ❌ Use `process.env` directly (use `Config` instead)

## Variable Naming Convention

**Public Variables (exposed to client):**
```env
EXPO_PUBLIC_API_URL=...       # ✅ Exposed
EXPO_PUBLIC_SOCKET_URL=...    # ✅ Exposed
EXPO_PUBLIC_DEBUG=...         # ✅ Exposed
```

**Secret Variables (NOT exposed):**
```env
# These won't be available in the app
# Use them only in server/build scripts
SECRET_API_KEY=...            # ❌ Not available
DATABASE_URL=...              # ❌ Not available
```

## Debugging Configuration

Check what configuration is loaded:

```typescript
import Config from './config/env';

// Prints configuration on app startup (development only)
Config.printConfig();

// Output:
// === Environment Configuration ===
// API URL: http://localhost:3000
// Socket URL: http://localhost:3000
// Debug Mode: true
// Environment: Development
// ==================================
```

## Adding New Environment Variables

1. **Add to all relevant `.env` files:**

```env
# .env (development)
EXPO_PUBLIC_API_URL=http://localhost:3000

# .env.local (local override)
EXPO_PUBLIC_API_URL=https://merge-n7ht.onrender.com

# .env.production (production)
EXPO_PUBLIC_API_URL=https://merge-n7ht.onrender.com
```

2. **Add to `config/env.ts`:**

```typescript
export const Config = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
    socketUrl: process.env.EXPO_PUBLIC_SOCKET_URL || "http://localhost:3000",
  },
  // ... rest of config
};
```

3. **Use in your code:**

```typescript
import Config from '../config/env';

const apiUrl = Config.api.baseUrl;
```

## Troubleshooting

### "API URL is undefined"

**Problem:** `Config.api.baseUrl` is undefined

**Solution:**
1. Check that variable has `EXPO_PUBLIC_` prefix
2. Verify `.env` file exists in mobile root directory
3. Restart Expo: `npx expo start --clear`

### "Changes to .env not picked up"

**Problem:** Changed `.env.local` but app still uses old values

**Solution:**
```bash
# Clear Expo cache and restart
npx expo start --clear

# Or reload app (press 'r' in Expo)
```

### "Wrong API URL in production"

**Problem:** Production build using wrong URL

**Solution:**
1. Check `.env.production` has correct URL
2. Run build with correct profile: `eas build --profile production`
3. Verify build configuration in `eas.json`

## Summary

| Task | File to Edit | Environment |
|------|---|---|
| Local dev with local backend | `.env` | Development |
| Local dev with deployed backend | `.env.local` | Development |
| Production build | `.env.production` | Production |
| Add new variable | All `.env*` files | All |
| Change API endpoint | `.env.local` | Development |

**Pro Tip:** Use `.env.local` to switch between local and deployed backends without committing changes!
