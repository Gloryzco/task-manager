# Simple Task Management System

## Description
A task management system that allows users to create, update, delete, and fetch tasks.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

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
$ cd task-management

# Install dependencies
$ npm install

# Set up environment variables
# Create a .env file and add the required variables
# Example:
# DATABASE_URL=postgres://user:password@localhost:5432/taskdb
# JWT_SECRET=yourjwtsecret

# Run database migrations
$ npm run typeorm migration:run

# Start the application
$ npm run start:dev
