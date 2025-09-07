import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DataGrid from '../components/DataGrid'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import PermissionGate from '../components/PermissionGate'
import { Users, Plus, Shield, ShieldCheck, ShieldX } from 'lucide-react'

const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser, USER_ROLES, currentUser } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: USER_ROLES.USER,
    isActive: true
  })

  const roleOptions = [
    { value: USER_ROLES.ADMIN, label: 'Administrator' },
    { value: USER_ROLES.MANAGER, label: 'Manager' },
    { value: USER_ROLES.USER, label: 'User' }
  ]

  const getRoleIcon = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return <ShieldCheck className="h-4 w-4 text-red-600" />
      case USER_ROLES.MANAGER:
        return <Shield className="h-4 w-4 text-blue-600" />
      default:
        return <ShieldX className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'bg-red-100 text-red-800'
      case USER_ROLES.MANAGER:
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const columns = [
    {
      key: 'firstName',
      header: 'First Name'
    },
    {
      key: 'lastName',
      header: 'Last Name'
    },
    {
      key: 'email',
      header: 'Email'
    },
    {
      key: 'role',
      header: 'Role',
      render: (user) => (
        <div className="flex items-center space-x-2">
          {getRoleIcon(user.role)}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
            {user.role}
          </span>
        </div>
      )
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (user) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (user) => new Date(user.createdAt).toLocaleDateString()
    }
  ]

  const handleAdd = () => {
    setEditingUser(null)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: USER_ROLES.USER,
      isActive: true
    })
    setShowModal(true)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    })
    setShowModal(true)
  }

  const handleDelete = (user) => {
    if (user.userId === currentUser?.userId) {
      alert('You cannot delete your own account.')
      return
    }

    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
      deleteUser(user.userId)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingUser) {
      updateUser(editingUser.userId, formData)
    } else {
      addUser(formData)
    }
    
    setShowModal(false)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const activeUsers = users.filter(user => user.isActive).length
  const adminUsers = users.filter(user => user.role === USER_ROLES.ADMIN).length
  const managerUsers = users.filter(user => user.role === USER_ROLES.MANAGER).length
  const regularUsers = users.filter(user => user.role === USER_ROLES.USER).length

  return (
    <PermissionGate 
      role={USER_ROLES.ADMIN}
      fallback={
        <div className="text-center py-12">
          <ShieldX className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">You don't have permission to access user management.</p>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage user accounts, roles, and permissions.</p>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface rounded-lg shadow-card p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-card p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-green-600"></div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-card p-6">
            <div className="flex items-center">
              <ShieldCheck className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{adminUsers}</p>
                <p className="text-sm text-gray-600">Administrators</p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-card p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{managerUsers}</p>
                <p className="text-sm text-gray-600">Managers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <DataGrid
          title="All Users"
          data={users}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />

        {/* Role Distribution */}
        <div className="bg-surface rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">Administrators</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${users.length > 0 ? (adminUsers / users.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{adminUsers}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">Managers</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${users.length > 0 ? (managerUsers / users.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{managerUsers}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShieldX className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">Regular Users</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-gray-600 h-2 rounded-full" 
                    style={{ width: `${users.length > 0 ? (regularUsers / users.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{regularUsers}</span>
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingUser ? 'Edit User' : 'Add New User'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <FormField
              label="Role"
              name="role"
              type="select"
              value={formData.role}
              onChange={handleInputChange}
              options={roleOptions}
              required
            />

            <div className="flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active user account
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90"
              >
                {editingUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGate>
  )
}

export default UserManagement
