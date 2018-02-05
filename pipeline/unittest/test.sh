#!/bin/bash

# immediately exit after an error
set -e

docker run --name descriptorgen --rm -i -d -it 5gtango/tng-sdk-descriptorgen:test
echo "Test container running"
sleep 1
docker exec -i -d -it descriptorgen webdriver-manager start
echo "Webdriver-manager starting (for protractor unit tests)"
sleep 3
docker exec -i -it descriptorgen protractor tng-sdk-descriptorgen/pipeline/unittest/conf.js

