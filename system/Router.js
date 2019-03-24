module.exports = class Router
{
    constructor(staticDir)
    {
        this.static = staticDir
        this.routes = []
    }

    test(server)
    {
        const url = server.request.url
        const method = server.request.method // GET POST
        // https://www.dev2qa.com/node-js-http-server-get-post-example/
        
        const route = this.getRouteCallback(url, method)
        route.callback(server)
    }

    getRouteCallback(path, method)
    {
        return this.routes.filter(route => route.equal).find(route => route.method === method && path === route.path)
            || this.routes.filter(route => !route.equal).find(route => route.method === method && !route.equal && path.indexOf(route.path) === 0)
            || this.routes.find(route => route.path === '*')
            || (request => console.log('Route not found:', request.url))
    }

    add(path, method, callback, equal = true)
    {
        this.routes.push({ path, method, callback, equal })
        this.routes.sort((a, b) => b.path.length - a.path.length)
    }
}