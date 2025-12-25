import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database
export interface DbCategory {
  id: string;
  name: string;
  description: string;
  created_at?: string;
}

export interface DbModel {
  id: string;
  category_id: string;
  brand: string;
  designation: string;
  description: string;
  created_at?: string;
}

export interface DbPart {
  id: string;
  model_id: string;
  name: string;
  description: string;
  image: string;
  created_at?: string;
}
