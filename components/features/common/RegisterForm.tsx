'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function RegisterForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.ok) {
                router.push('/register/thanks')
            } else {
                alert('送信に失敗しました。時間をおいて再度お試しください。')
            }
        } catch (err) {
            console.error(err)
            alert('エラーが発生しました。')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">お名前 <span className="text-red-500">*</span></label>
                <input name="name" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="山田 太郎" />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">メールアドレス <span className="text-red-500">*</span></label>
                <input name="email" type="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="taro@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">希望職種</label>
                    <select name="role_text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white">
                        <option value="">選択してください</option>
                        <option value="frontend">Frontend Engineer</option>
                        <option value="backend">Backend Engineer</option>
                        <option value="infra">Infra / SRE</option>
                        <option value="pm">PM / PMO</option>
                        <option value="other">その他</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">経験年数 (年)</label>
                    <input name="years_of_exp" type="number" min="0" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="3" />
                </div>
            </div>

            <div className="pt-4">
                <button disabled={loading} className="btn-primary w-full py-4 font-bold text-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
                    {loading ? '送信中...' : '無料で登録・相談する'}
                </button>
                <p className="text-xs text-center text-gray-400 mt-4">
                    <a href="/privacy" className="underline hover:text-gray-600">プライバシーポリシー</a>に同意の上、送信してください。
                </p>
            </div>
        </form>
    )
}
