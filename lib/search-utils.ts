/**
 * 検索キーワードの正規化とバリエーション生成を行うユーティリティ
 */

/**
 * 全角英数字・記号を半角に変換する
 */
export function normalizeWidth(str: string): string {
    return str.replace(/[！-～]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    }).replace(/　/g, ' '); // 全角スペースを半角に
}

/**
 * ひらがなをカタカナに変換する
 */
export function hiraganaToKatakana(str: string): string {
    return str.replace(/[\u3041-\u3096]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) + 0x60);
    });
}

/**
 * カタカナをひらがなに変換する
 */
export function katakanaToHiragana(str: string): string {
    return str.replace(/[\u30a1-\u30f6]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0x60);
    });
}

/**
 * 検索クエリを解析し、検索用キーワードの配列（グループ）を生成する
 * 
 * 例: "Java ふるりもーと" 
 * => [
 *      ["Java", "java", "JAVA"], // グループ1（どれかにヒットすればOK）
 *      ["ふるりもーと", "フルリモート"] // グループ2（どれかにヒットすればOK）
 *    ]
 * これらを AND 条件で結ぶ
 */
export function parseSearchQuery(query: string): string[][] {
    if (!query) return [];

    // 1. 全角英数・スペースの正規化
    const normalized = normalizeWidth(query);

    // 2. スペースで分割して単語リスト化
    const words = normalized.split(/\s+/).filter(w => w.length > 0);

    // 3. 各単語についてバリエーションを生成
    return words.map(word => {
        const variants = new Set<string>();

        // そのまま追加
        variants.add(word);

        // カタカナ変換（ひらがなの場合）
        const kata = hiraganaToKatakana(word);
        if (kata !== word) variants.add(kata);

        // ひらがな変換（カタカナの場合）
        const hira = katakanaToHiragana(word);
        if (hira !== word) variants.add(hira);

        // ※大文字小文字はPostgreSQLのilikeで吸収できるため、ここでは変換しない

        return Array.from(variants);
    });
}
