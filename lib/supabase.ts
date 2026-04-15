import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const isConfigured =
  supabaseUrl.length > 0 &&
  supabaseAnonKey.length > 0 &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('placeholder')

export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder-key',
)

export const supabaseReady = isConfigured

export type Work = {
  id: string
  title: string
  category: string
  description: string
  image_url: string
  created_at: string
}
