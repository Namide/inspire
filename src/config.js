class Config
{
    constructor()
    {
        this.api = {
            url: {
                root: 'http://inspire.local/api',
                // root: 'http://localhost/inspire/admin/api/',
                // assets: 'http://localhost/inspire/admin/storage/uploads/',
                images: 'http://inspire.local/api/data'
            },
            token: 'ba3bc648e6c004de47c5c594460a18',
        }
    }
}

const config = new Config()

export default config