// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ytsojsmbmertwicztubd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0c29qc21ibWVydHdpY3p0dWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjA4NTIsImV4cCI6MjA3NDYzNjg1Mn0.muvA8ZrjnAVVi63M3w3RaMXCtfgBvItD4jl51_ELCN8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

