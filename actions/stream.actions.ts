'use server';

import { currentUser } from '@clerk/nextjs/server';
import { StreamClient } from '@stream-io/node-sdk';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error('User is not logged in');
  if (!apiKey) throw new Error('Stream API key is required');
  if (!apiSecret) throw new Error('Stream API secret is required');

  const client = new StreamClient(apiKey, apiSecret);

  const validity = 60 * 60;
  const issued = Math.floor(Date.now() / 1000) - 60;

  return client.generateUserToken({ user_id: user.id, validity_in_seconds: validity, issued_at: issued });
};