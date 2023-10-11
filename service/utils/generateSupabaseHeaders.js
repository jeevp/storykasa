function generateSupabaseHeaders(accessToken, contentType) {
    return {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': contentType ? contentType : 'application/json',
        'Prefer': 'return=representation',
    }
}


module.exports = generateSupabaseHeaders
