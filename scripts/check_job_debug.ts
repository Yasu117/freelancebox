
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkJob(code: string) {
    console.log(`Checking job with code: ${code}`)

    const { data, error } = await supabase
        .from('jobs')
        .select('id, job_code, status, title')
        .eq('job_code', code)

    if (error) {
        console.error('Error:', error)
        return
    }

    if (data && data.length > 0) {
        console.log('Found job:', data[0])
    } else {
        console.log('Job not found in DB.')
        // 念のため、近いものがないか確認（publishedのみ）
        const { count } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'published')
        console.log(`Total published jobs: ${count}`)
    }
}

const code = process.argv[2] || 'T260116-0750'
checkJob(code)
