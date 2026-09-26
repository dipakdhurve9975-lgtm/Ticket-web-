import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getDatabase, ref, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAoIQjQRoHjFyu7wJgis7AHjHdbxcPrWNE",
  authDomain: "hack2-d317b.firebaseapp.com",
  projectId: "hack2-d317b",
  storageBucket: "hack2-d317b.firebasestorage.app",
  messagingSenderId: "247891488047",
  appId: "1:247891488047:web:42c18d9fd4c8bb155305da",
  measurementId: "G-8DL4T6LDP0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testAll() {
  console.log("1. Testing Auth login for admin@gmail.com...");
  try {
    const userCred = await signInWithEmailAndPassword(auth, "admin@gmail.com", "admin123");
    console.log("AUTH SUCCESS! Logged in as:", userCred.user.email, "UID:", userCred.user.uid);
  } catch (err) {
    console.log("Auth error:", err.code, err.message);
  }

  console.log("\n2. Testing Cloud Firestore...");
  const collectionsToTest = ['tickets', 'requests', 'service_requests', 'serviceRequests', 'users'];
  for (const colName of collectionsToTest) {
    try {
      const snap = await getDocs(collection(db, colName));
      console.log(`Firestore collection '${colName}': found ${snap.size} documents.`);
      snap.forEach(doc => {
        console.log(` - Doc [${doc.id}]:`, JSON.stringify(doc.data()));
      });
    } catch (err) {
      console.log(`Firestore collection '${colName}' error:`, err.code, err.message);
    }
  }

  console.log("\n3. Testing Realtime Database...");
  try {
    const rtdb = getDatabase(app);
    const rootRef = ref(rtdb, '/');
    const snap = await get(rootRef);
    if (snap.exists()) {
      console.log("RTDB data exists:", Object.keys(snap.val()));
    } else {
      console.log("RTDB connected but root is empty.");
    }
  } catch (err) {
    console.log("RTDB error:", err.code, err.message);
  }
}

testAll().then(() => {
  console.log("\nTest completed.");
  process.exit(0);
}).catch(err => {
  console.error("Test failed fatal:", err);
  process.exit(1);
});
