FROM python:3.10-slim

# install chromium
RUN apt update && apt install -y --no-install-recommends chromium chromium-driver
RUN apt autoclean && rm -rf /var/lib/apt/lists/*

WORKDIR /tmp

ADD requirements.txt /tmp/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

WORKDIR /var/app
