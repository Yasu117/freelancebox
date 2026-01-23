'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
                }`}
        >
            <div className="container-custom mx-auto">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    <Link href="/" className="font-bold text-2xl tracking-tight text-gray-900 flex items-center gap-2">
                        <img src="/icon.png" alt="FreelanceBox Logo" className="w-8 h-8 object-contain" />
                        <span>Freelance<span className="text-primary-600">Box</span></span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/jobs" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                            案件を探す
                        </Link>
                        <Link href="/articles" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                            お役立ちコラム
                        </Link>
                        {/* <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              サービスの特徴
            </Link> */}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">                        <Link href="/register" className="btn-primary text-sm px-5 py-2.5">
                        無料登録・相談
                    </Link>
                    </div>

                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg p-4 flex flex-col gap-4">
                    <Link href="/jobs" className="text-base font-medium text-gray-700 py-2" onClick={() => setMobileMenuOpen(false)}>
                        案件を探す
                    </Link>
                    <Link href="/articles" className="text-base font-medium text-gray-700 py-2" onClick={() => setMobileMenuOpen(false)}>
                        お役立ちコラム
                    </Link>
                    <div className="h-px bg-gray-100 my-1"></div>                    <Link href="/register" className="btn-primary w-full text-center py-3" onClick={() => setMobileMenuOpen(false)}>
                        無料登録・相談
                    </Link>
                </div>
            )}
        </header>
    )
}
