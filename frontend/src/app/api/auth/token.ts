// src/pages/api/auth/token.ts
import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { accessToken } = await getAccessToken(req, res);
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch access token' });
  }
});
