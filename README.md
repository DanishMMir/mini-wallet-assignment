
## About Assignment

The assignment was pretty straight forward. It was easy to implement and work on. Following are the key aspects you should consider while evaluating the assignment

- All core functions defined in the assignment have been completed.
- Transaction save has been implemented
- Transaction list has been implemented
- Frontend has been implemented in Vue implemented
- Pusher events have been implemented
- Auth has been implemented
- Developed as dockerized containers.
- Pagination implemented for listing endpoint.
- Data validation, normalization, concern separation taken care of.
- Data integrity, data consistency, atomocity, large scale data handling has been taken care of
- Laravel Pint used as a tool for maintaining code standards by fixing styles.
- GitHub Actions pipeline has been setup for running bulids.

## Environment
- Docker Desktop on Mac
- Docker Compose
- PHP 8.2
- Laravel 12
- Mysql 8
- Nginx

## Libraries
- `laravel/sanctum` for managing auth. (auth not implemented).
- `laravel/pint` for managing coding styles.
- `pusher/pusher-php-server` for pusher events

## How to use
- Clone main branch from GitHub `git clone https://github.com/DanishMMir/mini-wallet-assignment.git`
- `cd` into root of the project `cd  mini-wallet-assignment/`
- pull and start docker containers using `docker-compose up -d`
- install dependencies by running `docker-compose run  --rm composer install`
- It will install dependencies, create app key, copy .env.example into .env, migrate data, install and build assets
- If the above step fails to run commands, run them manually in following order
- run `cp .env.example .env`
- run `docker-compose run  --rm artisan key:generate`
- run `docker-compose run  --rm php npm install`
- run `docker-compose run  --rm php npm run build`
- connect your favourite MySQL tool (MySQL workbench) to the `mysql` docker container using below-mentioned credentials.
```
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=mini_wallet
    DB_USERNAME=homestead
    DB_PASSWORD=secret
```
- create a database named `mini_wallet` (If not already created during docker container setup) inside the `mysql` container by connecting to it by following the above step.
- run migrations `docker-compose run  --rm artisan migrate` if not already run as part of setup script
- The app should be live on `localhost:8080` now. It should show the Laravel welcome page.
- Register a user to login from the welcome page.
- You will need at-least a second user to make transactions. so create another one.
- Login by clicking on login on welcome page and giving email and password.
- The user will be redirected to transactions page after successful login.
- Manually put some balabce in the balance column of the users table to start transacting.
- Here you can make transactions. give an amount and the id of the receipient user to make a transaction.
- The transaction will be saved and a pusher event will be triggered to notify the sender and receipient user.
- The frontend end will auto update to show the new transaction for both sender and receiver.
- if any issues faced in setup, reach-out at mirdanishmajeed@gmail.com. I will be happy to help.

## What has been done
- Created database schemas necessary for the functionality.
- Implemented domain logic as per assignment to make the system work.
- Added proper API endpoints to be used for interacting with the system.
- Added an SPA frontend to interact with the headless APi system.
- Atomic transactions for data integrity
- row level locks for data consistency.
- Pusher events for real time updates.

## Main Functionality
- Bring up the docker containers `docker-compose up -d`
- Register, Login and make transactions.
- List transactions.
- Update balance and frontend by pusher events.

## Improvements that can be made
- More elaborate and complex database schema can be defined.
- Balance history after each transaction can be saved.
- coding standards can be improved by adding tools like phpstan, psalm, etc.
- A local build pipeline can be created to check if the new code follows the defined coding standards before committing.
- many more.
