export interface Article {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    content: string | null;
    thumbnail_url: string | null;
    category: string | null;
    tags: string[] | null;
    faq: { question: string; answer: string }[] | null;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    created_at: string;
    updated_at: string;
}
