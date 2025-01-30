import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common Supabase operations
export const supabaseHelper = {
    supabase,
    // User Preferences operations
    preferences: {
        async get(userId) {
            const { data, error } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', userId)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            return data;
        },

        async update(userId, preferences) {
            const { data, error } = await supabase
                .from('user_preferences')
                .upsert({ user_id: userId, ...preferences })
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    }
}; 