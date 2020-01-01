FROM php:7.3-apache


ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# ENV HOME /root
# ENV DEBIAN_FRONTEND noninteractive
# RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# RUN apt-get update -y --fix-missing && \
#     apt-get install -y --no-install-recommends apt-utils && \
#     apt-get install -y dialog && \
#     # apt-get upgrade -y && \
#     apt-get install -y build-essential sendmail git libssl-dev libjpeg-dev libwebp-dev libjpeg62-turbo-dev libxpm-dev libpng-dev zlib1g-dev libfreetype6-dev && \
#     apt-get install -y --no-install-recommends libmagickwand-dev

# RUN docker-php-ext-install mbstring pdo pdo_mysql && \
#     docker-php-ext-install gd && \
#     a2enmod rewrite

# RUN pecl install imagick && docker-php-ext-enable imagick


# RUN git clone https://github.com/directus/api.git .
# RUN rm -rf .git



#
# Dependencies & extensions
# https://github.com/directus/docker/blob/master/images/core/apache/Dockerfile
#
# RUN \
#   apt-get update && \
#   apt-get install -y git zip libpng-dev libzip-dev libxml2-dev libfreetype6-dev libjpeg-dev libjpeg62-turbo-dev && \
#   rm -rf /var/lib/apt/lists/* && \
#   a2enmod rewrite && \
#   docker-php-ext-configure zip --with-libzip && \
#   docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ && \
#   docker-php-ext-install iconv && \
#   docker-php-ext-install gd zip exif pdo pdo_mysql xml fileinfo





RUN apt-get update && \
  apt-get install -y zip libpng-dev libzip-dev libxml2-dev libfreetype6-dev libjpeg-dev libjpeg62-turbo-dev && \
  rm -rf /var/lib/apt/lists/* && \
  a2enmod rewrite

RUN docker-php-ext-configure zip --with-libzip && \
  docker-php-ext-configure gd --with-freetype-dir --with-jpeg-dir && \
  docker-php-ext-install gd zip exif pdo_mysql
  # iconv pdo xml fileinfo






WORKDIR /var/www/html

# VOLUME [ "/var/www/html" ]

# CMD ["mv", "/var/www/temp", "/var/www/html"]

# FROM php:7.3-fpm-alpine

# RUN docker-php-ext-install mbstring pdo pdo_mysql

# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer 

# RUN apk add --no-cache git

# CMD php -S 0.0.0.0:80 /var/www/html/public/index.php


# EXPOSE 80

# VOLUME [ "/usr/local/etc/php", "/var/www/html" ]

# WORKDIR /var/www/html