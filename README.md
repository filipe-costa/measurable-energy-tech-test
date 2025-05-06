# measurable-energy-tech-test

Measurable Energy Tech Test monorepo

# Setup Instructions

- Before running the following steps, make sure that `docker` is up and running.
- Run `sh scripts`

  - Builds docker image for api
  - Runs docker compose for api and database services
  - Installs node_modules in the UI folder
  - Starts UI

- You can access the UI at `http://localhost:5731`
- You can access the Swagger documentation at `http//localhost:3000/swagger`

#### Tests

- To run tests:
  - Change to API directory
  - Unit tests: `npm run test:cov`
  - Integration tests: `npm run test:it:cov`

# Tooling explanation

- Backend:

  - For the API, I decided to use Nestjs (builds on top of Expressjs) because not only it helps to quickly build an API but it also has a strong and rich ecosystem.
  - For the Database, I decided to use MikroORM with Postgresql because it uses Unit of Work and Transactions which helps at scale.
  - For both integration and unit tests I used Jest testing library because it is the most commonly used.
  - For integration tests, I used testcontainers as they allow you to use an actual postgres database, unlike in-memory databases where they might not offer all the necessary functionality.

- Frontend:
  - For the UI, I decided to use material-react-table instead of trying to reinvent the wheel.
  - For the build tool, I used Vite with Typescript.
