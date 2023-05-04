import { createSign } from 'crypto';
import fetch from 'node-fetch';

const APPLE_A3_AUTH_URL = 'https://appleid.apple.com/auth/token';

interface AppleA3AuthParams {
  code: string;
  client_id: string;
  team_id: string;
  redirect_uri: string;
  grant_type: string;
  client_secret: string;
}

export async function getAppleA3AuthToken(
  code: string,
  clientId: string,
  teamId: string,
  redirectUri: string,
  privateKey: string
): Promise<string> {
  const header = JSON.stringify({ alg: 'ES256', kid: clientId });
  const payload = JSON.stringify({
    iss: teamId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 180, // 180 days
    aud: 'https://appleid.apple.com',
    sub: clientId,
    nonce: '',
    c_hash: '',
  });

  const signer = createSign('sha256');
  signer.update(`${header}.${payload}`);
  const signature = signer.sign(privateKey, 'base64');

  const params: AppleA3AuthParams = {
    code,
    client_id: clientId,
    team_id: teamId,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
    client_secret: `${header}.${payload}.${signature}`,
  };

  const response = await fetch(APPLE_A3_AUTH_URL, {
    method: 'POST',
    body: new URLSearchParams(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const json : {error : string} | {data : any} = await response.json() as {error : string} | {data : any};

  //@ts-ignore
  if (json.error) {
    //@ts-ignore
    throw new Error(`Apple A3 auth failed: ${json.error}`);
  }
  
  //@ts-ignore
  return json.access_token;
}
