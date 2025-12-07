import { createClient } from '@/app/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, wish } = await request.json()
    const cookieStore = await cookies()
    // @ts-expect-error - cookieStore type mismatch in server.ts but runtime is correct
    const supabase = createClient(cookieStore)

    const { error } = await supabase.from('wish').insert({ name, wish })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Internal server error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')

    if (!name) {
      return NextResponse.json({ error: 'Name parameter is required' }, { status: 400 })
    }

    const cookieStore = await cookies()
    // @ts-expect-error - cookieStore type mismatch in server.ts but runtime is correct
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
      .from('wish')
      .select('wish')
      .eq('name', name)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const wishes = data.map((item: { wish: string }) => item.wish)

    return NextResponse.json({ wishes })
  } catch (error) {
    console.error('Internal server error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
