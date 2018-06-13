#!/bin/bash

# immediately exit after an error
set -e

# try to stop and delete potential previous containers (returns true even if there are none)
docker rm -fv descriptorgen || true
echo "Previous container(s) stopped and removed"

docker run --name descriptorgen --privileged -i -d registry.sonata-nfv.eu:5000/tng-sdk-descriptorgen:test
docker exec -i -d descriptorgen webdriver-manager update
echo "Test container running and up-to-date"
sleep 5
docker exec -i -d descriptorgen webdriver-manager start
echo "Webdriver-manager starting (for protractor unit tests)"
sleep 5
docker exec -i descriptorgen protractor tng-sdk-descriptorgen/pipeline/unittest/conf.js

