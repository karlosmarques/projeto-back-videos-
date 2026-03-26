/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';
import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
dotenv.config();

async function setupCors() {
  // 1. Autenticar na API nativa
  const authResponse = await axios.get(
    'https://api.backblazeb2.com/b2api/v2/b2_authorize_account',
    {
      auth: {
        username: process.env.B2_KEY_ID!,
        password: process.env.B2_APPLICATION_KEY!,
      },
    },
  );

  const { authorizationToken, apiUrl, accountId } = authResponse.data;
  console.log('✅ Autenticado!');

  // 2. Buscar o bucketId
  const bucketsResponse = await axios.post(
    `${apiUrl}/b2api/v2/b2_list_buckets`,
    { accountId, bucketName: process.env.B2_BUCKET_NAME },
    { headers: { Authorization: authorizationToken } },
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const bucket = bucketsResponse.data.buckets[0];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log(`✅ Bucket encontrado: ${bucket.bucketId}`);

  // 3. Remover regras CORS nativas (array vazio)
  await axios.post(
    `${apiUrl}/b2api/v2/b2_update_bucket`,
    {
      accountId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      bucketId: bucket.bucketId,
      corsRules: [], // ← limpa as regras nativas
    },
    { headers: { Authorization: authorizationToken } },
  );
  console.log('✅ Regras nativas removidas!');

  // 4. Aplicar CORS via API S3
  const s3 = new S3Client({
    endpoint: 'https://s3.us-east-005.backblazeb2.com',
    region: 'us-east-005',
    credentials: {
      accessKeyId: process.env.B2_KEY_ID!,
      secretAccessKey: process.env.B2_APPLICATION_KEY!,
    },
    forcePathStyle: true,
  });

  await s3.send(
    new PutBucketCorsCommand({
      Bucket: process.env.B2_BUCKET_NAME!,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: ['http://localhost:5173'],
            AllowedMethods: ['PUT', 'GET'],
            AllowedHeaders: ['*'],
            ExposeHeaders: ['ETag'],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    }),
  );

  console.log('✅ CORS S3 configurado com sucesso!');
}

setupCors().catch(console.error);
