'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import toast from 'react-hot-toast'

interface Announcement {
  _id: string
  title: string
  content: string
  createdAt: string
  isPublished: boolean
  priority?: string
}

export default function AnnouncementManagement() {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Announcement | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    isPublished: true,
    priority: 'normal'
  })
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchAnnouncements()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/teacher/announcements', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(data.announcements || [])
      } else {
        toast.error('Failed to fetch announcements')
      }
    } catch (err) {
      toast.error('Failed to fetch announcements')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (a: Announcement) => {
    setEditing(a)
    setEditForm({
      title: a.title,
      content: a.content,
      isPublished: a.isPublished,
      priority: a.priority || 'normal'
    })
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleEditCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.checked })
  }

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/announcements/${editing._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })
      if (res.ok) {
        toast.success('Announcement updated')
        setEditing(null)
        fetchAnnouncements()
      } else {
        const err = await res.json()
        toast.error(err.message || 'Failed to update')
      }
    } catch {
      toast.error('Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return
    setDeletingId(id)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        toast.success('Announcement deleted')
        setAnnouncements(prev => prev.filter(a => a._id !== id))
      } else {
        const err = await res.json()
        toast.error(err.message || 'Failed to delete')
      }
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading announcements...</div>
  }

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-4">Announcements</h2>
      <div className="space-y-4">
        {announcements.length === 0 && <div>No announcements yet.</div>}
        {announcements.map(a => (
          <div key={a._id} className="bg-white border rounded p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-gray-600">{a.content}</p>
              <p className="text-xs text-gray-500 mt-1">Published: {a.isPublished ? 'Yes' : 'No'} | {new Date(a.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex items-center space-x-2 mt-3 md:mt-0">
              <button
                onClick={() => handleEdit(a)}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(a._id)}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                disabled={deletingId === a._id}
              >
                {deletingId === a._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleEditSave}
            className="bg-white rounded shadow-lg w-full max-w-md p-6 relative"
          >
            <h3 className="text-lg font-bold mb-4">Edit Announcement</h3>
            <label className="block mb-2 font-medium">Title</label>
            <input
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              className="w-full border rounded p-2 mb-3"
              required
            />
            <label className="block mb-2 font-medium">Content</label>
            <textarea
              name="content"
              value={editForm.content}
              onChange={handleEditChange}
              className="w-full border rounded p-2 mb-3"
              rows={4}
              required
            />
            <label className="block mb-2 font-medium">Priority</label>
            <select
              name="priority"
              value={editForm.priority}
              onChange={handleEditChange}
              className="w-full border rounded p-2 mb-3"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                name="isPublished"
                checked={!!editForm.isPublished}
                onChange={handleEditCheckbox}
                className="mr-2"
              />
              Published
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}