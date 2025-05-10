import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, UserRole } from '../types';
import { Edit, Trash2, UserPlus, Upload, Download } from 'lucide-react';

const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, backupData, restoreData } = useAuth();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    displayName: '',
    role: 'it' as UserRole,
    division: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingUser) {
      updateUser(isEditingUser, formData);
      setIsEditingUser(null);
    } else {
      addUser(formData);
      setIsAddingUser(false);
    }
    setFormData({
      username: '',
      password: '',
      displayName: '',
      role: 'it',
      division: '',
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
    }
  };

  const handleEdit = (user: User) => {
    setIsEditingUser(user.id);
    setFormData({
      username: user.username,
      password: user.password,
      displayName: user.displayName,
      role: user.role,
      division: user.division,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          restoreData(content);
          alert('Data restored successfully!');
        } catch (error) {
          alert('Error restoring data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
        <div className="space-x-2">
          <button
            onClick={() => backupData()}
            className="btn btn-secondary inline-flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Backup Data
          </button>
          <label className="btn btn-secondary inline-flex items-center cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Restore Data
            <input
              type="file"
              className="hidden"
              accept=".json"
              onChange={handleFileUpload}
            />
          </label>
          <button
            onClick={() => setIsAddingUser(true)}
            className="btn btn-primary inline-flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {(isAddingUser || isEditingUser) && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">
            {isEditingUser ? 'Edit User' : 'Add New User'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  className="input"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="displayName" className="form-label">Display Name</label>
                <input
                  type="text"
                  id="displayName"
                  className="input"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  id="role"
                  className="input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  required
                >
                  <option value="it">IT</option>
                  <option value="riset">Riset</option>
                  <option value="writer">Writer</option>
                  <option value="content">Content</option>
                  <option value="desain">Desain</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="division" className="form-label">Division</label>
                <input
                  type="text"
                  id="division"
                  className="input"
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsAddingUser(false);
                  setIsEditingUser(null);
                  setFormData({
                    username: '',
                    password: '',
                    displayName: '',
                    role: 'it',
                    division: '',
                  });
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditingUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Display Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Division
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  {user.displayName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  {user.division}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-error-600 hover:text-error-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;