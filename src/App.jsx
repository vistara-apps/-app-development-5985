import React, { useState } from 'react'
import { DataProvider } from './contexts/DataContext'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Contacts from './pages/Contacts'
import Settings from './pages/Settings'

function App() {
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
      default:
        return <Dashboard />
    }
  }

  return (
    <DataProvider>
      <AppShell currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </AppShell>
    </DataProvider>
  )
}

export default App