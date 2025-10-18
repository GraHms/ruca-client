# Ruca - Ride Hailing for Mozambique

Ruca is an Expo + React Native application prototype for an Uber-like experience tailored to Mozambique. It focuses on a passenger-first flow with an optional driver mode preview, localization for Portuguese (pt-MZ) and English, and offline-friendly mocked services.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io), [yarn](https://yarnpkg.com), or npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Install Dependencies

```bash
pnpm install
# or
yarn install
# or
npm install
```

### Optional: Map Keys

Create an `.env` file and set `GOOGLE_MAPS_APIKEY`. The app gracefully falls back to static mock data when the key is missing.

### Run the App

```bash
pnpm start
# or
yarn start
# or
npm run start
# or
bun run start
```

> The start script disables Expo telemetry by default (`EXPO_NO_TELEMETRY=1`) to avoid Bun runtime incompatibilities that can
> crash the CLI before Metro starts. Feel free to re-enable telemetry if you're using Node-based package managers.

Open the Expo Go app on your device or use an emulator to preview.

### Prebuild for Native Projects

```bash
expo prebuild
```

> ℹ️ EAS builds will require real bundle identifiers, keystores, and platform credentials before publishing.

## Feature Highlights

- **Passenger Flow**: Authenticate with a mock OTP, search for destinations, confirm fare estimates, request rides, and follow live trip progress.
- **Driver Mode (MVP)**: Toggle availability, preview mock ride requests, and view basic earnings summaries.
- **Localization**: Portuguese (pt-MZ) by default with English fallback. Switch languages from the Profile screen using `react-i18next`.
- **State Management**: Zustand stores for auth, rides, and driver state; persisted session tokens are stored securely with Expo Secure Store.
- **Networking**: Axios-based API service layer with `@tanstack/react-query` for caching, plus `zod` schemas for runtime data validation.
- **Maps**: `react-native-maps` with Google provider support and mocked routes/drivers when offline.
- **Payments**: Simulated M-Pesa and e-Mola payment flows via service stubs for easy integration with real APIs later.
- **Styling**: `nativewind` tailwind utility classes with a Mozambican-inspired teal primary palette and accessible components.

## Mock Services & Data

All networked features (rides, geocoding, payments) run against local mocks stored in `app/src/utils/mock.ts`. They simulate realistic timings and responses, enabling development without a backend.

## Project Structure

Refer to the `app/src` directory for modules covering components, navigation, screens, services, state, types, utilities, and internationalization assets.

## Testing & Linting

```bash
pnpm lint
pnpm format
pnpm typecheck
```

## License

This repository is provided as-is for demonstration purposes.
