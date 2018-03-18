class Config
{
    constructor()
    {
        this.api = {
            url: 'http://localhost/inspire/admin/api/',
            token: 'd66908b28464bf3a9cf97118c8debe'
        }

        this.assets = {
            url: 'http://localhost/inspire'
        }
    }
}

const config = new Config()

export default config