'use client';

import { useState, useEffect } from 'react';
import { getUsers, deleteDocument, updateDocument } from '@/app/lib/firebase/firestore';
import { uploadFile } from '@/app/lib/firebase/storage';
import { deleteUser } from 'firebase/auth';
import { auth } from '@/app/lib/firebase/firebase';

type User = {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'editor';
  avatarUrl?: string;
};

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      setUsers(users as User[]);
    };
    fetchUsers();
  }, []);

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig) return 0;
  
    const key = sortConfig.key as keyof User;
  
    const valueA = a[key];
    const valueB = b[key];
  
    if (valueA === undefined || valueB === undefined) return 0;
  
    if (valueA < valueB) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setAvatarPreview(user.avatarUrl || null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      let avatarUrl = editingUser.avatarUrl;
      if (avatarFile) {
        avatarUrl = await uploadFile(`avatars/${editingUser.id}`, avatarFile);
      }

      await updateDocument('users', editingUser.id, {
        fullName: editingUser.fullName,
        email: editingUser.email,
        role: editingUser.role,
        avatarUrl,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...user, ...editingUser, avatarUrl } : user
        )
      );

      setEditingUser(null);
      setAvatarFile(null);
      setAvatarPreview(null);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user.');
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDocument('users', userId);
        const user = auth.currentUser;
        if (user && user.uid === userId) {
          await deleteUser(user);
        } else {
          console.warn('Cannot delete another user from the client side.');
        }
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      }
    }
  };

  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th
              className="p-2 border cursor-pointer"
              onClick={() => requestSort('fullName')}
            >
              Name {sortConfig?.key === 'fullName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="p-2 border cursor-pointer"
              onClick={() => requestSort('email')}
            >
              Email {sortConfig?.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="p-2 border cursor-pointer"
              onClick={() => requestSort('role')}
            >
              Role {sortConfig?.key === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th className="p-2 border">Avatar</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td className="p-2 border">{user.fullName}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border">
                {user.avatarUrl && (
                  <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full" />
                )}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-dark-gray p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block">Full Name</label>
                <input
                  type="text"
                  value={editingUser.fullName}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, fullName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value as 'admin' | 'editor',
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <div className='flex gap-2'>
                <div>
                  <label className="block">Avatar</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                {avatarPreview && (
                  <div className="mt-2">
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-20 h-20 rounded-full"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setAvatarFile(null);
                    setAvatarPreview(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}