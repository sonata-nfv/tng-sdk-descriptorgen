#!/bin/bash
set -e
# override with smaller deployment docker container
docker build -f Dockerfile -t registry.sonata-nfv.eu:5000/tng-sdk-descriptorgen .
docker push registry.sonata-nfv.eu:5000/tng-sdk-descriptorgen
