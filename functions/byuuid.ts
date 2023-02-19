import { Env } from './env';

export const onRequest: PagesFunction<Env> = async (context) => {
    const env = context.env;
    const url = new URL(context.request.url);
    const params = url.searchParams;
    if (!params.has('q')) {
        throw Error('q is not defined');
    }

    const query = params.get('q');

    let resp = await fetch(`https://api.notion.com/v1/databases/${env.NOTION_DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env.NOTION_INTEGRATION_TOKEN}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-02-22',
        },
        body: JSON.stringify({
            filter: {
                property: 'id',
                title: {
                    equals: query,
                },
            },
        }),
    }).then((resp) => resp.json());

    if (resp['results'].length > 1) {
        throw Error('len(results) is greater than 1');
    }

    const items =
        resp['results'].length === 0 || resp['results'][0]['properties']['items']['rich_text'].length === 0
            ? []
            : resp['results'][0]['properties']['items']['rich_text'][0]['plain_text'].split(';');

    return new Response(JSON.stringify(items), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
