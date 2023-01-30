# README

Prerequisites
Before we begin, make sure you have the following installed:

install ruby 3.1.2

Node.js v18.x or later

npm v7.x or yarn 1.22.x or later

git v2.14.1 or later

heroku cli or foreman

Postgresql 14 or later

# Install Depenencies

Ruby Gems

```
$ bundle install
```

Node Mudules

```
$ yarn install
```

# running the project

Start the rails server

```
heroku local web
```

start the frontend react app

```
yarn build:watch
```

# Configuration

Copy the .env.example to .env

```
$ cp .env.example .env
```

# Database creation

```
psql> create database crowdflare_development;
```

# Database initialization

```
$ rails db:schema:load
$ rails db:migrate
```

# Running the project

Start the rails server

```
$ heroku local web

// start the job worker (optional)
$ heroku local web
```

start the frontend react app

```
yarn build:watch
```

Visit http://localhost:3000/

# Deployment instructions

Deployments are hosted on heroku and are automatically deployed to staging on merge to the main branch.
