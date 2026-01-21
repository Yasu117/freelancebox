import { RegisterForm } from '@/components/features/common/RegisterForm'

export default function RegisterPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-6 md:py-10">
            <div className="container-custom max-w-5xl">
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-100">
                    <h1 className="text-xl md:text-2xl font-bold text-center mb-2">無料登録・相談</h1>
                    <p className="text-sm text-gray-500 text-center mb-6">
                        まずはあなたの希望をお聞かせください。<br className="hidden md:block" />
                        専任コンサルタントが最適な案件をご提案します。
                    </p>

                    <RegisterForm />
                </div>

                <div className="mt-8 text-center">
                    <div className="text-sm text-gray-500">
                        <span className="font-bold">安心のサポート</span><br />
                        無理な勧誘は一切行いません。ご自身のペースで活動いただけます。
                    </div>
                </div>
            </div>
        </div>
    )
}
