
import Link from 'next/link'

export const metadata = {
    title: 'プライバシーポリシー',
    description: 'FreelanceBoxのプライバシーポリシー（個人情報保護方針）ページです。',
}

export default function PrivacyPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container-custom max-w-4xl">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900">プライバシーポリシー</h1>

                    <div className="prose prose-gray max-w-none text-gray-600 text-sm leading-relaxed space-y-8">
                        <section>
                            <p>
                                ネクスライド株式会社（以下「当社」といいます。）は、当社の提供するエンジニア向けエージェントサービス「FreelanceBox」（以下「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第1条（個人情報）</h2>
                            <p>
                                「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別符号）を指します。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第2条（個人情報の収集方法）</h2>
                            <p>
                                当社は、ユーザーが本サービスに利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレス、職務経歴、スキル情報などの個人情報をお尋ねすることがあります。<strong>また、登録内容の真実性を確認するため、公的身分証明書、資格証明書、過去の契約書等の写しの提出を求める場合や、公開情報等との照合を行う場合があります。</strong>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第3条（個人情報を収集・利用する目的）</h2>
                            <p>当社が個人情報を収集・利用する目的は、以下のとおりです。</p>
                            <ol className="list-decimal pl-5 space-y-2 mt-2">
                                <li>本サービスの提供・運営（案件紹介、契約締結支援等）のため</li>
                                <li>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
                                <li><strong>登録された職務経歴やスキル情報の真実性、正確性を確認し、適切な案件マッチングを行うため</strong></li>
                                <li><strong>利用規約に違反する行為（経歴詐称、名義貸し、重複登録等）の調査、検知、防止、及び対応のため</strong></li>
                                <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
                                <li>案件のマッチング及び紹介のため、求人企業（紹介先企業）に対して、スキルシートその他の情報を提供するため（詳細は第5条参照）</li>
                                <li>当社が提供する他のサービスの案内のメールを送付するため</li>
                                <li>上記の利用目的に付随する目的</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第4条（利用目的の変更）</h2>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>当社は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。</li>
                                <li>利用目的の変更を行った場合には、変更後の目的について、当社所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第5条（個人情報の第三者提供）</h2>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>
                                    当社は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                        <li><strong>案件の紹介または参画のために、求人企業に対して職務経歴書、スキルシート等を提供する場合。なお、面談等の選考プロセスに進むまでは、原則として氏名等の個人特定情報を秘匿した状態で提供しますが、選考状況により開示が必要となる場合があります。</strong></li>
                                        <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                                        <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                                        <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>前項にかかわらず、ユーザーが利用規約に違反し、または不正行為（経歴詐称、名義貸し等）を行った疑いがある場合、当社は、被害の拡大防止、事実関係の調査、または契約上の権利行使のために必要な範囲で、関係する求人企業、警察機関、弁護士等に対して、当該ユーザーに関する個人情報および登録内容を開示・提供することができるものとします。</strong>
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第6条（個人情報の開示）</h2>
                            <p>
                                当社は、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより当社の業務（不正調査等を含みます）の適正な実施に著しい支障を及ぼすおそれがある場合、または他の法令に違反することとなる場合は、その全部または一部を開示しないことがあります。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第7条（お問い合わせ窓口）</h2>
                            <p>本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。</p>
                            <div className="bg-gray-50 p-6 md:p-8 rounded-lg mt-4 text-gray-700 leading-loose">
                                <p>住所：東京都港区新橋2丁目20-15-601 新橋駅前ビル1号館 6階 BISTATION</p>
                                <p>社名：ネクスライド株式会社</p>
                                <p>担当部署：個人情報保護管理担当</p>
                                <p>Eメールアドレス：<a href="mailto:info@nexride.co.jp" className="text-primary-600 underline">info@nexride.co.jp</a></p>
                            </div>
                        </section>

                        <div className="mt-12 pt-8 border-t text-right text-gray-500">
                            <p>2026年1月20日 改定</p>
                        </div>
                    </div>

                    <div className="mt-10 text-center">
                        <Link href="/" className="text-primary-600 hover:underline font-bold">
                            トップページへ戻る
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
