import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import PermissionGate from './PermissionGate'
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Settings, 
  Menu,
  X,
  Shield,
  LogOut,
  User
} from 'lucide-react'

const AppShell = ({ children, currentPage, onPageChange }) => {
  const { currentUser, logout, USER_ROLES } = useAuth()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', name: 'Leads', icon: UserPlus },
    { id: 'contacts', name: 'Contacts', icon: Users },
    { 
      id: 'users', 
      name: 'User Management', 
      icon: Shield, 
      requiresRole: USER_ROLES.ADMIN 
    },
    { id: 'settings', name: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-purple-900 via-blue-900 to-purple-800 transition-transform lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white bg-opacity-20">
                <span className="text-lg font-bold text-white">F</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-white">FlexiCRM</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id
                
                // Check if item requires specific role
                if (item.requiresRole) {
                  return (
                    <PermissionGate key={item.id} role={item.requiresRole} showFallback={false}>
                      <li>
                        <button
                          onClick={() => {
                            onPageChange(item.id)
                            setSidebarOpen(false)
                          }}
                          className={`
                            w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                            ${isActive 
                              ? 'bg-white bg-opacity-20 text-white' 
                              : 'text-purple-200 hover:bg-white hover:bg-opacity-10 hover:text-white'
                            }
                          `}
                        >
                          <Icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </button>
                      </li>
                    </PermissionGate>
                  )
                }
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onPageChange(item.id)
                        setSidebarOpen(false)
                      }}
                      className={`
                        w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-white bg-opacity-20 text-white' 
                          : 'text-purple-200 hover:bg-white hover:bg-opacity-10 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User Info */}
          <div className="px-4 pb-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white bg-opacity-20">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  <p className="text-xs text-purple-200 capitalize">
                    {currentUser?.role}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="text-purple-200 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-surface px-6 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Welcome back, {currentUser?.firstName}! Customize your CRM your way.
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppShell
