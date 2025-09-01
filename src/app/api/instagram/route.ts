import axios from 'axios';
import { NextResponse } from 'next/server';

/**
 * ENV needed (Basic Display or Graph token):
 * IG_ACCESS_TOKEN=xxxxx
 * IG_USER_ID=me            # 'me' for Basic Display, or an IG User ID for Graph
 * IG_PROFILE_PIC=/avatar.jpg  # optional fallback (place in /public)
 * IG_NAME=Good Chicken        # optional display name
 * IG_FOLLOWERS=3200000        # optional number (if your token can't return it)
 * IG_FOLLOWING=1600           # optional number
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const after = searchParams.get('after') ?? '';
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const token = process.env.IG_ACCESS_TOKEN;
    const userId = process.env.IG_USER_ID || 'me';
    if (!token) {
        return NextResponse.json(
            { error: 'Missing IG_ACCESS_TOKEN' },
            { status: 500 }
        );
    }

    // We’ll try Instagram Graph endpoints (with like_count/comments_count).
    // Falls back gracefully if those fields are not available on your token.
    const base = userId === 'me'
        ? 'https://graph.instagram.com'
        : 'https://graph.facebook.com/v20.0';

    try {
        // Profile
        const profFields = userId === 'me'
            ? 'id,username,account_type,media_count'
            : 'id,username,profile_picture_url,media_count,followers_count,follows_count,verification_status';
        const profileUrl =
            `${base}/${userId}?fields=${encodeURIComponent(profFields)}&access_token=${encodeURIComponent(token)}`;
        const prof = (await axios.get(profileUrl, { timeout: 10_000 })).data;

        // Media
        const mediaFields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count';
        const mediaUrl =
            `${base}/${userId}/media?fields=${encodeURIComponent(mediaFields)}&limit=${limit}` +
            (after ? `&after=${encodeURIComponent(after)}` : '') +
            `&access_token=${encodeURIComponent(token)}`;
        const mediaRes = (await axios.get(mediaUrl, { timeout: 10_000 })).data;

        const profile = {
            id: prof.id,
            username: prof.username,
            name: process.env.IG_NAME ?? prof.username,
            profilePicUrl: prof.profile_picture_url ?? process.env.IG_PROFILE_PIC ?? '/ig-avatar-fallback.png',
            posts: prof.media_count ?? null,
            followers: Number(process.env.IG_FOLLOWERS ?? prof.followers_count ?? NaN) || null,
            following: Number(process.env.IG_FOLLOWING ?? prof.follows_count ?? NaN) || null,
            isVerified: ['verified', 'blue_verified'].includes(String(prof.verification_status || '').toLowerCase())
        };

        const posts = (mediaRes.data || []).map((m: any) => ({
            id: m.id,
            media_type: m.media_type,
            media_url: m.media_url,
            thumbnail_url: m.thumbnail_url,
            permalink: m.permalink,
            caption: m.caption,
            like_count: m.like_count,
            comments_count: m.comments_count
        }));

        const nextCursor = mediaRes.paging?.cursors?.after ?? null;

        return NextResponse.json({ profile, posts, nextCursor });
    } catch (e: any) {
        console.error('IG API error:', e?.response?.data || e?.message);
        return NextResponse.json(
            { error: 'Failed to fetch Instagram data' },
            { status: 500 }
        );
    }
}
