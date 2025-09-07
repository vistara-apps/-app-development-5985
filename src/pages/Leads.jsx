import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import DataGrid from '../components/DataGrid'
import Modal from '../components/Modal'
import FormField from '../components/FormField'

const Leads = () => {
  const { leads, customFields, addLead, updateLead, deleteLead } = useData()
  const { canEditField, canViewField } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    customFields: {}
  })

  const leadCustomFields = customFields.filter(field => field.entityType === 'lead')

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
      key: 'phone',
      header: 'Phone'
    },
    {
      key: 'company',
      header: 'Company'
    }
  ]

  const handleAdd = () => {
    setEditingLead(null)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      customFields: {}
    })
    setShowModal(true)
  }

  const handleEdit = (lead) => {
    setEditingLead(lead)
    setFormData({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      customFields: lead.customFields || {}
    })
    setShowModal(true)
  }

  const handleDelete = (lead) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(lead.leadId)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingLead) {
      updateLead(editingLead.leadId, formData)
    } else {
      addLead(formData)
    }
    
    setShowModal(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCustomFieldChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldId]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
        <p className="text-gray-600 mt-1">Manage your potential customers and prospects.</p>
      </div>

      <DataGrid
        title="All Leads"
        data={leads}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        customFields={customFields}
        entityType="lead"
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingLead ? 'Edit Lead' : 'Add New Lead'}
        size="lg"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <FormField
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
            />
          </div>

          {/* Custom Fields */}
          {leadCustomFields.filter(field => canViewField(field)).length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Custom Fields</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leadCustomFields
                  .filter(field => canViewField(field))
                  .map((field) => (
                    <FormField
                      key={field.fieldId}
                      label={field.fieldName}
                      name={field.fieldId}
                      type={field.fieldType}
                      value={formData.customFields[field.fieldId] || ''}
                      onChange={(e) => handleCustomFieldChange(field.fieldId, e.target.value)}
                      required={field.isRequired}
                      disabled={!canEditField(field)}
                    />
                  ))}
              </div>
            </div>
          )}

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
              {editingLead ? 'Update Lead' : 'Add Lead'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Leads
