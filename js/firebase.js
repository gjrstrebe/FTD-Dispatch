// js/firebase.js
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  updateDoc, 
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Your Live Firebase Credentials
const firebaseConfig = {
  apiKey: "AIzaSyAZCnf7hIOZnAQurfkSN8BgyXNUm5Tlffs",
  authDomain: "ftd-dispatch.firebaseapp.com",
  projectId: "ftd-dispatch",
  storageBucket: "ftd-dispatch.firebasestorage.app",
  messagingSenderId: "987894209616",
  appId: "1:987894209616:web:0ce969b28cecfe1adc4555",
  measurementId: "G-9JW2Y7YX5N"
};

// Initialize App & Services
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// App collection namespace
const APP_ID = 'ftd-dispatch';

// Real-Time Job Queue Sync Listener
export function subscribeToJobs(callback) {
  const jobsCol = collection(db, 'artifacts', APP_ID, 'public', 'data', 'jobs');
  return onSnapshot(jobsCol, (snapshot) => {
    const loadedJobs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    loadedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    callback(loadedJobs);
  }, (error) => {
    console.error("Firestore Job Sync Error:", error);
  });
}

// Real-Time Partner Network Sync Listener
export function subscribeToPartners(callback) {
  const partnersCol = collection(db, 'artifacts', APP_ID, 'public', 'data', 'partners');
  return onSnapshot(partnersCol, (snapshot) => {
    const loadedPartners = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(loadedPartners);
  }, (error) => {
    console.error("Firestore Partner Sync Error:", error);
  });
}

// Real-Time Category List Sync Listener
export function subscribeToCategories(callback) {
  const catCol = collection(db, 'artifacts', APP_ID, 'public', 'data', 'categories');
  return onSnapshot(catCol, (snapshot) => {
    const loadedCategories = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(loadedCategories);
  }, (error) => {
    console.error("Firestore Category Sync Error:", error);
  });
}

// Write/Update Functions
export async function saveJob(jobData) {
  const id = jobData.id || 'ftd-job-' + Date.now().toString().slice(-4);
  const payload = {
    ...jobData,
    id,
    createdAt: jobData.createdAt || new Date().toISOString()
  };
  await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'jobs', id), payload, { merge: true });
  return id;
}

export async function claimJob(jobId, subInfo) {
  const jobRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'jobs', jobId);
  await updateDoc(jobRef, {
    status: 'CLAIMED',
    claimedBy: `${subInfo.name} (${subInfo.contact})`,
    claimedAt: new Date().toISOString()
  });
}

export async function deleteJobRecord(jobId) {
  await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'jobs', jobId));
}

export async function savePartner(partnerData) {
  const id = partnerData.id || 'sub-' + Date.now().toString().slice(-4);
  const payload = { ...partnerData, id };
  await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'partners', id), payload, { merge: true });
}

export async function deletePartnerRecord(partnerId) {
  await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'partners', partnerId));
}

export async function saveCategory(categoryName) {
  const id = 'cat-' + categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'categories', id), { id, name: categoryName });
}

export async function deleteCategoryRecord(categoryId) {
  await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'categories', categoryId));
}

// Anonymous Auth Setup
export function initAuth(onUserChanged) {
  signInAnonymously(auth).catch(err => console.error("Auth error:", err));
  return onAuthStateChanged(auth, onUserChanged);
}
