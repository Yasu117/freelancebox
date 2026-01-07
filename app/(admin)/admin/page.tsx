import { Users, Briefcase, FileText, Eye } from 'lucide-react'

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-8 text-gray-800">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Leads" value="128" icon={<Users className="text-blue-600" />} trend="+12%" />
                <StatCard title="Active Jobs" value="45" icon={<Briefcase className="text-emerald-600" />} trend="+3" />
                <StatCard title="Published Articles" value="12" icon={<FileText className="text-purple-600" />} trend="+1" />
                <StatCard title="Total Views" value="45.2k" icon={<Eye className="text-orange-600" />} trend="+8%" />
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="font-bold mb-6 text-gray-800">Recent Leads</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                <th className="pb-3 pl-2 font-medium">Name</th>
                                <th className="pb-3 font-medium">Role</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-2 font-medium text-gray-900">山田 太郎</td>
                                <td className="py-4 text-gray-600">Frontend Engineer</td>
                                <td className="py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">New</span></td>
                                <td className="py-4 text-gray-500">2 mins ago</td>
                            </tr>
                            <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-2 font-medium text-gray-900">鈴木 花子</td>
                                <td className="py-4 text-gray-600">Backend Engineer</td>
                                <td className="py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">Contacted</span></td>
                                <td className="py-4 text-gray-500">2 hours ago</td>
                            </tr>
                            <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-2 font-medium text-gray-900">佐藤 健</td>
                                <td className="py-4 text-gray-600">PM</td>
                                <td className="py-4"><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">Closed</span></td>
                                <td className="py-4 text-gray-500">1 day ago</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-center">
                    <a href="/admin/leads" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all leads</a>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{trend}</span>
            </div>
            <div className="text-gray-500 text-sm mb-1">{title}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
    )
}
