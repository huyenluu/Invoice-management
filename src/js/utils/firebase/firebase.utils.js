import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  writeBatch,
  query,
  where,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "invoices-app-database.firebaseapp.com",
  projectId: "invoices-app-database",
  databaseURL: "https://invoices-app-database-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "invoices-app-database.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};
export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

export const db = getFirestore(firebaseApp);
export const getInvoices = async (userId) => {
  const invoicesCol = collection(db, "invoices");
  const q = query(invoicesCol, where("userId", "==", userId));

  const invoiceSnapshot = await getDocs(q);
  const invoiceList = invoiceSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return invoiceList;
};

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const batch = writeBatch(db);
  const collectionRef = collection(db, collectionKey);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef);
    batch.set(docRef, object);
  });

  await batch.commit();
};

const invoicesCollectionRef = collection(db, "invoices");
export const addInvoiceToFireStore = async (data) => {
  await addDoc(invoicesCollectionRef, data);
};

export const deleteInvoiceFromFireStore = async (id) => {
  await deleteDoc(doc(db, "invoices", id));
};

export const updateInvoiceFromFireStore = async (id, data) => {
  const invoiceRef = doc(db, "invoices", id);
  await setDoc(invoiceRef, data, { merge: true });
};
