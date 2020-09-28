

Migrations:
---
Create migrations:
$ mgirate create -ext sql -dir migrations create_users_table

Running migrations:
$ migrate -source file://migrations \
					-database postgres://postgres:postgres@localhost/wryteup_dev?sslmode=disable up