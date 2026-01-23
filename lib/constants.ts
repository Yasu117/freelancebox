
// 職種データ
export const ROLE_CATEGORIES = [
    {
        name: 'エンジニア',
        items: [
            { label: 'フロントエンドエンジニア', slug: 'frontend-engineer' },
            { label: 'バックエンドエンジニア', slug: 'backend-engineer' },
            { label: 'サーバーサイドエンジニア', slug: 'server-side-engineer' },
            { label: 'アプリエンジニア', slug: 'mobile-app-engineer' },
            { label: 'インフラエンジニア', slug: 'infrastructure-engineer' },
            { label: 'ネットワークエンジニア', slug: 'network-engineer' },
            { label: 'データベースエンジニア', slug: 'database-engineer' },
            { label: 'セキュリティエンジニア', slug: 'security-engineer' },
            { label: '情報システム', slug: 'information-systems' },
            { label: '社内SE', slug: 'internal-se' },
            { label: '汎用機エンジニア', slug: 'mainframe-engineer' },
            { label: 'AIエンジニア', slug: 'ai-engineer' },
            { label: '機械学習エンジニア', slug: 'ml-engineer' },
            { label: 'ブロックチェーンエンジニア', slug: 'blockchain-engineer' },
            { label: 'テクニカルサポート', slug: 'technical-support' },
            { label: '組込・制御エンジニア', slug: 'embedded-engineer' },
            { label: 'システムエンジニア(SE)', slug: 'system-engineer' },
            { label: 'プログラマー(PG)', slug: 'programmer' },
            { label: 'SRE', slug: 'sre' },
            { label: 'クラウドエンジニア', slug: 'cloud-engineer' },
            { label: 'VPoE', slug: 'vpoe' },
            { label: 'エンジニアリングマネージャー', slug: 'engineering-manager' },
            { label: 'コーダー', slug: 'coder' },
            { label: 'CRE', slug: 'cre' },
            { label: 'データサイエンティスト', slug: 'data-scientist' },
            { label: 'DBA', slug: 'dba' },
            { label: 'QAエンジニア', slug: 'qa-engineer' },
            { label: 'デバッガー', slug: 'debugger' },
            { label: 'テスター', slug: 'tester' },
            { label: 'ブリッジSE', slug: 'bridge-se' },
            { label: 'フルスタックエンジニア', slug: 'fullstack-engineer' },
            { label: 'ヘルプデスク', slug: 'helpdesk' },
        ]
    },
    {
        name: 'デザイナー',
        items: [
            { label: 'Webデザイナー', slug: 'web-designer' },
            { label: 'イラストレーター', slug: 'illustrator' },
            { label: 'UI・UXデザイナー', slug: 'ui-ux-designer' },
            { label: 'グラフィックデザイナー', slug: 'graphic-designer' },
            { label: 'キャラクターデザイナー', slug: 'character-designer' },
            { label: '2Dデザイナー', slug: '2d-designer' },
            { label: '3Dデザイナー', slug: '3d-designer' },
            { label: 'アートディレクター', slug: 'art-director' },
            { label: 'エフェクトデザイナー', slug: 'effect-designer' },
            { label: 'アニメーター', slug: 'animator' },
        ]
    },
    {
        name: 'マーケター',
        items: [
            { label: 'Webマーケター', slug: 'web-marketer' },
            { label: 'デジタルマーケター', slug: 'digital-marketer' },
        ]
    },
    {
        name: 'クリエイター',
        items: [
            { label: 'プランナー', slug: 'planner' },
            { label: '動画・映像制作', slug: 'video-creator' },
            { label: '3Dモデラー', slug: '3d-modeler' },
            { label: 'ライター', slug: 'writer' },
            { label: 'シナリオライター', slug: 'scenario-writer' },
            { label: 'ゲームプランナー', slug: 'game-planner' },
        ]
    },
    {
        name: 'PM・ディレクター',
        items: [
            { label: 'プロジェクトマネージャー', slug: 'pm' },
            { label: 'PMO', slug: 'pmo' },
            { label: 'プロダクトマネージャー(PdM)', slug: 'pdm' },
            { label: 'Webディレクター', slug: 'web-director' },
            { label: 'プロデューサー', slug: 'producer' },
            { label: 'ゲームディレクター', slug: 'game-director' },
            { label: '動画ディレクター', slug: 'video-director' },
        ]
    },
    {
        name: 'コンサルタント',
        items: [
            { label: 'ITコンサルタント', slug: 'it-consultant' },
            { label: 'SAPコンサルタント', slug: 'sap-consultant' },
            { label: 'ITアーキテクト', slug: 'it-architect' },
            { label: '戦略系コンサルタント', slug: 'strategy-consultant' },
        ]
    }
]

// スキルデータ
export const SKILL_CATEGORIES = [
    {
        name: '開発言語',
        items: [
            'Java', 'PHP', 'Python', 'Ruby', 'Go言語', 'Scala', 'Perl', 'JavaScript', 'HTML5', 'Swift', 'Objective-C', 'Kotlin', 'Unity', 'Cocos2d-x', 'C言語', 'C#', 'C++', 'VC++', 'C#.NET', 'VB.NET', 'VB', 'VBA', 'SQL', 'PL/SQL', 'R言語', 'COBOL', 'JSON', 'Shell', 'Apex', 'VBScript', 'LISP', 'Haskell', 'Lua', 'XAML', 'Transact-SQL', 'ActionScript', 'CoffeeScript', 'ASP.NET', 'RPG', 'JSP', 'CSS3', 'JCL', 'UML', 'ABAP', 'Sass', 'LESS', 'TypeScript', 'Rust', 'Dart'
        ]
    },
    {
        name: 'フレームワーク',
        items: [
            'Node.js', 'CakePHP', 'Ruby on Rails', 'Spring', 'Django', 'FuelPHP', 'Struts', 'Catalyst', 'Spark', 'JSF', 'JUnit', 'CodeIgniter', 'MyBatis', 'Sinatra', 'iBATIS', 'Symfony', 'Zend Framework', 'Flask', 'Wicket', 'jQuery', 'Seasar2', 'Backbone.js', 'Knockout.js', 'AngularJS', 'Laravel', 'SAStruts', 'MVC', 'intra-mart', 'React', 'Vue.js', 'Bootstrap', 'Phalcon', 'ReactNative', 'SpringBoot', 'PlayFramework', 'Slim', 'Yii', 'Tornado', 'Flutter', 'NuxtJS', 'Tensorflow', 'Pytorch', 'Next.js', 'Angular'
        ]
    },
    {
        name: 'インフラ・ミドルウェア',
        items: [
            'AWS', 'Linux', 'WindowsServer', 'UNIX', 'Microsoft Azure', 'Android', 'Access', 'Oracle', 'Heroku', 'Google Cloud Platform(GCP)', 'ColdFusion', 'Firebase', 'Terraform', 'AWS CloudFormation', 'Kubernetes', 'Cisco', 'Exchange'
        ]
    },
    {
        name: 'その他ツール',
        items: [
            'Photoshop', 'Illustrator', 'SAP', 'Sketch', 'Salesforce', 'JP1', 'WordPress', 'SharePoint', 'Hadoop', 'Zabbix', 'Tableau', 'Delphi', 'Figma', 'SAS', 'Adobe XD', 'CircleCI', 'Datadog', 'kintone', 'Maya', 'After Effects', 'Active Directory', 'ファイヤーウォール', 'Company', 'Adobe Premiere', 'Flash', 'Blender', '3ds Max'
        ]
    }
]

// 働き方マップ
export const WORK_STYLE_MAP: { [key: string]: string } = {
    'フルリモート': 'remote',
    'リモート可（週1〜）': 'hybrid',
    '常駐（Plus10）': 'onsite'
}

// 金額オプション
export const PRICE_OPTIONS = [
    { label: '指定なし', value: '' },
    { label: '30万円', value: '300000' },
    { label: '40万円', value: '400000' },
    { label: '50万円', value: '500000' },
    { label: '60万円', value: '600000' },
    { label: '70万円', value: '700000' },
    { label: '80万円', value: '800000' },
    { label: '90万円', value: '900000' },
    { label: '100万円', value: '1000000' },
    { label: '120万円', value: '1200000' },
    { label: '150万円', value: '1500000' },
    { label: '200万円', value: '2000000' },
]

// 条件マップ (検索用)
export const CONDITIONS = [
    { label: 'フルリモート', query: 'remote', type: 'work_style' },
    { label: 'リモート可', query: 'hybrid', type: 'work_style' },
    { label: '週3日〜', query: 'Week3', type: 'keyword' },
    { label: '高単価(80万〜)', query: '800000', type: 'min_price' },
    { label: '長期案件', query: '長期', type: 'keyword' },
    { label: 'リーダー経験', query: 'リーダー', type: 'keyword' },
    { label: '服装自由', query: '服装自由', type: 'keyword' },
    { label: '英語力を活かす', query: '英語', type: 'keyword' },
    { label: '40代活躍中', query: '40代', type: 'keyword' },
    { label: '50代活躍中', query: '50代', type: 'keyword' },
]
