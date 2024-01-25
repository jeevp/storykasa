function generateSupabaseHeaders(options = { contentType: "application/json" }, auth = { accessToken: "" }) {
    require('dotenv').config({ path: '.env' });

    return {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${auth.accessToken ? auth.accessToken : process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': options.contentType,
        'Prefer': 'return=representation',
    }
}


module.exports = generateSupabaseHeaders
