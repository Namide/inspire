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
            adminHome: URLs.front.rel + '/admin/',
            adminPosts: URLs.front.rel + '/admin/post',
            adminPost: URLs.front.rel + '/admin/post/:uid',
            adminBoards: URLs.front.rel + '/admin/board',
            adminBoard: URLs.front.rel + '/admin/board/:uid',
        }
    }

    config = Object.assign({routes}, URLs)
}
else
{
    console.error('Please include the correct URL for API file /api/config.js')
}

export default config