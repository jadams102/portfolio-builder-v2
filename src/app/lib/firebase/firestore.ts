import { collection, addDoc, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const addDocument = (collectionName: string, data: object) => addDoc(collection(db, collectionName), data);
export const getDocuments = (collectionName: string) => getDocs(collection(db, collectionName));
export const updateDocument = (collectionName: string, id: string, data: object) => setDoc(doc(db, collectionName, id), data);
export const deleteDocument = (collectionName: string, id: string) => deleteDoc(doc(db, collectionName, id));
export const getDocument = (collectionName: string, id: string) => getDoc(doc(db, collectionName, id));
