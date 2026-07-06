const HITESH_CHANNELS = [
    { name: 'Chai Aur Code (Hindi)', handle: '@chaiaurcode' },
    { name: 'HiteshCodeLab (English)', handle: '@HiteshCodeLab' },

];

function normalizeSearchQuery(query: string) {
    const trimmed = query.trim().toLowerCase();
    if (trimmed === 'radis') return 'redis';
    return query.trim();
}

function extractVideos(data) {
    const videos = [];
    const seen = new Set();

    function walk(obj, depth = 0) {
        if (depth > 20 || !obj || typeof obj !== 'object') return;

        const renderer = obj.videoRenderer ?? obj.gridVideoRenderer;
        if (renderer?.videoId && !seen.has(renderer.videoId)) {
            seen.add(renderer.videoId);
            videos.push({
                title: renderer.title?.runs?.[0]?.text ?? renderer.title?.simpleText ?? 'Untitled',
                videoId: renderer.videoId,
                url: `https://www.youtube.com/watch?v=${renderer.videoId}`,
                description: renderer.descriptionSnippet?.runs?.map((r) => r.text).join('') ?? '',
                publishedAt: renderer.publishedTimeText?.simpleText ?? '',
            });
        }

        for (const value of Object.values(obj)) walk(value, depth + 1);
    }

    walk(data);
    return videos;
}

async function searchChannel(handle, query) {
    const url = `https://www.youtube.com/${handle}/search?query=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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

function filterRelevantVideos(videos, query) {
    const pattern = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const relevant = videos.filter((video) =>
        pattern.test(`${video.title} ${video.description}`)
    );

    return relevant.length > 0 ? relevant : videos.slice(0, 5);
}

export default async function youtubeSearch(query: string) {
    const searchTerm = normalizeSearchQuery(query);
    const results = [];

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