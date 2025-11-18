
import { WikipediaResult } from '../types';

const WIKI_API_URL = 'https://en.wikipedia.org/w/api.php';

export const searchWikipedia = async (query: string): Promise<WikipediaResult | null> => {
    try {
        // 1. Search for the page
        const searchParams = new URLSearchParams({
            action: 'query',
            list: 'search',
            srsearch: `${query} 1889 Paris`,
            format: 'json',
            origin: '*'
        });

        const searchRes = await fetch(`${WIKI_API_URL}?${searchParams.toString()}`);
        const searchJson = await searchRes.json();

        if (!searchJson.query?.search?.length) return null;

        const pageId = searchJson.query.search[0].pageid;

        // 2. Get Extracts
        const extractParams = new URLSearchParams({
            action: 'query',
            prop: 'extracts|info',
            inprop: 'url',
            exintro: 'true',
            explaintext: 'true',
            pageids: pageId.toString(),
            format: 'json',
            origin: '*'
        });

        const extractRes = await fetch(`${WIKI_API_URL}?${extractParams.toString()}`);
        const extractJson = await extractRes.json();
        const page = extractJson.query.pages[pageId];

        return {
            title: page.title,
            extract: page.extract,
            url: page.fullurl
        };

    } catch (e) {
        console.error("Wikipedia API Error", e);
        return null;
    }
};
