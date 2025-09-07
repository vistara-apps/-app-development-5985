import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import DataGrid from '../components/DataGrid'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import { Plus, Database } from 'lucide-react'

const Settings = () => {
  const { customFields, addCustomField, updateCustomField, deleteCustomField } = useData()
  const [showModal, setShowModal] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [formData, setFormData] = useState({
    fieldName: '',
    fieldType: 'text',
    entityType: 'lead',
    isRequired: false
  })

  const fieldTypeOptions = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' }
  ]

  const entityTypeOptions = [
    { value: 'lead', label: 'Lead' },
    { value: 'contact', label: 'Contact' }
  ]

  const columns = [
    {
      key: 'fieldName',
      header: 'Field Name'
    },
    {
      key: 'fieldType',
      header: 'Type',
      render: (field) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
          {field.fieldType}
        </span>
      )
    },
    {
      key: 'entityType',
      header: 'Entity',
      render: (field) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
          {field.entityType}
        </span>
      )
    },
    {
      key: 'isRequired',
      header: 'Required',
      render: (field) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          field.isRequired 
            ? 'bg-red-100 text-red-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {field.isRequired ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (field) => new Date(field.createdAt).toLocaleDateString()
    }
  ]

  const handleAdd = () => {
    setEditingField(null)
    setFormData({
      fieldName: '',
      fieldType: 'text',
      entityType: 'lead',
      isRequired: false
    })
    setShowModal(true)
  }

  const handleEdit = (field) => {
    setEditingField(field)
    setFormData({
      fieldName: field.fieldName,
      fieldType: field.fieldType,
      entityType: field.entityType,
      isRequired: field.isRequired
    })
    setShowModal(true)
  }

  const handleDelete = (field) => {
    if (window.confirm('Are you sure you want to delete this custom field? This will remove the field from all existing records.')) {
      deleteCustomField(field.fieldId)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingField) {
      updateCustomField(editingField.fieldId, formData)
    } else {
      addCustomField(formData)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure custom fields to tailor your CRM to your business needs.</p>
      </div>

      {/* Custom Fields Section */}
      <div className="bg-surface rounded-lg shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Database className="h-6 w-6 text-primary mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Custom Fields</h2>
              <p className="text-sm text-gray-600">Add custom fields to capture specific data for your business</p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Field
          </button>
        </div>

        <DataGrid
          data={customFields}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Field Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Lead Fields</span>
              <span className="font-medium">
                {customFields.filter(f => f.entityType === 'lead').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Contact Fields</span>
              <span className="font-medium">
                {customFields.filter(f => f.entityType === 'contact').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Types</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Text Fields</span>
              <span className="font-medium">
                {customFields.filter(f => f.fieldType === 'text').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Number Fields</span>
              <span className="font-medium">
                {customFields.filter(f => f.fieldType === 'number').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Date Fields</span>
              <span className="font-medium">
                {customFields.filter(f => f.fieldType === 'date').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Requirements</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Required Fields</span>
              <span className="font-medium">
                {customFields.filter(f => f.isRequired).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Optional Fields</span>
              <span className="font-medium">
                {customFields.filter(f => !f.isRequired).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingField ? 'Edit Custom Field' : 'Add Custom Field'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Field Name"
            name="fieldName"
            value={formData.fieldName}
            onChange={handleInputChange}
            placeholder="e.g., Lead Source, Budget Range"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Field Type"
              name="fieldType"
              type="select"
              value={formData.fieldType}
              onChange={handleInputChange}
              options={fieldTypeOptions}
              required
            />

            <FormField
              label="Entity Type"
              name="entityType"
              type="select"
              value={formData.entityType}
              onChange={handleInputChange}
              options={entityTypeOptions}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="isRequired"
              name="isRequired"
              type="checkbox"
              checked={formData.isRequired}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="isRequired" className="ml-2 block text-sm text-gray-900">
              Make this field required
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
              {editingField ? 'Update Field' : 'Add Field'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Settings