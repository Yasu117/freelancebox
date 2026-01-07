import { RegisterForm } from '@/components/features/common/RegisterForm'

export default function RegisterPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 md:py-20">
            <div className="container-custom max-w-xl">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">無料登録・相談</h1>
                    <p className="text-gray-500 text-center mb-10">
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
