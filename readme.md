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

> Restart from scratch

``` bash
# go to api dir
cd api/

# install php dependencies
composer install
```

### TODO

#### Symfony starter
composer create-project -s beta symfony/skeleton symfony

#### Custom tables
post
    title
    description
    date
    // tags
    // type (video image audio link 3d document text)
    thumb
    content_file (uid)
    content_text
    content_link
    public
    score

tag
    name

type
    name

tag_join
    tag_id
    item_uid

type_join
    type_id
    item_uid

group
    title
    description
    thumb
    // selector_tags
    // selector_types
    public

file
    slug
    name
    location
    type (video image audio archive document)
    charset ?
    width
    height
    size
    colors
    data (JSON)

user
    name
    email
    password
    permission

uid
    table
    item_id
