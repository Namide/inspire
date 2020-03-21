# Inspire

Tool to collect and storage or embed datas (URL, images, scripts, files, videos)


## Start dev

### Requirements

- PHP 7.2+
- PDO / Sqlite
- mail (SMTP configured)


### Commands

```bash
# back-end
docker-compose -f config/back-serve-dev/docker-compose.yml up

# front-end install
cd front
npm install

# front-end run dev server
npm --prefix ./front/ run serve
```

### Dev URL

- [Front-end](http://localhost:8080/)
- [Admin](http://192.168.99.100:8100/admin)
  - user: `inspire@inspire.com`
  - pass: `inspire`
- [API](http://192.168.99.100:8100/)
- [phpMyAdmin](http://192.168.99.100:8101/)

### Back super admin password

`i4rKc3fSc15KvXwSFH39JN708A`


## Users roles

Users has many roles, this is the list of those ones:

| id | role          | public data         | protected data    | private data      | users            |
|----|---------------|---------------------|-------------------|-------------------|------------------|
| 0  | Public        | see                 | X                 | X                 | X                |
| 1  | Subscriber    | see                 | see               | X                 | edit his own     |
| 2  | Author        | add, edit his own   | add, edit his own | add, edit his own | edit his own     |
| 3  | Editor        | add, edit all       | add, edit all     | add, edit his own | edit his own     |
| 4  | Administrator | add, edit all       | add, edit all     | add, edit all     | add, edit all    |

> A data can be a post, a group, etc.  
- _*Add = create_  
- _*Edit = modify and delete_  
- _*Users roles: Only admin can modify users roles_


## Collections

**Status:**

- Public (can be see by all user)
- Protected (can be see by all exept public user)
- Private (can be see only by owner)
- Draft (can be see only by owner and editors)
- Deteled


- posts
  - id
  - author
  - title < 255 chars
  - description (abstract, resume, comment, header, caption) < 1000 chars
  - date
  - thumb (file)
  - colors
  - colors_round

  - content_text (text, embed, URL...) # Disabled if file
  - content_file                       # Disabled if no file

  - types (ou format)
    - text (video (embed), file (video, img), link, pdf, md...)

  - score (0-5)
  - tags
  - visibility (public, protected, private)

- groups
  - id
  - author
  - order
  - date

  - thumb
  - colors

  - title
  - description (comment) < 1000 chars
  - visibility (public, protected, private)
  - tags (search -> paint,!digital)
  - formats (ou types -> video-file,video-embed)
  - scores (>4...)


## Add dependencies to back

```bash
docker run --rm --interactive --tty --volume /d/DAMIEN/scripts/lib/inspire/back:/app composer require league/color-extractor:0.3.* --ignore-platform-reqs --no-scripts
docker run --rm --interactive --tty --volume /d/DAMIEN/scripts/lib/inspire/back:/app composer remove league/color-extractor:0.3.* --ignore-platform-reqs --no-scripts
```
