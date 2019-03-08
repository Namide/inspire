export default class Router
{
    constructor(staticDir)
    {
        this.static = staticDir
        this.routes = { }
    }

    test(request, response)
    {
        const pathName = url.parse(request.url, true, false).pathname
        const methods = request.method // GET POST

        // https://www.dev2qa.com/node-js-http-server-get-post-example/
        
        // if (url === '/')

        // const filePath = request.url === '/' ? this.homeFile : (this.viewPath + request.url)
    }

    getRouteCallback(dirs, routes)
    {

    }

    add(path, type, callback)
    {
        let route = this.routes
        const routePath = [type, ...path.split('/')]
        routePath.forEach(dir =>
        {
            if (!route[dir])
                route[dir] = {}

            route = route[dir]
        })

        route._callback = callback
    }
}