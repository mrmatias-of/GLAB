'use client'

import { useTenant, useTenantBranding } from '@/lib/hooks/use-tenant'
import { useState } from 'react'
import { useParams } from 'next/navigation'

interface BrandingFormData {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  theme: 'dark' | 'light'
  logoUrl?: string
}

export default function BrandingSettingsPage() {
  const { tenant } = useTenant()
  const branding = useTenantBranding()
  const params = useParams()
  const tenantSlug = params.tenantSlug as string

  const [formData, setFormData] = useState<BrandingFormData>({
    primaryColor: branding.primaryColor,
    secondaryColor: branding.secondaryColor,
    accentColor: branding.accentColor,
    backgroundColor: branding.backgroundColor,
    textColor: branding.textColor,
    theme: branding.theme,
    logoUrl: branding.logoUrl,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleColorChange = (key: keyof BrandingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleThemeChange = (theme: 'dark' | 'light') => {
    setFormData(prev => ({
      ...prev,
      theme,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch(
        `/api/tenant/${tenantSlug}/branding`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update branding')
      }

      setMessage({
        type: 'success',
        text: 'Branding updated successfully!',
      })

      // Reload page to see changes
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save branding',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Branding Settings</h1>
          <p className="text-slate-400 mt-2">Customize your workspace appearance</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded ${
              message.type === 'success'
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-red-500/20 text-red-400 border border-red-500/50'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Color Section */}
          <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Colors</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={e => handleColorChange('primaryColor', e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={e => handleColorChange('primaryColor', e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Used for main buttons and accents</p>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Secondary Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={e => handleColorChange('secondaryColor', e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={e => handleColorChange('secondaryColor', e.target.value)}
                    placeholder="#06B6D4"
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Used for highlights and links</p>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Accent Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={e => handleColorChange('accentColor', e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.accentColor}
                    onChange={e => handleColorChange('accentColor', e.target.value)}
                    placeholder="#10B981"
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Used for success states</p>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Background Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={formData.backgroundColor}
                    onChange={e => handleColorChange('backgroundColor', e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={e => handleColorChange('backgroundColor', e.target.value)}
                    placeholder="#0B0F19"
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Main background color</p>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Text Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={formData.textColor}
                    onChange={e => handleColorChange('textColor', e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.textColor}
                    onChange={e => handleColorChange('textColor', e.target.value)}
                    placeholder="#F1F5F9"
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Primary text color</p>
              </div>
            </div>
          </div>

          {/* Theme Section */}
          <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Theme</h2>

            <div className="flex gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={formData.theme === 'dark'}
                  onChange={() => handleThemeChange('dark')}
                  className="w-4 h-4"
                />
                <span className="text-slate-300">Dark</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={formData.theme === 'light'}
                  onChange={() => handleThemeChange('light')}
                  className="w-4 h-4"
                />
                <span className="text-slate-300">Light</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Preview</h2>

            <div
              className="p-6 rounded-lg border-2"
              style={{
                backgroundColor: formData.backgroundColor,
                borderColor: formData.primaryColor,
                color: formData.textColor,
              }}
            >
              <h3 style={{ color: formData.primaryColor }} className="text-lg font-bold mb-4">
                This is your primary color
              </h3>
              <p className="mb-4">This is your text color. It looks great, right?</p>
              <div className="flex gap-3">
                <button
                  style={{ backgroundColor: formData.primaryColor }}
                  className="px-4 py-2 rounded font-medium"
                >
                  Primary Button
                </button>
                <button
                  style={{ backgroundColor: formData.accentColor }}
                  className="px-4 py-2 rounded font-medium"
                >
                  Accent Button
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="reset"
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-slate-700 text-slate-100 rounded font-medium hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
