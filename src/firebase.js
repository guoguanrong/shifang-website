import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

let auth

export function getFirebaseAuth() {
  if (auth) return auth

  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
  const missing = Object.entries(config).filter(([, value]) => !value).map(([key]) => key)

  if (missing.length) {
    const error = new Error('Firebase web app configuration is incomplete.')
    error.code = 'firebase/config-missing'
    throw error
  }

  const appName = 'shifang-phone-recaptcha'
  const app = getApps().find((item) => item.name === appName) || initializeApp(config, appName)
  auth = getAuth(app)
  return auth
}
