#!/usr/bin/env bash

cd /opt/hejmdal
. ./docker/env.docker

yarn install
npm run migrate:latest
npm run start
