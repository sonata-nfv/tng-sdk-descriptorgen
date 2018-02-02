#!/bin/bash

# immediately exit after an error
set e

docker run --name descriptorgen --rm -d -it 5gtango/tng-sdk-descriptorgen:test
docker exec -d -it descriptorgen webdriver-manager start
sleep 3
docker exec -it descriptorgen protractor tng-sdk-descriptorgen/pipeline/unittest/conf.js

