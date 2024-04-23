## Installation
```
Install docker
# https://docs.docker.com/desktop/install/mac-install/

Install python 3.10 minimum
# brew install pyenv
# pyenv install 3.10.10
# pyenv global 3.10.10
```


## Run your end-to-end tests via docker/ci
```
make build
```
builds docker image against requirements.txt
```
make test-ci
```
execute tests (run in background)
```
make down
```
removes docker image

## Run your end-to-end tests via venv/GUI
```
make up
```
builds python venv and activates source
```
make test
```
executes tests
