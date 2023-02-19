import { Env } from './env';

export const onRequest: PagesFunction<Env> = async (context) => {
    return new Response('hello', {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
};
