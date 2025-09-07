import React, { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const [leads, setLeads] = useState([])
  const [contacts, setContacts] = useState([])
  const [customFields, setCustomFields] = useState([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedLeads = localStorage.getItem('flexicrm-leads')
    const savedContacts = localStorage.getItem('flexicrm-contacts')
    const savedCustomFields = localStorage.getItem('flexicrm-custom-fields')

    if (savedLeads) setLeads(JSON.parse(savedLeads))
    if (savedContacts) setContacts(JSON.parse(savedContacts))
    if (savedCustomFields) setCustomFields(JSON.parse(savedCustomFields))

    // Initialize with sample data if empty
    if (!savedLeads) {
      const sampleLeads = [
        {
          leadId: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          company: 'Tech Corp',
          customFields: {},
          createdAt: new Date().toISOString()
        },
        {
          leadId: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@startup.com',
          phone: '+1 (555) 987-6543',
          company: 'Startup Inc',
          customFields: {},
          createdAt: new Date().toISOString()
        }
      ]
      setLeads(sampleLeads)
    }

    if (!savedContacts) {
      const sampleContacts = [
        {
          contactId: '1',
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice@company.com',
          phone: '+1 (555) 456-7890',
          company: 'Enterprise LLC',
          customFields: {},
          createdAt: new Date().toISOString()
        }
      ]
      setContacts(sampleContacts)
    }

    if (!savedCustomFields) {
      const sampleFields = [
        {
          fieldId: '1',
          fieldName: 'Lead Source',
          fieldType: 'text',
          entityType: 'lead',
          isRequired: false,
          createdAt: new Date().toISOString()
        },
        {
          fieldId: '2',
          fieldName: 'Budget Range',
          fieldType: 'number',
          entityType: 'lead',
          isRequired: false,
          createdAt: new Date().toISOString()
        }
      ]
      setCustomFields(sampleFields)
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('flexicrm-leads', JSON.stringify(leads))
  }, [leads])

  useEffect(() => {
    localStorage.setItem('flexicrm-contacts', JSON.stringify(contacts))
  }, [contacts])

  useEffect(() => {
    localStorage.setItem('flexicrm-custom-fields', JSON.stringify(customFields))
  }, [customFields])

  // CRUD operations for leads
  const addLead = (lead) => {
    const newLead = {
      ...lead,
      leadId: Date.now().toString(),
      customFields: {},
      createdAt: new Date().toISOString()
    }
    setLeads(prev => [...prev, newLead])
    return newLead
  }

  const updateLead = (leadId, updates) => {
    setLeads(prev => prev.map(lead => 
      lead.leadId === leadId ? { ...lead, ...updates } : lead
    ))
  }

  const deleteLead = (leadId) => {
    setLeads(prev => prev.filter(lead => lead.leadId !== leadId))
  }

  // CRUD operations for contacts
  const addContact = (contact) => {
    const newContact = {
      ...contact,
      contactId: Date.now().toString(),
      customFields: {},
      createdAt: new Date().toISOString()
    }
    setContacts(prev => [...prev, newContact])
    return newContact
  }

  const updateContact = (contactId, updates) => {
    setContacts(prev => prev.map(contact => 
      contact.contactId === contactId ? { ...contact, ...updates } : contact
    ))
  }

  const deleteContact = (contactId) => {
    setContacts(prev => prev.filter(contact => contact.contactId !== contactId))
  }

  // CRUD operations for custom fields
  const addCustomField = (field) => {
    const newField = {
      ...field,
      fieldId: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setCustomFields(prev => [...prev, newField])
    return newField
  }

  const updateCustomField = (fieldId, updates) => {
    setCustomFields(prev => prev.map(field => 
      field.fieldId === fieldId ? { ...field, ...updates } : field
    ))
  }

  const deleteCustomField = (fieldId) => {
    setCustomFields(prev => prev.filter(field => field.fieldId !== fieldId))
    
    // Remove field from all leads and contacts
    setLeads(prev => prev.map(lead => ({
      ...lead,
      customFields: Object.fromEntries(
        Object.entries(lead.customFields).filter(([key]) => key !== fieldId)
      )
    })))
    
    setContacts(prev => prev.map(contact => ({
      ...contact,
      customFields: Object.fromEntries(
        Object.entries(contact.customFields).filter(([key]) => key !== fieldId)
      )
    })))
  }

  const getMetrics = () => {
    const totalLeads = leads.length
    const totalContacts = contacts.length
    const totalCustomFields = customFields.length
    const recentLeads = leads.filter(lead => {
      const createdDate = new Date(lead.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return createdDate >= weekAgo
    }).length

    return {
      totalLeads,
      totalContacts,
      totalCustomFields,
      recentLeads
    }
  }

  const value = {
    leads,
    contacts,
    customFields,
    addLead,
    updateLead,
    deleteLead,
    addContact,
    updateContact,
    deleteContact,
    addCustomField,
    updateCustomField,
    deleteCustomField,
    getMetrics
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}