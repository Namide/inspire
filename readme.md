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

### Setup

[Directus](https://getdirectus.com/)

Install vendors

```
cd admin
composer install
```

Create you database.

Install the admin with the http path `/admin`.

Use `Inspire` choice for `Initial schema` select box.


### Requirements

- NGINX or Apache Server
- MySQL 5.2+
- PHP 5.6+ (curl, gd, finfo, pdo_mysql)

### TODO

Directus -> disable cors (for production)