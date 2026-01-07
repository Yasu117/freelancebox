const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- Helper Functions ---

function generateUUID() {
    return crypto.randomUUID();
}

function parseCSV(content) {
    const lines = [];
    let currentLine = [];
    let currentField = '';
    let inQuote = false;

    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const nextChar = content[i + 1];

        if (char === '"') {
            if (inQuote && nextChar === '"') {
                currentField += '"';
                i++; // Skip next quote
            } else {
                inQuote = !inQuote;
            }
        } else if (char === ',' && !inQuote) {
            currentLine.push(currentField.trim());
            currentField = '';
        } else if ((char === '\r' || char === '\n') && !inQuote) {
            if (currentField || currentLine.length > 0) {
                currentLine.push(currentField.trim());
                lines.push(currentLine);
            }
            currentLine = [];
            currentField = '';
            if (char === '\r' && nextChar === '\n') i++;
        } else {
            currentField += char;
        }
    }
    if (currentField || currentLine.length > 0) {
        currentLine.push(currentField.trim());
        lines.push(currentLine);
    }
    return lines;
}

// --- Mappings & Constants ---

const ROLES_MAP = {
    'frontend': { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Frontend Engineer', keywords: ['Frontend', 'React', 'Vue', 'Angular', 'Next.js', 'Typescript', 'HTML', 'CSS'] },
    'backend': { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', name: 'Backend Engineer', keywords: ['Backend', 'Java', 'PHP', 'Python', 'Go', 'Ruby', 'Node.js', 'Laravel', 'Spring'] },
    'fullstack': { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', name: 'Fullstack Engineer', keywords: ['Fullstack', 'フルスタック'] },
    'sre': { id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', name: 'SRE / Infrastructure', keywords: ['SRE', 'Infrastructure', 'AWS', 'Azure', 'GCP', 'Linux', 'Network', 'Server', 'ネットワーク', 'サーバー', 'インフラ'] },
    'pm': { id: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', name: 'Project Manager', keywords: ['PM', 'Project Manager', 'Director', 'PMO', 'マネージャー', 'リーダー'] }
};

const LOCATIONS_MAP = {
    'tokyo': { id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', name: '東京', region: '関東', keywords: ['東京', '渋谷', '新宿', '六本木', '品川', '丸の内', '大手町', '西葛西', '神谷町', '飯田橋', '東中野', '勝どき', '浜松町', '秋葉原', '大崎', '吉祥寺', '日本大通り', '多摩', '池袋'] },
    'kanagawa': { id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', name: '神奈川', region: '関東', keywords: ['神奈川', '横浜', '川崎', '武蔵小杉'] },
    'osaka': { id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', name: '大阪', region: '関西', keywords: ['大阪', '梅田', '難波'] },
    'remote': { id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', name: 'フルリモート', region: '全国', keywords: ['フルリモート'] }
};

const SKILLS_CACHE = {}; // name -> uuid

// --- Main Parsing Logic ---

const csvPath = path.join(process.cwd(), 'Tech@DB - to FB.csv');
const rawContent = fs.readFileSync(csvPath, 'utf8');
const rows = parseCSV(rawContent);

// Remove header
const header = rows.shift(); // ["技術スキル", "その他特徴", "金額", "要約"]

// Prepare Data Containers
const jobsData = [];
const allSkills = new Set();
const articleData = []; // Can create dummy articles too

// Process Rows
rows.forEach((row, index) => {
    if (row.length < 4) return;

    const [techSkillsRaw, otherFeatures, priceRaw, summaryRaw] = row;

    // 1. Parse Skills
    const skillNames = techSkillsRaw
        .split(/[,、]/)
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.includes('期間') && !s.includes('場所')); // Simple filtering

    skillNames.forEach(s => allSkills.add(s));

    // 2. Parse Role
    let roleId = ROLES_MAP['backend'].id; // Default
    let roleFound = false;
    const combinedText = (techSkillsRaw + ' ' + otherFeatures + ' ' + summaryRaw).toLowerCase();

    for (const key in ROLES_MAP) {
        if (roleFound) break;
        const role = ROLES_MAP[key];
        for (const kw of role.keywords) {
            if (combinedText.includes(kw.toLowerCase())) {
                roleId = role.id;
                roleFound = true; // Simple first-match wins
                break;
            }
        }
    }

    // 3. Parse Price
    let minPrice = null;
    let maxPrice = null;

    const priceText = priceRaw.replace(/,/g, '');
    const priceMatch = priceText.match(/(\d+)/g);
    if (priceMatch) {
        if (priceMatch.length === 1) {
            const val = parseInt(priceMatch[0]);
            if (priceText.includes('〜') || priceText.includes('~')) {
                if (priceText.startsWith('~') || priceText.startsWith('〜')) {
                    maxPrice = val;
                    minPrice = val - 10; // Guess
                } else {
                    minPrice = val;
                    maxPrice = val + 10; // Guess
                }
            } else {
                minPrice = val - 5;
                maxPrice = val + 5;
            }
        } else if (priceMatch.length >= 2) {
            minPrice = parseInt(priceMatch[0]);
            maxPrice = parseInt(priceMatch[1]);
        }
    }

    // Normalize to raw number (likely yen) -> usually data is like '65' meaning 650,000. 
    // Need to check if user wants generic int (650000) or text. Schema says 'int'. 
    // Assuming schema stores actual value (650000). 
    // If parsed value is < 200, assume it's "Man Yen".
    if (minPrice && minPrice < 200) minPrice = minPrice * 10000;
    if (maxPrice && maxPrice < 200) maxPrice = maxPrice * 10000;


    // 4. Parse Location
    let locationId = LOCATIONS_MAP['tokyo'].id; // Default
    let locationFound = false;

    for (const key in LOCATIONS_MAP) {
        if (locationFound) break;
        const loc = LOCATIONS_MAP[key];
        for (const kw of loc.keywords) {
            if (otherFeatures.includes(kw) || summaryRaw.includes(kw)) {
                locationId = loc.id;
                locationFound = true;
                break;
            }
        }
    }

    // 5. Work Style
    let workStyle = 'onsite';
    if (otherFeatures.includes('フルリモート') || summaryRaw.includes('フルリモート')) {
        workStyle = 'remote';
    } else if (otherFeatures.includes('リモート') || otherFeatures.includes('週') || summaryRaw.includes('リモート')) {
        workStyle = 'hybrid';
    }

    // 6. Title extraction
    // Try to find "案件名: ..."
    let title = '';
    const nameMatch = otherFeatures.match(/案件名[:：]([^,、\n]+)/) || summaryRaw.match(/案件名[:：]([^,、\n]+)/);
    if (nameMatch) {
        title = nameMatch[1].trim();
    } else {
        // Use first sentence of summary or just summary truncated
        title = summaryRaw.split(/[。.]/)[0];
        if (title.length > 50) title = title.substring(0, 47) + '...';
        if (!title) title = techSkillsRaw.split(',')[0] + '開発案件';
    }

    // 7. Clean descriptions
    const description_md = summaryRaw.replace(/["']/g, "");
    const requirements_md = otherFeatures.replace(/["']/g, "");

    jobsData.push({
        id: generateUUID(),
        title: title.replace(/'/g, "''"),
        role_id: roleId,
        location_id: locationId,
        work_style: workStyle,
        price_min: minPrice || 0,
        price_max: maxPrice || 0,
        description_md: description_md,
        requirements_md: requirements_md,
        skills: skillNames
    });
});

// --- Generate SQL ---

let sql = `-- Auto-generated Seed File
-- Generated at: ${new Date().toISOString()}

-- 1. Truncate Tables
TRUNCATE TABLE public.job_skills CASCADE;
TRUNCATE TABLE public.jobs CASCADE;
TRUNCATE TABLE public.skills CASCADE;
TRUNCATE TABLE public.roles CASCADE;
TRUNCATE TABLE public.locations CASCADE;
TRUNCATE TABLE public.articles CASCADE;
TRUNCATE TABLE public.article_tags CASCADE;

-- 2. Insert Masters

-- Roles
INSERT INTO public.roles (id, name, slug, sort_order) VALUES
`;

const rolesValues = Object.values(ROLES_MAP).map((r, i) => `('${r.id}', '${r.name}', '${r.name.toLowerCase().replace(/ \/ /g, '-').replace(/ /g, '-')}', ${i})`);
sql += rolesValues.join(',\n') + ';\n\n';

// Locations
sql += `INSERT INTO public.locations (id, region, name, slug) VALUES\n`;
const locValues = Object.values(LOCATIONS_MAP).map(l => `('${l.id}', '${l.region}', '${l.name}', '${Object.keys(LOCATIONS_MAP).find(key => LOCATIONS_MAP[key].id === l.id)}')`);
sql += locValues.join(',\n') + ';\n\n';

// Skills
sql += `INSERT INTO public.skills (id, name, slug) VALUES\n`;
const skillList = Array.from(allSkills);
const skillValues = [];
skillList.forEach(name => {
    const id = generateUUID();
    let slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (!slug) slug = 'skill-' + id.substring(0, 8);
    // Dedupe slugs simple check? (Assuming unique for now or let Postgres complain? Better to uniquify in memory)
    // For simplicity, appending random if seems common, but let's just trust valid names
    SKILLS_CACHE[name] = id;
    skillValues.push(`('${id}', '${name.replace(/'/g, "''")}', '${slug}-${id.substring(0, 4)}')`); // Append ID to slug to avoid collision
});
sql += skillValues.join(',\n') + ';\n\n';

// Jobs
sql += `INSERT INTO public.jobs (id, title, role_id, location_id, work_style, price_min, price_max, description_md, requirements_md, status, is_active, created_at) VALUES\n`;
const jobValues = jobsData.map(job => {
    return `('${job.id}', '${job.title}', '${job.role_id}', '${job.location_id}', '${job.work_style}', ${job.price_min}, ${job.price_max}, '${job.description_md}', '${job.requirements_md}', 'published', true, now())`;
});
sql += jobValues.join(',\n') + ';\n\n';

// Job Skills
sql += `INSERT INTO public.job_skills (job_id, skill_id) VALUES\n`;
const jobSkillValues = [];
jobsData.forEach(job => {
    // Deduplicate skills per job in memory before generating SQL
    const uniqueSkills = new Set();
    job.skills.forEach(skillName => {
        const skillId = SKILLS_CACHE[skillName];
        if (skillId && !uniqueSkills.has(skillId)) {
            uniqueSkills.add(skillId);
            jobSkillValues.push(`('${job.id}', '${skillId}')`);
        }
    });
});
if (jobSkillValues.length > 0) {
    sql += jobSkillValues.join(',\n') + ';\n';
}

// Write to seed.sql
fs.writeFileSync(path.join(process.cwd(), 'supabase/seed.sql'), sql);
console.log('Seed file generated successfully!');
