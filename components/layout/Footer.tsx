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
                        <p className="text-gray-500 text-sm leading-relaxed mb-4">
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
                        <h4 className="font-bold text-gray-900 mb-4">企業情報</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="https://www.nexride.jp/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 text-sm">
                                    運営会社
                                </a>
                            </li>
                            <li>
                                <a href="https://www.nexride.jp/#contact" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 text-sm">
                                    お問い合わせ
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 text-center text-gray-400 text-sm">
                    © {new Date().getFullYear()} Nexride Inc. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
