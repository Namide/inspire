let config
if (window.inspire && window.inspire.config)
{
    config = Object.assign({}, window.inspire.config)
}
else
{
    console.error('Please include the file /api/config.js')
    config = {
        api: {
            root: "/api"
        },
        front: {
            root: ""
        },
        admin: {
            root: "/admin"
        }
    }
}

export default config