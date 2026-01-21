-- 0. Clean up existing table (RE-RUN safe)
DROP TABLE IF EXISTS public.articles CASCADE;

-- 1. Create articles table
CREATE TABLE public.articles (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    slug text NOT NULL,
    title text NOT NULL,
    description text,
    content text,
    thumbnail_url text,
    category text,
    tags text[],
    faq jsonb DEFAULT '[]'::jsonb,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT articles_pkey PRIMARY KEY (id),
    CONSTRAINT articles_slug_key UNIQUE (slug)
);

-- 2. Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
CREATE POLICY "Public articles are viewable by everyone" 
ON public.articles FOR SELECT 
USING (status = 'published');

CREATE POLICY "Authenticated users can manage articles" 
ON public.articles FOR ALL 
USING (auth.role() = 'authenticated');

-- 4. Create Auto-update Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Create Trigger
DROP TRIGGER IF EXISTS set_updated_at_articles ON public.articles;
CREATE TRIGGER set_updated_at_articles
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 6. Insert Sample Data
INSERT INTO public.articles (slug, title, description, content, category, tags, faq, status, published_at)
VALUES (
    'freelance-java-engineer-salary-2026',
    '【2026年版】フリーランスJavaエンジニアの平均年収と単価相場',
    'フリーランスJavaエンジニアの年収相場、高単価案件を獲得するためのスキルセットを解説。実務経験3年での市場価値や今後の需要についても詳しく紹介します。',
    '## フリーランスJavaエンジニアの現状
Javaは依然として業務系システムの中心であり、需要は堅調です。特に金融系や大規模Webサービスでのリプレイス案件が多く、安定した収入が見込めます。

### 平均単価
- **実務1~2年**: 50~60万円
- **実務3年以上**: 70~80万円
- **PM/PLクラス**: 90万円~

### 高単価を狙うスキル
1. **クラウド経験**: AWS/Azure/GCP環境での開発経験
2. **モダンフレームワーク**: Spring Boot等は必須
3. **上流工程**: 要件定義や基本設計からの参画',
    'Career',
    ARRAY['Java', '年収', 'キャリアパス'],
    '[
        {"question": "Javaエンジニアの平均年収はいくらですか？", "answer": "実務経験3年以上の場合、平均して年収800万円〜1000万円程度が相場となります。"},
        {"question": "未経験からフリーランスになれますか？", "answer": "可能ですが、案件獲得の難易度が高いため、まずは正社員として1〜2年の実務経験を積むことを強く推奨します。"}
    ]'::jsonb,
    'published',
    now()
);
