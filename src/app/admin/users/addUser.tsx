// app/components/AddUserForm.tsx
'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDocument } from '@/app/lib/firebase/firestore';
import { uploadFile } from '@/app/lib/firebase/storage';
import { auth } from '@/app/lib/firebase/firebase';

export default function AddUserForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'admin' | 'editor'>('editor');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let avatarUrl = '';
      if (avatarFile) {
        avatarUrl = await uploadFile(`avatars/${user.uid}`, avatarFile);
      }

      await addDocument('users', {
        fullName,
        email,
        role,
        uid: user.uid,
        avatarUrl,
      });

      setEmail('');
      setPassword('');
      setFullName('');
      setRole('editor');
      setAvatarFile(null);
      setError('');
      alert('User created successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'admin' | 'editor')}
          className="w-full p-2 border rounded"
        >
          <option className='bg-dark-gray' value="admin">Admin</option>
          <option className='bg-dark-gray' value="editor">Editor</option>
        </select>
      </div>
      <div>
        <label className="block">Avatar</label>
        <input
          type="file"
          onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add User
      </button>
    </form>
  );
}