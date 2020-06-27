# Inspire

Tool to collect and storage or embed datas (URL, images, scripts, files, videos)

## Requirements

Module browser:
- Microsoft Edge (last version)
- Chrome (last version)
- Firefox (last version)
- Safari (last version)
- ~~Internet Explorer~~


## Install

(Nodejs)[https://nodejs.org/] required

```bash
# back-end install
cd server
npm install

# front-end install
cd front-src
npm install
```


## Run dev server

```bash
# back-end run database
docker-compose -f ./server/docker-compose.yml up

# back-end run dev server
npm --prefix ./server/ run dev

# front-end run dev server
npm --prefix ./front-src/ run serve
```


## Dev URL

- [Front-end](http://localhost:8080/)
- [API](http://localhost:3000/api)
- [DB admin](http://192.168.99.100:8081/db/inspire)


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
