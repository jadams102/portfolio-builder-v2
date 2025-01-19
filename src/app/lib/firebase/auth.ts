import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    User, 
    GoogleAuthProvider, 
    signInWithPopup 
  } from 'firebase/auth';
  import { getDoc,doc, setDoc } from 'firebase/firestore';
  import { auth, db } from './firebase';
  
  export const signUp = async (email: string, password: string, fullName: string, role: 'admin' | 'editor') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      fullName,
      role,
      email: user.email,
      uid: user.uid,
    });
    return user;
  };
  
  export const signIn = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
  
  export const logOut = () => signOut(auth);
  
  export const subscribeToAuthChanges = (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback);
  
  export const signInWithGoogle = async (role: 'admin' | 'editor') => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    const userDocRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);
    const userExists = userSnapshot.exists();
    
    if (!userExists) {
      await setDoc(userDocRef, {
        fullName: user.displayName || 'Anonymous',
        role,
        email: user.email,
        uid: user.uid,
      });
    }
    return user;
  };
  