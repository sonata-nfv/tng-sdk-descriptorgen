#!/bin/bash
# todo: change to registry.sonata-nfv.eu:5000
docker build --no-cache -f DockerfilePipeline -t 5gtango/tng-sdk-descriptorgen:test .

