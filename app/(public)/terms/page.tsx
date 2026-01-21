
import Link from 'next/link'

export const metadata = {
    title: '利用規約',
    description: 'FreelanceBoxの利用規約ページです。本サービスの利用条件について定めています。',
}

export default function TermsPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container-custom max-w-4xl">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900">利用規約</h1>

                    <div className="prose prose-gray max-w-none text-gray-600 text-sm leading-relaxed space-y-8">
                        <section>
                            <p>
                                ネクスライド株式会社（以下「当社」といいます。）は、当社が提供するエンジニア向けエージェントサービス「FreelanceBox」（以下「本サービス」といいます。）の利用規約（以下「本規約」といいます。）を以下のとおり定めます。本サービスの利用者（以下「利用者」といいます。）は、本規約の全文をお読みいただき、これに同意した上で利用登録を行うものとします。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第1条（適用）</h2>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>本規約は、利用者と当社との間の本サービスの利用に関わる一切の関係に適用されます。</li>
                                <li>当社は本サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第2条（サービス内容）</h2>
                            <p>
                                本サービスは、フリーランスエンジニアおよび一人法人（以下「エンジニア」といいます。）に対し、当社のパートナー企業または顧客企業（以下「求人企業」といいます。）の案件を紹介し、契約締結を支援するサービスです。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第3条（利用資格・表明保証）</h2>
                            <p>利用者は、本サービスの利用登録にあたり、以下の事項を当社に対し表明し、保証するものとします。</p>
                            <ol className="list-decimal pl-5 space-y-2 mt-2">
                                <li><strong>登録する氏名、住所、連絡先、職務経歴、保有スキル等の全ての情報が、真実かつ正確であり、虚偽や誇張、誤りがないこと。</strong></li>
                                <li><strong>本サービスの利用者が、実際に業務に従事するエンジニア本人であること。代理人、営業担当者、または架空の人物による登録ではないこと。</strong></li>
                                <li>いわゆる「名義貸し」「経歴貸し」や、稼働する意思のない「提案用要員」としての登録ではないこと。</li>
                                <li>現在、他の契約等により本サービスを通じた業務の受託が制限されておらず、稼働が可能であること。</li>
                                <li>反社会的勢力等（暴力団、暴力団員、右翼団体、反社会的勢力、その他これに準ずる者を意味します。）ではなく、資金提供その他を通じて反社会的勢力等の維持、運営に協力もしくは関与する等、反社会的勢力等との何らかの交流もしくは関与を行っていないこと。</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第4条（利用登録の拒否・抹消）</h2>
                            <p>当社は、利用者に以下の事由があると判断した場合、利用登録の申請を承認せず、または事前の通知なくして登録を抹消することができます。</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>前条（表明保証）に違反する事実が判明した場合、またはその疑いがあると当社が判断した場合</li>
                                <li>登録事項の全部または一部につき虚偽、誤記または記載漏れがあった場合</li>
                                <li>過去に本規約に違反したことがある者からの申請である場合</li>
                                <li>SES事業者等の営業担当者による営業目的での登録と判断された場合</li>
                                <li>その他、当社が利用登録を相当でないと判断した場合</li>
                            </ul>
                            <p className="mt-2 text-xs text-gray-500">※当社は、登録拒否および抹消の理由について一切の開示義務を負いません。</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第5条（禁止事項）</h2>
                            <p>利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                            <ol className="list-decimal pl-5 space-y-2 mt-2">
                                <li><strong>虚偽の経歴書、スキルシート、または身分証等を提出する行為</strong></li>
                                <li><strong>他人の名義、架空の名義、または同意を得ていない第三者の名義を使用して登録する行為</strong></li>
                                <li>稼働する意思がないにもかかわらず、リソース確保や市場調査等を目的として登録する行為</li>
                                <li>当社または求人企業の業務を妨害する行為、または信頼を毀損する行為</li>
                                <li>当社を介さずに、本サービスを通じて知り得た求人企業と直接契約を締結する行為（直接取引・中抜き行為）</li>
                                <li>正当な理由なく、面談や契約後の業務開始を拒否、放棄する行為</li>
                                <li>その他、法令、公序良俗に違反する行為、または当社が不適切と判断する行為</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第6条（利用停止・契約解除）</h2>
                            <p>
                                当社は、利用者が本規約のいずれかの条項に違反した場合、または違反するおそれがあると当社が判断した場合、何らの事前通知または催告をすることなく、本サービスの利用停止、登録抹消、および紹介案件に関する契約の解除を行うことができるものとします。これにより利用者に損害が生じた場合でも、当社は一切の責任を負いません。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第7条（損害賠償）</h2>
                            <p>
                                <strong>利用者が本規約に違反し（特に経歴詐称、名義貸し等の不正行為を含みます）、当社または求人企業等の第三者に損害を与えた場合、利用者は、その故意・過失を問わず、当該損害（弁護士費用、信頼回復のために要した費用、逸失利益を含みます。）の全額を賠償する責任を負うものとします。</strong>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第8条（免責事項）</h2>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>当社は、本サービスによる案件紹介の完全性、正確性、有用性等について保証しません。また、利用者が希望する案件との成約を保証するものではありません。</li>
                                <li>当社は、本サービスの利用または利用不能により利用者に生じた損害について、当社の故意または重過失による場合を除き、一切の責任を負わないものとします。</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第9条（規約の変更）</h2>
                            <p>
                                当社は、必要と判断した場合には、利用者に通知することなくいつでも本規約を変更することができるものとします。変更後の規約は、本ウェブサイト上に表示した時点より効力を生じるものとします。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">第10条（準拠法・裁判管轄）</h2>
                            <p>
                                本規約の解釈にあたっては日本法を準拠法とし、本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄裁判所とします。
                            </p>
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
