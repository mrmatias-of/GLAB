'use client'

import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'
import { useState } from 'react'
import SearchModal from './search-modal'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">G•LAB</Link>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
            <Link href="/cursos" className="text-gray-400 hover:text-white">Cursos</Link>
            <Link href="#" className="text-gray-400 hover:text-white">Sobre</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(true)} className="p-1 text-gray-400 hover:text-white">
              <Search size={20} />
            </button>
            <button onClick={() => setOpen(!open)} className="md:hidden p-1 text-gray-400 hover:text-white">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden border-t border-gray-800 px-5 py-3 space-y-2 text-sm">
            <Link href="/" className="block text-gray-400 hover:text-white py-2">Home</Link>
            <Link href="/cursos" className="block text-gray-400 hover:text-white py-2">Cursos</Link>
            <Link href="#" className="block text-gray-400 hover:text-white py-2">Sobre</Link>
          </nav>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

