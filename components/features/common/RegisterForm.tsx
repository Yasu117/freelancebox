'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RecommendedJobs } from './RecommendedJobs'

function RegisterFormContent() {
    const searchParams = useSearchParams()
    const jobCode = searchParams.get('job_code')
    const [additionalJobs, setAdditionalJobs] = useState<string[]>([])

    // Force scroll to top on mount to fix scroll position issue on navigation
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [birthYear, setBirthYear] = useState('')
    const [birthMonth, setBirthMonth] = useState('')
    const [birthDay, setBirthDay] = useState('')

    return (
        <form action="https://ssgform.com/s/4Ey5ylEYDe33" method="post">
            {/* Hidden Fields */}
            {jobCode && <input type="hidden" name="案件ID" value={jobCode} />}
            <input type="hidden" name="同時エントリー案件" value={additionalJobs.join(', ')} />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">

                {/* Right Column (Job Info & Recommendations) - Moved to top on mobile for better context */}
                <div className="md:col-span-5 space-y-4 order-1 md:order-2">
                    {/* Display message if applying for specific job */}
                    {jobCode && (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <p className="text-sm font-bold text-blue-800 mb-0.5">
                                エントリー案件ID: {jobCode}
                            </p>
                            <p className="text-xs text-blue-600">
                                この案件について問い合わせ・応募を行います。
                            </p>
                        </div>
                    )}

                    {/* Recommended Similar Jobs Panel */}
                    <RecommendedJobs
                        currentJobCode={jobCode}
                        onSelectionChange={setAdditionalJobs}
                    />
                </div>

                {/* Left Column (Input Fields) */}
                <div className="md:col-span-7 space-y-4 order-2 md:order-1">

                    {/* Name */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <label className="text-sm font-bold text-gray-700">姓</label>
                                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">必須</span>
                            </div>
                            <input name="姓" required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm" placeholder="山田" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <label className="text-sm font-bold text-gray-700">名</label>
                                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">必須</span>
                            </div>
                            <input name="名" required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm" placeholder="太郎" />
                        </div>
                    </div>

                    {/* Kana */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <label className="text-sm font-bold text-gray-700">セイ</label>
                                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">必須</span>
                            </div>
                            <input name="セイ" required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm" placeholder="ヤマダ" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <label className="text-sm font-bold text-gray-700">メイ</label>
                                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">必須</span>
                            </div>
                            <input name="メイ" required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm" placeholder="タロウ" />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <label className="text-sm font-bold text-gray-700">メールアドレス</label>
                            <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">必須</span>
                        </div>
                        <input name="メールアドレス" type="email" required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm" placeholder="example@freelancebox.jp" />
                    </div>

                    {/* Phone */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <label className="text-sm font-bold text-gray-700">電話番号</label>
                            <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">必須</span>
                        </div>
                        <input name="電話番号" type="tel" required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm" placeholder="09012345678" />
                    </div>


                    {/* Birthday */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <label className="text-sm font-bold text-gray-700">生年月日</label>
                            <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">必須</span>
                        </div>
                        {/* Hidden input for form submission */}
                        <input
                            type="hidden"
                            name="生年月日"
                            value={birthYear && birthMonth && birthDay ? `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}` : ''}
                        />

                        <div className="flex gap-2">
                            <div className="relative flex-grow">
                                <input
                                    type="number"
                                    className="w-full px-3 py-2.5 pr-8 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm appearance-none bg-white no-spinner"
                                    required
                                    placeholder="1990"
                                    min="1900"
                                    max="2100"
                                    value={birthYear}
                                    onChange={(e) => setBirthYear(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500 text-xs bg-gray-50 border-l border-gray-300 rounded-r-lg">年</div>
                            </div>
                            <div className="relative flex-grow">
                                <input
                                    type="number"
                                    className="w-full px-3 py-2.5 pr-8 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm appearance-none bg-white no-spinner"
                                    required
                                    placeholder="01"
                                    min="1"
                                    max="12"
                                    value={birthMonth}
                                    onChange={(e) => setBirthMonth(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500 text-xs bg-gray-50 border-l border-gray-300 rounded-r-lg">月</div>
                            </div>
                            <div className="relative flex-grow">
                                <input
                                    type="number"
                                    className="w-full px-3 py-2.5 pr-8 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm appearance-none bg-white no-spinner"
                                    required
                                    placeholder="01"
                                    min="1"
                                    max="31"
                                    value={birthDay}
                                    onChange={(e) => setBirthDay(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500 text-xs bg-gray-50 border-l border-gray-300 rounded-r-lg">日</div>
                            </div>
                        </div>
                    </div>

                    {/* Agreements */}
                    <div className="pt-2 space-y-3">
                        <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
                            <input type="checkbox" name="利用規約同意" required className="mt-0.5 w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                            <div className="text-xs text-gray-700 font-bold leading-relaxed">
                                <a href="/terms" target="_blank" className="underline hover:text-primary-600">利用規約</a>
                                ・
                                <a href="/privacy" target="_blank" className="underline hover:text-primary-600">個人情報の取扱い</a>
                                に同意します。
                                <span className="ml-2 text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full align-middle">必須</span>
                            </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group px-1">
                            <input type="checkbox" name="メルマガ購読" defaultChecked className="mt-0.5 w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                            <span className="text-xs text-gray-700 group-hover:text-gray-900 transition-colors font-bold">
                                案件情報や広告を含むご案内のメールを受け取る
                            </span>
                        </label>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="btn-primary w-full py-3.5 font-bold text-lg shadow-lg hover:shadow-xl transition-all rounded-lg">
                            会員登録する
                        </button>
                        <p className="text-[10px] text-center text-gray-400 mt-3">
                            このサイトはreCAPTCHAによって保護されており、Googleのプライバシーポリシーと利用規約が適用されます。
                        </p>
                    </div>
                </div>
            </div>
        </form>
    )
}

export function RegisterForm() {
    return (
        <Suspense fallback={<div>Loading form...</div>}>
            <RegisterFormContent />
        </Suspense>
    )
}
