# Inspire

Tool to collect and storage or embed datas (URL, images, scripts, files, videos)


## Start dev

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
- [API](http://192.168.99.100:8100/)
- [phpMyAdmin](http://192.168.99.100:8101/)

### Back super admin password

`i4rKc3fSc15KvXwSFH39JN708A`

## Collections

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
