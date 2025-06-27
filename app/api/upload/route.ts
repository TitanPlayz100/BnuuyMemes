
export async function GET() {
  const { B2_application_key, B2_key_ID, B2_Bucket_ID } = process.env;

  const auth = Buffer.from(`${B2_key_ID}:${B2_application_key}`).toString('base64');
  const authRes = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
    headers: { Authorization: `Basic ${auth}` },
  });

  const authData = await authRes.json();
  const { authorizationToken, apiUrl } = authData;

  const uploadRes = await fetch(`${apiUrl}/b2api/v2/b2_get_upload_url`, {
    method: 'POST',
    headers: {
      Authorization: authorizationToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bucketId: B2_Bucket_ID })
  });

  const uploadData = await uploadRes.json();

  return Response.json({
    uploadUrl: uploadData.uploadUrl,
    uploadAuthToken: uploadData.authorizationToken
  });
}