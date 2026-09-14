import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ysnmheoreyvipzirabeh.supabase.co'
const supabaseAnonKey = 'sb_publishable_DHU-AGBAgQ5G0CRwa4nczw_N0dh-3Ii'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)