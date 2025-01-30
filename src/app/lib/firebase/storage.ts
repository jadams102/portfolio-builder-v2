import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const uploadFile = (path: string, file: File) => {
  const storageRef = ref(storage, path);
  return uploadBytes(storageRef, file);
};

export const getFileURL = (path: string) => {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
};
