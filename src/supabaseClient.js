import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ysnmheoreyvipzirabeh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzbm1oZW9yZXl2bHB6aXJhYmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzODU3NTAsImV4cCI6MjEwNDk2MTc1MH0.KQ0fhBcn-VgYi_KltuBsaEiHPaHSGuvfIL2xvmCirlM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)