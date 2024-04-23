FROM python:3.10-slim

WORKDIR /tmp

ADD requirements.txt /tmp/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

WORKDIR /var/app
