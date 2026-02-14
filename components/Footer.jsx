'use client'

import Link from 'next/link'
import { Linkedin, Github, Globe, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white py-4 w-full">
      <div className="w-full px-4 text-center text-sm text-gray-500">
        <p className="whitespace-nowrap overflow-x-auto flex items-center justify-center gap-2 flex-wrap">
          Kome Buang Kita Kutip – Community Waste Utility
          {' · '}
          <Link href="/about" className="text-primary hover:underline">
            Story
          </Link>
          {' · '}
          <Link href="/instructions" className="text-primary hover:underline">
            Instructions
          </Link>
          {' · '}
          <Link href="/solutions" className="text-primary hover:underline">
            Solutions
          </Link>
          {' · '}
          <Link href="/plans" className="text-primary hover:underline">
            Plans
          </Link>
          {' · '}
          <a href="https://www.linkedin.com/in/ashrafhamil/" target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80 inline-flex" aria-label="LinkedIn">
            <Linkedin className="w-4 h-4" />
          </a>
          {' · '}
          <a href="https://github.com/ashrafhamil" target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80 inline-flex" aria-label="GitHub">
            <Github className="w-4 h-4" />
          </a>
          {' · '}
          <a href="https://ashrafhamil.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80 inline-flex" aria-label="Portfolio">
            <Globe className="w-4 h-4" />
          </a>
          {' · '}
          <a href="https://www.youtube.com/watch?v=xMHJGd3wwZk&list=RDxMHJGd3wwZk&start_radio=1" target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80 inline-flex" aria-label="YouTube">
            <Youtube className="w-4 h-4" />
          </a>
        </p>
      </div>
    </footer>
  )
}
