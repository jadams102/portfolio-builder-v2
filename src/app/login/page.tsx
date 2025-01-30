'use client'; 

import { useState } from 'react';
import { signIn, signInWithGoogle } from '@/app/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle('admin');
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form className={styles.form} onSubmit={handleEmailSignIn}>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="button" type="submit">Sign In with Email</button>
      </form>
      <button className="button" onClick={handleGoogleSignIn}>Sign In with Google</button>
    </div>
  );
}