function generateSupabaseHeaders(accessToken) {
    return {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
    }
}


module.exports = generateSupabaseHeaders
