# Inspire

Tool to collect and storage or embed datas (URL, images, scripts, files, videos)

## Requirements

Browser scope:
- Microsoft Edge (last version)
- Chrome (last version)
- Firefox (last version)
- Safari (last version)
- ~~Internet Explorer~~


## Install

[Docker](https://www.docker.com/) required

```bash
# Install server dependencies
docker run -ti --rm -v $(pwd)/web:/usr/src/app -w /usr/src/app node npm install

# Install frontend dependencies
docker run -ti --rm -v $(pwd)/front-src:/usr/src/app -w /usr/src/app node npm install
```


## Run dev server

```bash
# Run development environment
docker-compose -f ./docker/dev/docker-compose.yml up
```


## Build front-end sources

```bash
# Build frontend sources to /web/public directory
docker run -ti --rm -v $(pwd):/usr/src/app -w /usr/src/app/front-src node npm run build
```


## Dev URL

- [Front-end](http://localhost:8081/)
- [API](http://localhost:8082/api)
- [DB admin](http://localhost:8083/db/inspire)


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
- `20%` API cookie login
- `0%` Design
