export async function POST(request: Request) {
    const res = await request.json();

    const filename: string = res.filename;
    const { B2_application_key, B2_key_ID } = process.env;

    const auth = Buffer.from(`${B2_key_ID}:${B2_application_key}`).toString('base64');
    const authRes = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
        headers: { Authorization: `Basic ${auth}` },
    });

    const authData = await authRes.json();
    const { authorizationToken, apiUrl, downloadUrl } = authData;

    const fileRes = await fetch(`${downloadUrl}/file/bnuuys/${filename}?Authorization=${authorizationToken}`, {});

    const contentType = fileRes.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = `attachment; filename="${filename}"`;

    return new Response(fileRes.body, {
        headers: {
            'Content-Type': contentType,
            'Content-Disposition': contentDisposition,
        },
    });
}