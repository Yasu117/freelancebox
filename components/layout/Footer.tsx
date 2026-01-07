import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container-custom mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="font-bold text-2xl tracking-tight mb-4 block text-gray-900">
                            Freelance<span className="text-primary-600">Box</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            条件整理から案件提案まで、エージェントが伴走。<br />
                            あなたに最適な案件をご提案します。
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">サービス</h4>
                        <ul className="space-y-2">
                            <li><Link href="/jobs" className="text-gray-600 hover:text-primary-600 text-sm">案件検索</Link></li>
                            <li><Link href="/articles" className="text-gray-600 hover:text-primary-600 text-sm">コラム</Link></li>
                            <li><Link href="/register" className="text-gray-600 hover:text-primary-600 text-sm">無料登録</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">サポート</h4>
                        <ul className="space-y-2">
                            <li><Link href="/privacy" className="text-gray-600 hover:text-primary-600 text-sm">プライバシーポリシー</Link></li>
                            <li><Link href="/terms" className="text-gray-600 hover:text-primary-600 text-sm">利用規約</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">運営会社</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            FreelanceBox事務局<br />
                            東京都渋谷区道玄坂1-1-1<br />
                            info@example.com
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 text-center text-gray-400 text-sm">
                    © {new Date().getFullYear()} FreelanceBox. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
