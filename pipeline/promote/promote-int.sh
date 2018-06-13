#!/bin/bash
set -e
docker tag registry.sonata-nfv.eu:5000/tng-sdk-descriptorgen:latest registry.sonata-nfv.eu:5000/tng-sdk-descriptorgen:int
docker push registry.sonata-nfv.eu:5000/tng-sdk-descriptorgen:int
