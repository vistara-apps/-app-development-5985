import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const PermissionGate = ({ 
  children, 
  role, 
  field, 
  permission = 'view',
  fallback = null,
  showFallback = true 
}) => {
  const { hasRole, canViewField, canEditField, canManageField, currentUser } = useAuth()

  // Check role-based permissions
  if (role && !hasRole(role)) {
    return showFallback ? fallback : null
  }

  // Check field-based permissions
  if (field) {
    let hasPermission = false
    
    switch (permission) {
      case 'view':
        hasPermission = canViewField(field)
        break
      case 'edit':
        hasPermission = canEditField(field)
        break
      case 'manage':
        hasPermission = canManageField(field)
        break
      default:
        hasPermission = canViewField(field)
    }

    if (!hasPermission) {
      return showFallback ? fallback : null
    }
  }

  // If no current user and we're checking permissions, deny access
  if ((role || field) && !currentUser) {
    return showFallback ? fallback : null
  }

  return children
}

// Higher-order component version
export const withPermission = (WrappedComponent, permissionConfig) => {
  return function PermissionWrappedComponent(props) {
    return (
      <PermissionGate {...permissionConfig}>
        <WrappedComponent {...props} />
      </PermissionGate>
    )
  }
}

// Hook for permission checking in components
export const usePermissions = () => {
  const { hasRole, canViewField, canEditField, canManageField, currentUser } = useAuth()

  const checkPermission = (config) => {
    if (config.role && !hasRole(config.role)) {
      return false
    }

    if (config.field) {
      switch (config.permission) {
        case 'view':
          return canViewField(config.field)
        case 'edit':
          return canEditField(config.field)
        case 'manage':
          return canManageField(config.field)
        default:
          return canViewField(config.field)
      }
    }

    if ((config.role || config.field) && !currentUser) {
      return false
    }

    return true
  }

  return { checkPermission, hasRole, canViewField, canEditField, canManageField }
}

export default PermissionGate
