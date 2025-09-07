# Mobile App (Capacitor)

## Prereqs
- Node 18+, Android Studio / Xcode
- `npm i -g @capacitor/cli`

## Build Web
```
cd ../
npm run build
```

## Init Capacitor
```
cd mobile
npx cap init HomeServices com.client.homeservices --web-dir=../dist
npx cap add android
# npx cap add ios
npx cap copy
npx cap open android
```

Push notifications will use the same Firebase project used by the web app.
