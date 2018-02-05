#!/bin/bash

# immediately exit after an error
set -e

docker tag registry.sonata-nfv.eu:5000/tng-sdk-descriptorgen:test registry.sonata-nfv.eu:5000/tng-sdk-descriptorgen:latest
docker push registry.sonata-nfv.eu:5000/tng-sdk-descriptorgen
