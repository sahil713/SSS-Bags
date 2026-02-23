# SSS BAGS Backend - Ruby 3.3 + Rails 7.2
FROM ruby:3.3-alpine AS base

RUN apk add --no-cache build-base git libpq-dev nodejs tzdata imagemagick

WORKDIR /app

# Gemfile first for layer cache
COPY Gemfile Gemfile.lock* ./
RUN bundle config set --local without 'development test' && bundle install -j4

COPY . .

# Precompile bootsnap (optional)
RUN bundle exec rails assets:clobber 2>/dev/null || true

EXPOSE 3000

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
