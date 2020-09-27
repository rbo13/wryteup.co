.PHONY: dev cleanup

dev: cleanup
	docker-compose --env-file=.env up -d --build --force-recreate;

cleanup:
	sudo rm -rf pgdata;
	docker-compose down;