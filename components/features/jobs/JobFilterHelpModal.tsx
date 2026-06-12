import { HelpCircle, X } from 'lucide-react'

export function JobFilterHelpModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    検索のルールについて
                </h3>

                <div className="space-y-4 text-sm text-gray-600">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-blue-800 mb-1">キーワード検索</h4>
                        <p>スペースで区切ると、<span className="font-bold text-blue-700">すべてを含む</span>案件を探します（AND検索）。</p>
                        <p className="text-xs text-blue-600 mt-1">例：「Java リモート」→ Javaかつリモートの案件</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h4 className="font-bold text-gray-800 mb-1">同じ種類の条件</h4>
                        <p>同じ種類のタグ（職種・スキルなど）を複数選ぶと、<span className="font-bold text-gray-800">いずれかを含む</span>案件を探します（OR検索）。</p>
                        <p className="text-xs text-gray-500 mt-1">例：「Java」「Python」を選択 → JavaまたはPythonの案件</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h4 className="font-bold text-gray-800 mb-1">異なる種類の条件</h4>
                        <p>異なる種類の条件（職種 × スキルなど）は、<span className="font-bold text-gray-800">掛け合わせ</span>で絞り込みます（AND検索）。</p>
                        <p className="text-xs text-gray-500 mt-1">例：「エンジニア」×「フルリモート」→ 両方を満たす案件</p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors w-full"
                    >
                        理解しました
                    </button>
                </div>
            </div>
        </div>
    )
}
