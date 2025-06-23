

export async function GET() {
  const { B2_application_key, B2_key_ID, B2_Bucket_ID } = process.env;

  const auth = Buffer.from(`${B2_key_ID}:${B2_application_key}`).toString('base64');
  
  // https://f000.backblazeb2.com/file/YOUR_BUCKET_NAME/YOUR_FILE_NAME?Authorization=your_token_here get a file

  /* upload file
    GET https://api.backblazeb2.com/b2api/v2/b2_authorize_account
    Authorization: Basic base64(accountId:applicationKey)

    POST {apiUrl}/b2api/v2/b2_get_upload_url
    Authorization: {authorizationToken}
    Content-Type: application/json

    {
      "bucketId": "your_bucket_id"
    }

    POST {uploadUrl}
    Authorization: {uploadAuthToken}
    X-Bz-File-Name: your_file_name
    Content-Type: your_mime_type
    X-Bz-Content-Sha1: hex_of_sha1 (or "do_not_verify")
    Content-Length: file_size_in_bytes

    <file data>
  */

  const authRes = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
    headers: { Authorization: `Basic ${auth}` },
  });

  const authData = await authRes.json();
  const { authorizationToken, apiUrl } = authData;

  const listRes = await fetch(`${apiUrl}/b2api/v2/b2_list_file_names`, {
    method: 'POST',
    headers: {
      Authorization: authorizationToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bucketId: B2_Bucket_ID,
      maxFileCount: 100,
    }),
  });

  const listData = await listRes.json();

  return new Response(JSON.stringify(listData.files), {
    headers: { 'Content-Type': 'application/json' },
  });
}