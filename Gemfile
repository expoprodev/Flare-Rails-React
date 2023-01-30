# frozen_string_literal: true

ruby '3.1.3'
source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem "rails", "~> 7.0.0"
# Use postgresql as the database for Active Record
gem 'pg', '>= 0.18', '< 2.0'
# Use Puma as the app server
gem 'puma', '~> 4.3'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'jquery-rails'
gem 'terser'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
# gem "turbolinks", "~> 5"
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 2.13'
  gem 'selenium-webdriver'
end

group :development do
	# A Ruby static code analyzer, based on the community Ruby style guide
	gem "rubocop",  require: false
	gem "rubocop-rails",  require: false
	gem "rubocop-performance", require: false

  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'web-console', '>= 3.3.0'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'letter_opener'
  gem 'ordinare'
  gem 'prettier'
  gem 'pry-rails'
  gem 'rubocop'
  gem 'spring'
  gem 'boring_generators'
end
gem 'dotenv-rails', groups: %i[development test]
# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data'
gem 'wdm'
gem 'acts-as-taggable-on'
gem 'audited'
gem 'autoprefixer-rails'
gem 'aws-sdk-s3'
gem 'cancancan', '~> 3.0'
gem 'delayed_job_active_record'
gem 'devise'
gem 'devise-jwt'
gem 'devise_invitable'
gem 'fcm'
gem 'font-awesome-rails'
gem 'foundation-rails', '~> 6.4.3'
gem 'google_places'
gem 'houston'
gem 'inky-rb', require: 'inky'
gem 'mjml-rails'
gem 'newrelic_rpm'
gem 'paranoia'
gem 'premailer-rails'
gem 'pretender'
gem 'rack-cors'
gem 'react-rails'
gem "sentry-ruby"
gem "sentry-rails"
gem 'simple_form'
gem 'stripe', '~> 5.22'
gem 'twilio-ruby'
gem 'will_paginate'
gem 'will_paginate-foundation'
gem 'jsbundling-rails'


# for using pry as Rails console
gem "pry"
gem "pry-rails"


# for building APIs
gem 'graphql', '~> 1.11'

#search
gem "algoliasearch-rails"
