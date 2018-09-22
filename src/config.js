let config
if (window.inspire && window.inspire.config)
{
    const URLs = window.inspire.config
    const routes = {
        front: {
            home: URLs.front.rel + '/',
            posts: URLs.front.rel + '/post',
            post: URLs.front.rel + '/post/:uid',
            boards: URLs.front.rel + '/board',
            board: URLs.front.rel + '/board/:uid',
        },
        admin: {
            home: URLs.admin.rel + '/',
            posts: URLs.admin.rel + '/post',
            post: URLs.admin.rel + '/post/:uid',
            boards: URLs.admin.rel + '/board',
            board: URLs.admin.rel + '/board/:uid',
        }
    }

    config = Object.assign({routes}, URLs)
}
else
{
    console.error('Please include the correct URL for API file /api/config.js')
}

export default config