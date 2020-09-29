.PHONY: dev postgres migrate drop generate docker cleanup

dev: cleanup generate
	cd client && yarn install && yarn build;
	air;

postgres:
	docker run -d --rm -it --network host \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_DB=wryteup_dev \
		postgres;
	sleep 2;

migrate: postgres
	migrate -source file://migrations \
					-database postgres://postgres:postgres@localhost/wryteup_dev?sslmode=disable up

drop:
	migrate -source file://migrations \
					-database postgres://postgres:postgres@localhost/wryteup_dev?sslmode=disable down

generate: migrate
	sqlc compile;
	sqlc generate;

docker:
	./scripts/create-env.sh;
	docker-compose up -d --build --force-recreate;

cleanup:
	sudo rm -rf pgdata;
	docker-compose down;

watch:
	docker-compose down;
	watchexec -w client -w src --exts js,css,html,go -r cd client; yarn build; air;


# TODO: deploy script