import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseFallbackConfig = {
  apiKey: 'AIzaSyAro6zFRnMaOOySZF2H7a7grrmrKn59KJU',
  authDomain: 'colegio-app-d23ba.firebaseapp.com',
  projectId: 'colegio-app-d23ba',
  storageBucket: 'colegio-app-d23ba.firebasestorage.app',
  messagingSenderId: '1014395980623',
  appId: '1:1014395980623:web:ed8061578a20dc4be1d33a'
};

const firebaseEnvConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const isValidConfig = (config) => Object.values(config).every((value) => {
  if (!value) return false;
  const normalized = String(value).trim().toLowerCase();
  return !normalized.startsWith('your_');
});

const hasValidEnvConfig = isValidConfig(firebaseEnvConfig);
const firebaseConfig = hasValidEnvConfig ? firebaseEnvConfig : firebaseFallbackConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export const firebaseReady = true;
export default app;
