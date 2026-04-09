# Use these for docker / CI / headless
build:
	docker-compose build

test-ci: build
	docker-compose run test

down:
	docker-compose down

logs:
	docker-compose logs -f

# Use these for local testing
test:
	venom run tests/*.yml
