import { Download, Search } from 'lucide-react'

// MVP: Fetch simple list
export default async function LeadsPage() {
    // Use mock for demo
    const leads = [
        { id: '1', name: '山田 太郎', email: 'taro@example.com', role: 'Frontend', exp: '3', status: 'new', date: '2023-10-25 10:00' },
        { id: '2', name: '鈴木 花子', email: 'hanako@example.com', role: 'Backend', exp: '5', status: 'contacted', date: '2023-10-24 15:30' },
        { id: '3', name: '田中 一郎', email: 'ichiro@example.com', role: 'Infra', exp: '10', status: 'interview', date: '2023-10-23 09:15' },
    ]

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Leads Management</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    <Download size={16} /> Export CSV
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input type="text" placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 text-sm focus:border-transparent outline-none" />
                    </div>
                    <select className="px-4 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-primary-500">
                        <option>All Status</option>
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Interview</option>
                        <option>Closed</option>
                    </select>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role / Exp</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                                <td className="px-6 py-4 text-gray-600">{lead.email}</td>
                                <td className="px-6 py-4 text-gray-600">{lead.role} ({lead.exp}y)</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${lead.status === 'new' ? 'bg-green-100 text-green-700' :
                                            lead.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                                                'bg-purple-100 text-purple-700'
                                        }`}>
                                        {lead.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{lead.date}</td>
                                <td className="px-6 py-4">
                                    <button className="text-primary-600 hover:text-primary-800 font-medium">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
                    <span>Showing 3 of 128 results</span>
                    <div className="flex gap-2">
                        <button className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50" disabled>Prev</button>
                        <button className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
