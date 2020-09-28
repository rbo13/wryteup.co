# wryteup.co
This approach uses a monorepo project. It means that my `client` and `server` are in this repository.

>DISCLAIMER: the ReactJS code lives under `client` and is just being rendered to the server, so thats why we need to create a build project before running the application with `yarn build`.

---
`client/` => ReactJS Code.
`src/`    => Go Code.

### Tech Stack
  - AWS
  - Docker/Docker Compose
  - PostgreSQL
  - ElasticSearch
  - Redis
  - Go
    * [fiber](https://github.com/gofiber/fiber)
    * [sqlc](https://github.com/kyleconroy/sqlc)
    * [golang-migrate](https://github.com/golang-migrate/migrate)
    * [elastic](https://github.com/olivere/elastic)
    * [go-redis](https://github.com/go-redis/redis)
    * [air](https://github.com/cosmtrek/air)
  - ReactJS

---
### Installation

This project requires [Go1.11+](https://golang.org/dl), [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/install/) to run. You can also use the Makefile to run the application, but `make` sure it's installed.

Install the dependencies using `go mod`:
```sh
$ cd wryteup.co
$ go mod download
```

### Developing/Contributing:
##### Pre-requisites:
- `migrate` command is working. Check the installation [here](https://github.com/golang-migrate/migrate/tree/master/cmd/migrate).
- `sqlc` command is working. Check the installation [here](https://github.com/kyleconroy/sqlc#installation).
---
```sh
$ cd wryteup.co
$ go mod download
$ make dev
```
If you dont want to install any of the necessary requirements mentioned above, then you can just run using docker.


> NOTE: to update your changes in the `client/` directory, run `yarn install` and then `yarn build` to create the react project.

---
# NOTE: Run the below commands if you just want to try or test the application without installing the necessary requirements in your local machine.
---
### Running
Either, with `docker-compose`:
```sh
$ cd wryteup.co
$ docker-compose up --build --force-recreate
```

Or run with `make`:
```sh
$ cd wryteup.co
$ make docker
```
Browse [http://localhost:9001](http://localhost:9001) in your browser.

# Migrations:
> NOTE: Run below command if, and only if you have `golang-migrate` installed on your local machine.
---
### Create migrations:
```sh
$ migrate create -ext sql -dir migrations create_users_table
```

### Running migrations:
```sh
$ migrate -source file://migrations \
          -database postgres://postgres:postgres@localhost/wryteup_dev?sslmode=disable up
```

---
### Tearing down:
```sh
$ docker-compose down
```