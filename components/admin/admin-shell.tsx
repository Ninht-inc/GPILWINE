'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Wine, FileText, Users, MapPin, Image as ImageIcon,
  Settings, Mail, FileEdit, Menu, X, LogOut, ChevronDown, ChevronRight,
  MessageSquare, Building2, Bell,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Wines', href: '/admin/wines', icon: Wine },
  {
    label: 'Enquiries', icon: MessageSquare, children: [
      { label: 'Quote Requests', href: '/admin/quotes' },
      { label: 'General Enquiries', href: '/admin/enquiries' },
      { label: 'Distributor Enquiries', href: '/admin/distributor-enquiries' },
    ]
  },
  { label: 'Stockists', href: '/admin/stockists', icon: MapPin },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'FAQs', href: '/admin/faqs', icon: FileText },
  { label: 'Site Content', href: '/admin/site-content', icon: FileEdit },
  { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  { label: 'Email Settings', href: '/admin/email-settings', icon: Mail },
]

export function AdminShell({ children, user }: { children: React.ReactNode; user: { name?: string | null; email: string; role: string } }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Enquiries'])
  const pathname = usePathname()

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label])
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#3B101A] text-[#F4EBDD] transform transition-transform duration-200 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-[#C6A15B]/20">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-display text-[#C6A15B] text-xl font-bold tracking-wider">GPIL</span>
            <span className="text-[#C6A15B]/70 text-[8px] tracking-[0.2em] uppercase">Admin</span>
          </Link>
        </div>

        <nav className="p-3 space-y-0.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {navItems.map((item) => {
            if ('children' in item && item.children) {
              const isExpanded = expandedGroups.includes(item.label)
              const hasActive = item.children.some(c => isActive(c.href))
              return (
                <div key={item.label}>
                  <button onClick={() => toggleGroup(item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      hasActive ? 'text-[#C6A15B]' : 'text-[#F4EBDD]/70 hover:text-[#F4EBDD] hover:bg-white/5'
                    }`}>
                    {item.icon && <item.icon size={18} />}
                    <span className="flex-1 text-left">{item.label}</span>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  {isExpanded && (
                    <div className="ml-8 space-y-0.5 mt-0.5">
                      {item.children.map(child => (
                        <Link key={child.href} href={child.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                            isActive(child.href)
                              ? 'bg-[#C6A15B]/20 text-[#C6A15B]'
                              : 'text-[#F4EBDD]/60 hover:text-[#F4EBDD] hover:bg-white/5'
                          }`}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link key={item.href} href={item.href!}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive(item.href!)
                    ? 'bg-[#C6A15B]/20 text-[#C6A15B]'
                    : 'text-[#F4EBDD]/70 hover:text-[#F4EBDD] hover:bg-white/5'
                }`}>
                {item.icon && <item.icon size={18} />}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#C6A15B]/20">
          <div className="text-xs text-[#F4EBDD]/50 mb-2 truncate">{user.email}</div>
          <button onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-2 text-sm text-[#F4EBDD]/70 hover:text-[#C6A15B] transition-colors">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
            <Menu size={24} />
          </button>
          <div className="flex-1" />
          <Link href="/" target="_blank" className="text-sm text-[#641B2A] hover:underline">View Website →</Link>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
