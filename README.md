# Simple Task Management System

## Description

A task management system that allows users to create, update, delete, and fetch tasks.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)

## Installation

### Prerequisites

- Node.js
- npm
- MySQL

### Steps

```sh
# Clone the repository
$ git clone https://github.com/Gloryzco/niyo-task-manager-assessment.git

# Navigate into the project directory
$ cd niyo-task-manager-assessment

# Install dependencies
$ npm install

# Set up environment variables
# Create a .env file and add the required variables
# Example:

# APP_NAME="TASK_MANAGER"
# API_URL=
# APP_DEBUG=true
# APP_TIMEZONE=
# APP_PORT=3033
# DB_TYPE = mysql
# DB_HOST = your database host
# DB_PORT = your db port
# DB_USER = your username
# DB_PASSWORD = your password
# DB_NAME = your db name
# ACCESS_TOKEN_SECRET = your access token secret
# REFRESH_TOKEN_SECRET = your refresh token secret
# ACCESS_TOKEN_EXPIRATION = e.g. '15m'
# REFRESH_TOKEN_EXPIRATION = e.g. '7d'
```

## Usage

```sh
# build the application
$ npm run build

# Run database migrations
$ npm run migration:run

# Start the application
$ npm run start:dev

# Run unit test
$ npm run test

# Testing the socket
Locate and open the index.html file in the ./module/socket/gateways directory in a browser. Ensure that `const socket = io('http://localhost:3033');` uses the current port of your local. Once connected, any event (create, update, or delete) on a task will be emitted and outputted to the console.
```

## API Documentation

```s
SWAGGER>> http://localhost:3033/documentation
POSTMAN>> https://documenter.getpostman.com/view/3821701/2sA3QmEFEZ
```

THANK YOU 😊