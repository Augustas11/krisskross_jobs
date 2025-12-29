import crypto from 'crypto';

export interface SigV4Config {
    accessKey: string;
    secretKey: string;
    region: string;
    service: string;
}

export async function signBytePlusRequest(
    method: string,
    url: string,
    config: SigV4Config,
    body?: any
): Promise<Record<string, string>> {
    const { accessKey, secretKey, region, service } = config;
    const parsedUrl = new URL(url);
    const host = parsedUrl.host;
    const pathname = parsedUrl.pathname;
    const searchParams = parsedUrl.searchParams;

    const now = new Date();
    const xDate = now.toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z';
    const shortDate = xDate.slice(0, 8);

    const hashedPayload = crypto
        .createHash('sha256')
        .update(body ? JSON.stringify(body) : '')
        .digest('hex');

    const canonicalHeaders = `content-type:application/json\nhost:${host}\nx-content-sha256:${hashedPayload}\nx-date:${xDate}\n`;
    const signedHeaders = 'content-type;host;x-content-sha256;x-date';

    // Canonical Query String
    const sortedKeys = Array.from(searchParams.keys()).sort();
    const canonicalQueryString = sortedKeys
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams.get(key) || '')}`)
        .join('&');

    const canonicalRequest = [
        method.toUpperCase(),
        pathname,
        canonicalQueryString,
        canonicalHeaders,
        signedHeaders,
        hashedPayload,
    ].join('\n');

    const hashedCanonicalRequest = crypto
        .createHash('sha256')
        .update(canonicalRequest)
        .digest('hex');

    const credentialScope = `${shortDate}/${region}/${service}/request`;
    const stringToSign = [
        'HMAC-SHA256',
        xDate,
        credentialScope,
        hashedCanonicalRequest,
    ].join('\n');

    const kDate = hmac(secretKey, shortDate);
    const kRegion = hmac(kDate, region);
    const kService = hmac(kRegion, service);
    const kSigning = hmac(kService, 'request');

    const signature = hmac(kSigning, stringToSign).toString('hex');

    return {
        'Content-Type': 'application/json',
        'X-Date': xDate,
        'X-Content-Sha256': hashedPayload,
        'Authorization': `HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    };
}

function hmac(key: string | Buffer, data: string): Buffer {
    return crypto.createHmac('sha256', key).update(data).digest();
}
