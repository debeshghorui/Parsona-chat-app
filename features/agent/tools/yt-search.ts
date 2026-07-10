import { tool } from '@openai/agents';
import { z } from 'zod';

const HITESH_CHANNELS = [
    { name: 'Chai Aur Code (Hindi)', handle: '@chaiaurcode' },
    { name: 'HiteshCodeLab (English)', handle: '@HiteshCodeLab' },
];

type YoutubeVideo = {
    title: string;
    videoId: string;
    url: string;
    description: string;
    publishedAt: string;
};

type ChannelSearchResult = {
    channel: string;
    handle: string;
    videos: YoutubeVideo[];
};

function normalizeSearchQuery(query: string) {
    const trimmed = query.trim().toLowerCase();
    if (trimmed === 'radis') return 'redis';
    return query.trim();
}

function extractVideos(data: unknown): YoutubeVideo[] {
    const videos: YoutubeVideo[] = [];
    const seen = new Set<string>();

    function walk(obj: unknown, depth = 0) {
        if (depth > 20 || !obj || typeof obj !== 'object') return;

        const record = obj as Record<string, unknown>;
        const renderer = (record.videoRenderer ?? record.gridVideoRenderer) as Record<string, unknown> | undefined;

        if (renderer?.videoId && typeof renderer.videoId === 'string' && !seen.has(renderer.videoId)) {
            seen.add(renderer.videoId);
            const title = renderer.title as Record<string, unknown> | undefined;
            const descriptionSnippet = renderer.descriptionSnippet as { runs?: { text: string }[] } | undefined;
            const publishedTimeText = renderer.publishedTimeText as { simpleText?: string } | undefined;

            videos.push({
                title:
                    (title?.runs as { text: string }[] | undefined)?.[0]?.text ??
                    (title?.simpleText as string | undefined) ??
                    'Untitled',
                videoId: renderer.videoId,
                url: `https://www.youtube.com/watch?v=${renderer.videoId}`,
                description: descriptionSnippet?.runs?.map((r) => r.text).join('') ?? '',
                publishedAt: publishedTimeText?.simpleText ?? '',
            });
        }

        for (const value of Object.values(record)) walk(value, depth + 1);
    }

    walk(data);
    return videos;
}

async function searchChannel(handle: string, query: string): Promise<YoutubeVideo[]> {
    const url = `https://www.youtube.com/${handle}/search?query=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        },
    });

    if (!response.ok) {
        throw new Error(`YouTube search failed for ${handle}: ${response.status}`);
    }

    const html = await response.text();
    const match = html.match(/var ytInitialData = (.+?);<\/script>/);
    if (!match) return [];

    return extractVideos(JSON.parse(match[1]));
}

function filterRelevantVideos(videos: YoutubeVideo[], query: string): YoutubeVideo[] {
    const pattern = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const relevant = videos.filter((video) => pattern.test(`${video.title} ${video.description}`));

    return relevant.length > 0 ? relevant : videos.slice(0, 5);
}

export async function searchYoutubeChannels(query: string): Promise<ChannelSearchResult[]> {
    const searchTerm = normalizeSearchQuery(query);
    const results: ChannelSearchResult[] = [];

    for (const channel of HITESH_CHANNELS) {
        const videos = await searchChannel(channel.handle, searchTerm);
        const relevantVideos = filterRelevantVideos(videos, searchTerm).slice(0, 5);

        results.push({
            channel: channel.name,
            handle: channel.handle,
            videos: relevantVideos,
        });
    }

    return results;
}

export const youtubeSearch = tool({
    name: 'youtube_search',
    description: 'Search Hitesh Choudhary YouTube channels (Chai Aur Code and HiteshCodeLab) for videos matching a query.',
    parameters: z.object({
        query: z.string().describe('The topic or keyword to search for on YouTube'),
    }),
    execute: async ({ query }) => searchYoutubeChannels(query),
});

export default youtubeSearch;
