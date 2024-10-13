// app/api/expand/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'node-html-parser';
import { URL } from 'url';

const SAFE_BROWSING_API_KEY = process.env.SAFE_BROWSING_API_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const expandedUrl = await expandUrl(url);
    const { title, description } = await getMetadata(expandedUrl);
    // const trustScore = await calculateTrustScore(expandedUrl);
    const { trustScore, isSafe } = await checkSafety(expandedUrl);

    return NextResponse.json({
      originalUrl: url,
      expandedUrl,
      title,
      description,
      trustScore,
      isSafe,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to expand URL' }, { status: 500 });
  }
}

async function expandUrl(shortUrl: string): Promise<string> {
  const response = await fetch(shortUrl, { method: 'HEAD', redirect: 'follow' });
  return response.url || shortUrl;
}

async function getMetadata(url: string): Promise<{ title: string; description: string }> {
  const response = await fetch(url);
  const html = await response.text();
  const root = parse(html);
  const title = root.querySelector('title')?.text || 'No title found';
  const description = root.querySelector('meta[name="description"]')?.getAttribute('content') || 'No description found';
  return { title, description };
}

async function calculateTrustScore(url: string): Promise<number> {
  let score = 50;
  if (new URL(url).protocol === 'https:') {
    score += 25;
  }
  return Math.min(score, 100);
}

async function checkSafety(url: string): Promise<{ trustScore: number; isSafe: boolean }> {
  let trustScore = 0;
  let isSafe = true;

  // Check if the URL uses HTTPS
  if (new URL(url).protocol === 'https:') {
    trustScore += 20;
  }

  // Check with Google Safe Browsing API
  const safeBrowsingUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${SAFE_BROWSING_API_KEY}`;
  const response = await fetch(safeBrowsingUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client: { clientId: GOOGLE_CLIENT_ID, clientVersion: "1.0.0" },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url: url }]
      }
    })
  });

  const data = await response.json();

  if (data.matches && data.matches.length > 0) {
    isSafe = false;
    trustScore = 0;
  } else {
    trustScore += 80;
  }

  return { trustScore, isSafe };
}