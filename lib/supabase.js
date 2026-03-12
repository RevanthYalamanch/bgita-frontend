// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'
export const supabase = createClient(supabaseUrl, supabaseKey)

// Function to register a psychiatrist with the special code [cite: 8]
export async function registerClinician(name, email, code) {
  const SECRET_KEY = "GITA_HEAL_2026"; // The special code you requested [cite: 8]
  
  if (code !== SECRET_KEY) {
    throw new Error("Invalid Clinician Authentication Code");
  }

  const { data, error } = await supabase
    .from('clinicians')
    .insert([{ name, email, verified: true }]);
    
  return { data, error };
}