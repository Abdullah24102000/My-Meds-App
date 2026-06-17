import { createClient } from '@supabase/supabase-js';

// قراءة المتغيرات من ملف .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// إنشاء العميل
export const supabase = createClient(supabaseUrl, supabaseAnonKey);