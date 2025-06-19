FROM php:8.1-cli

WORKDIR /app

# Install dependencies
RUN apt-get update && \
    apt-get install -y unzip git curl zip && \
    curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer

# Copy all project files
COPY . .

# ✅ Create .env file so artisan commands work
RUN cp .env.example .env

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Run Laravel setup commands
RUN php artisan key:generate && php artisan config:cache

EXPOSE 8080

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
