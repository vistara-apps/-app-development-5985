import React, { useState } from 'react'
import { DataProvider } from './contexts/DataContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AppShell from './components/AppShell'
import LoginForm from './components/LoginForm'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Contacts from './pages/Contacts'
import Settings from './pages/Settings'
import UserManagement from './pages/UserManagement'

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'leads':
        return <Leads />
      case 'contacts':
        return <Contacts />
      case 'settings':
        return <Settings />
      case 'users':
        return <UserManagement />
      default:
        return <Dashboard />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated()) {
    return <LoginForm onSuccess={() => {}} />
  }

  return (
    <AppShell currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </AppShell>
  )
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  )
}

export default App
