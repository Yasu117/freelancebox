import Link from 'next/link'
import { LayoutDashboard, Briefcase, FileText, Users, LogOut } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-lg z-10">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">Admin Console</h1>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="/admin/jobs" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <Briefcase size={20} /> Jobs
                    </Link>
                    <Link href="/admin/articles" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <FileText size={20} /> Articles
                    </Link>
                    <Link href="/admin/leads" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <Users size={20} /> Leads
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <button className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors font-medium">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    )
}
