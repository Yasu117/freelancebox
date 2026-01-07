import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function ThanksPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-20 flex items-center justify-center">
            <div className="container-custom max-w-lg text-center">
                <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex justify-center mb-6">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">登録を受け付けました</h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        ご登録ありがとうございます。<br />
                        内容を確認の上、担当コンサルタントより2営業日以内にご連絡させていただきます。
                    </p>

                    <Link href="/" className="btn-primary w-full py-4 block text-center">
                        トップページへ戻る
                    </Link>
                </div>
            </div>
        </div>
    )
}
