.PHONY: dev postgres migrate cleanup

dev: cleanup migrate
	cd client && yarn build;
	air;

postgres:
	docker run -d --rm -it --network host \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_DB=wryteup_dev \
		postgres

migrate: postgres
	migrate -source file://migrations \
					-database postgres://postgres:postgres@localhost/wryteup_dev?sslmode=disable up

# dev: cleanup
# 	docker-compose --env-file=.env up -d --build --force-recreate;

cleanup:
	sudo rm -rf pgdata;
	docker-compose down;