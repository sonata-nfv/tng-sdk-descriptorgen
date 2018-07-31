#!/bin/bash

# immediately exit after an error
set -e

# try to stop and delete potential previous containers (returns true even if there are none)
docker rm -fv descriptorgen || true
echo "Previous container(s) stopped and removed"

docker run --name descriptorgen --privileged -i -d registry.sonata-nfv.eu:5000/tng-sdk-descriptorgen:v4.0
echo "New descriptorgen container started"
docker exec -i descriptorgen webdriver-manager update
echo "Webdriver manager updated"
docker exec -i -d descriptorgen webdriver-manager start
sleep 5
echo "Webdriver manager started, now starting unit tests"
docker exec -i descriptorgen protractor tng-sdk-descriptorgen/pipeline/unittest/conf.js

