#!/bin/bash
set -e
docker build -f DockerfilePipeline -t registry.sonata-nfv.eu:5000/tng-sdk-descriptorgen .
