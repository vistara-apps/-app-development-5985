import React from 'react'
import { useData } from '../contexts/DataContext'
import MetricCard from '../components/MetricCard'
import { Users, UserPlus, Settings, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const { leads, contacts, customFields, getMetrics } = useData()
  const metrics = getMetrics()

  const recentLeads = leads
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const recentContacts = contacts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your CRM.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value={metrics.totalLeads}
          icon={UserPlus}
          color="primary"
          trend="+12% from last month"
        />
        <MetricCard
          title="Total Contacts"
          value={metrics.totalContacts}
          icon={Users}
          color="accent"
          trend="+8% from last month"
        />
        <MetricCard
          title="Custom Fields"
          value={metrics.totalCustomFields}
          icon={Settings}
          color="purple"
          trend="Active fields"
        />
        <MetricCard
          title="New This Week"
          value={metrics.recentLeads}
          icon={TrendingUp}
          color="success"
          trend="New leads added"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-surface rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leads</h3>
          <div className="space-y-3">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div key={lead.leadId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {lead.firstName} {lead.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{lead.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No leads yet</p>
            )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-surface rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Contacts</h3>
          <div className="space-y-3">
            {recentContacts.length > 0 ? (
              recentContacts.map((contact) => (
                <div key={contact.contactId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{contact.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No contacts yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Custom Fields Overview */}
      <div className="bg-surface rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Fields Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {customFields.filter(f => f.entityType === 'lead').length}
            </p>
            <p className="text-sm text-gray-600">Lead Fields</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {customFields.filter(f => f.entityType === 'contact').length}
            </p>
            <p className="text-sm text-gray-600">Contact Fields</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {customFields.filter(f => f.isRequired).length}
            </p>
            <p className="text-sm text-gray-600">Required Fields</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard