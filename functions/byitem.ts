import { Env } from './env';

export const onRequest: PagesFunction<Env> = async (context) => {
    const env = context.env;
    const url = new URL(context.request.url);
    const params = url.searchParams;
    if (!params.has('q') || !params.get('q')) {
        throw Error('q is not defined');
    }

    const keywords = params.get('q').split(';').map((e) => e.toLowerCase());

    const criteria = [];
    for (const keyword of keywords) {
        criteria.push({
            property: 'items',
            rich_text: {
                contains: keyword,
            },
        });
    }

    let resp = await fetch(`https://api.notion.com/v1/databases/${env.NOTION_DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env.NOTION_INTEGRATION_TOKEN}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-02-22',
        },
        body: JSON.stringify({
            filter: {
                or: criteria,
            },
        }),
    }).then((resp) => resp.json());

    const items = [];
    for (const result of resp['results']) {
        const element = result['properties']['items']['rich_text'];
        if (element.length !== 0) {
            items.push({
                id: result['properties']['id']['title'][0]['plain_text'],
                matching_items: element[0]['plain_text'].split(';').filter((e) => {
                    for (const keyword of keywords) {
                        if (e.toLowerCase().includes(keyword)) {
                            return true;
                        }
                    }
                    return false;
                }),
            });
        }
    }

    return new Response(JSON.stringify(items), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
