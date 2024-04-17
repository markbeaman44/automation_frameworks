# Use these for docker / CI / headless
build:
	docker-compose build

test-ci:
	docker-compose run behave

down:
	docker-compose down ${ARGS}

logs:
	docker-compose logs -f ${ARGS}

# Use these for local testing / GUI
up:
	python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt

test: up
	source venv/bin/activate && LOCAL=true behave features
