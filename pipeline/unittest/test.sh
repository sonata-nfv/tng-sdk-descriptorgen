#!/bin/bash

# immediately exit after an error
set -e

# try to stop and delete potential previous containers (returns true even if there are none)
docker rm -fv descriptorgen || true
echo "Previous container(s) stopped and removed"

docker run --name descriptorgen --privileged -i -d registry.sonata-nfv.eu:5000/tng-sdk-descriptorgen:test
docker exec -i descriptorgen webdriver-manager update
echo "Webdriver manager updated, now starting unit tests"
docker exec -i descriptorgen protractor tng-sdk-descriptorgen/pipeline/unittest/conf.js

