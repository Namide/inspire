# Inspire

Tool to collect and storage or embed datas (URL, images, scripts, files, videos)

## Requirements

Browser scope:
- Microsoft Edge (last version)
- Chrome (last version)
- Firefox (last version)
- Safari (last version)
- ~~Internet Explorer~~


## Setup

You can choose between 2 setup to serve local dev servers:
- Docker (Frontend + API + MongoDB)
- NPM (Frontend + API, need additional MongoDB)


### Docker

[Docker](https://www.docker.com/) required


#### Install

```bash
# Install server dependencies
docker run -ti --rm -v $(pwd)/web:/usr/src/app -w /usr/src/app node:14.7-slim npm install

# Install frontend dependencies
docker run -ti --rm -v $(pwd)/front-src:/usr/src/app -w /usr/src/app node:14.7-slim npm install
```


#### Run dev server

```bash
# Run development environment
docker-compose -f ./docker/dev/docker-compose.yml up
```


#### Build front-end sources

```bash
# Build frontend sources to /web/public directory
docker run -ti --rm -v $(pwd):/usr/src/app -w /usr/src/app/front-src node:14.7-slim npm run build
```


#### URL

- [Front-end](http://localhost:8081/)
- [API](http://localhost:8082/api)
- [DB admin](http://localhost:8083/db/inspire)


### NPM

- [Node js](https://nodejs.org/) required
- MongoDB ready to use


#### Install

```bash
# Install server dependencies
npm install # from the web directory

# Install frontend dependencies
npm install # from the front-src directory
```


#### Run dev server

Update the proxy API path:
1. Open the file `front-src/vue.config.js`
2. Replace `devServer.proxy["/api"].target = "http://inspire-server-dev:80"` by `devServer.proxy["/api"].target = "http://localhost:80"`

```bash
# Run backend development environment
npm run dev --prefix web

# Run frontend development environment
npm run serve --prefix front-src
```



#### Build front-end sources

```bash
# Build frontend sources to /web/public directory
npm run build --prefix front-src
```


#### URL

- [Front-end](http://localhost:8080/)
- [API](http://localhost/api)


## Users roles

Users has many roles, this is the list of those ones:

|  | public | protected | private | user |
|---|---|---|---|---|
| guest | see | x | x | x |
| subscriber | see | see | x | edit his own |
| author | add, edit his own | add, edit his own | add, edit his own | edit his own |
| editor | add, edit all | add, edit all | add, edit his own | edit his own |
| admin | add, edit all | add, edit all | add, edit all | add, edit all |

> A public, protected and private can be a item or group  
- _*Add = create_  
- _*Edit = modify and delete_  
- _*Users roles: Only admin can modify users roles_


## Directories

- `app/` Backend files (nodejs/koa/mongoDB)
- `public/` Frontend static files (build)
- `src/` Frontend sources (you can rebuild from it)
- `upload/` User upload files


## Roadmap

- `95%` Install from frontend
- `60%` Items list page
- `40%` Item page
- `0%` Groups list page
- `0%` Group page (items list)
- `50%` Admin login
- `50%` Admin logout
- `60%` Admin items edit list (table display)
- `30%` Admin item edit list
- `0%` Admin user list
- `0%` API thumb images
- `95%` API cookie login
- `0%` Design
