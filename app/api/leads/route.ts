import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const supabase = await createClient()

        // Validate
        if (!json.name || !json.email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 })
        }

        const { error } = await supabase.from('leads').insert({
            name: json.name,
            email: json.email,
            role_text: json.role_text,
            years_of_exp: json.years_of_exp ? parseInt(json.years_of_exp) : null,
            status: 'new'
        })

        if (error) {
            console.error('Supabase Error:', error)
            return NextResponse.json({ error: 'Database Error' }, { status: 500 })
        }

        // STUB: Send Email logic would go here (Resend, SendGrid, etc.)
        console.log('Sending auto-reply email to', json.email)
        console.log('Sending notification to admin')

        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('Server Error:', e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
