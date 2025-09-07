import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// User roles with hierarchical permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager', 
  USER: 'user'
}

// Permission levels for custom fields
export const FIELD_PERMISSIONS = {
  NONE: 'none',
  VIEW: 'view',
  EDIT: 'edit',
  FULL: 'full'
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load auth data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('flexicrm-current-user')
    const savedUsers = localStorage.getItem('flexicrm-users')

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      // Initialize with default admin user
      const defaultUsers = [
        {
          userId: '1',
          email: 'admin@flexicrm.com',
          firstName: 'Admin',
          lastName: 'User',
          role: USER_ROLES.ADMIN,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          userId: '2',
          email: 'manager@flexicrm.com',
          firstName: 'Manager',
          lastName: 'User',
          role: USER_ROLES.MANAGER,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          userId: '3',
          email: 'user@flexicrm.com',
          firstName: 'Regular',
          lastName: 'User',
          role: USER_ROLES.USER,
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]
      setUsers(defaultUsers)
    }

    setIsLoading(false)
  }, [])

  // Save users to localStorage whenever users change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('flexicrm-users', JSON.stringify(users))
    }
  }, [users])

  // Save current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('flexicrm-current-user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('flexicrm-current-user')
    }
  }, [currentUser])

  // Authentication functions
  const login = (email, password) => {
    // Simple demo authentication - in production, this would call an API
    const user = users.find(u => u.email === email && u.isActive)
    if (user) {
      setCurrentUser(user)
      return { success: true, user }
    }
    return { success: false, error: 'Invalid credentials or inactive user' }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const register = (userData) => {
    const newUser = {
      ...userData,
      userId: Date.now().toString(),
      role: USER_ROLES.USER, // Default role
      isActive: true,
      createdAt: new Date().toISOString()
    }
    setUsers(prev => [...prev, newUser])
    return { success: true, user: newUser }
  }

  // User management functions
  const updateUser = (userId, updates) => {
    setUsers(prev => prev.map(user => 
      user.userId === userId ? { ...user, ...updates } : user
    ))
    
    // Update current user if it's the one being updated
    if (currentUser && currentUser.userId === userId) {
      setCurrentUser(prev => ({ ...prev, ...updates }))
    }
  }

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.userId !== userId))
    
    // Logout if current user is being deleted
    if (currentUser && currentUser.userId === userId) {
      setCurrentUser(null)
    }
  }

  const addUser = (userData) => {
    const newUser = {
      ...userData,
      userId: Date.now().toString(),
      isActive: true,
      createdAt: new Date().toISOString()
    }
    setUsers(prev => [...prev, newUser])
    return newUser
  }

  // Permission checking functions
  const hasRole = (requiredRole) => {
    if (!currentUser) return false
    
    const roleHierarchy = {
      [USER_ROLES.ADMIN]: 3,
      [USER_ROLES.MANAGER]: 2,
      [USER_ROLES.USER]: 1
    }
    
    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole]
  }

  const canViewField = (field) => {
    if (!currentUser || !field.permissions) return true
    
    const userPermission = field.permissions[currentUser.userId] || 
                          field.permissions[currentUser.role] ||
                          FIELD_PERMISSIONS.VIEW
    
    return userPermission !== FIELD_PERMISSIONS.NONE
  }

  const canEditField = (field) => {
    if (!currentUser || !field.permissions) return true
    
    const userPermission = field.permissions[currentUser.userId] || 
                          field.permissions[currentUser.role] ||
                          FIELD_PERMISSIONS.EDIT
    
    return userPermission === FIELD_PERMISSIONS.EDIT || userPermission === FIELD_PERMISSIONS.FULL
  }

  const canManageField = (field) => {
    if (!currentUser) return false
    
    // Only admins can manage field permissions by default
    if (hasRole(USER_ROLES.ADMIN)) return true
    
    const userPermission = field.permissions?.[currentUser.userId] || 
                          field.permissions?.[currentUser.role]
    
    return userPermission === FIELD_PERMISSIONS.FULL
  }

  const isAuthenticated = () => {
    return currentUser !== null && currentUser.isActive
  }

  const value = {
    currentUser,
    users,
    isLoading,
    login,
    logout,
    register,
    updateUser,
    deleteUser,
    addUser,
    hasRole,
    canViewField,
    canEditField,
    canManageField,
    isAuthenticated,
    USER_ROLES,
    FIELD_PERMISSIONS
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
