const encodeJWT = (payloadObj: object, secret: string = ''): string => {
    // Header
    const header = {
        alg: 'HS256', // Algorithm
        typ: 'JWT' // Type
    };

    // Encode Header
    const encodedHeader = btoa(JSON.stringify(header))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    // Encode Payload
    const encodedPayload = btoa(JSON.stringify(payloadObj))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    // Signature - For simplicity, we're not generating a real signature here.
    // A real implementation should securely sign the `${encodedHeader}.${encodedPayload}` string.
    const signature = btoa(secret)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    // Return the token
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export default encodeJWT;
