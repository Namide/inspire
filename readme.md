# Inspire

> Tool to collect and storage or embed datas (URL, images, scripts, files, videos)


## front-end Setup

### Build

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).


### Requirements

Module browser

- Microsoft Edge
- Chrome (last version)
- Firefox (last version)
- Safari (last version)
- ~~Internet Explorer~~


## Back-end

``` bash
# go to api dir
cd api/

# create a directory `data` with read and write permissions in the `api` directory
mkdir -m 777 data

# install php dependencies
composer install
```

### Requirements

- PHP 7+
- PDO / Sqlite


### Users roles

> Users has many roles, this is the list of those ones:

| id | role       | public data         | private data      | users         |
|----|------------|---------------------|-------------------|---------------|
| 0  | Guest      | see                 | X                 | X             |
| 1  | Subscriber | see                 | see               | edit his own  |
| 2  | Author     | add, edit his own   | add, edit his own | edit his own  |
| 3  | Editor     | add, edit all       | add, edit all     | edit his own  |
| 4  | Admin      | add, edit all       | add, edit all     | add, edit all |

> A data can be a post, a group, etc.
> _*Add = create_
> _*Edit = modify and delete_
> _*Users roles: Only admin can modify users roles_
