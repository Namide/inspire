# Inspire

Tool to collect and storage or embed datas (URL, images, scripts, files, videos)


## Install

```bash
# back-end install
npm install

# back-end run database
docker-compose up
# back-end run dev server
npm run dev


# front-end install
cd front
npm install

# front-end run dev server
npm --prefix ./front/ run serve
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


## Collections

**Status:**

- Public (can be see by all user)
- Protected (can be see by all exept unregister users)
- Private (can be see only by owner)


- items
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
