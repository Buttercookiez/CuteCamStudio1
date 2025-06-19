FROM php:8.1-cli

# Set working directory inside container
WORKDIR /app

# Install required dependencies
RUN apt-get update && \
    apt-get install -y unzip git curl zip && \
    curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer

# Copy your Laravel project into container
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Generate Laravel APP_KEY
RUN php artisan key:generate && php artisan config:cache

# Expose the default Laravel port
EXPOSE 8080

# Start Laravel server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
