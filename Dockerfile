# Dockerfile

FROM php:8.1-cli

WORKDIR /app

# Install dependencies
RUN apt-get update && \
    apt-get install -y unzip git curl zip && \
    curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer

# Copy app
COPY . .

# Create .env
RUN cp .env.example .env

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Laravel key + config
RUN php artisan key:generate && php artisan config:cache

# ✅ Expose correct port
EXPOSE 8080

# ✅ Start Laravel server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]

RUN php artisan storage:link