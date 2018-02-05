#!/bin/bash

# immediately exit after an error
set -e

# try to stop and delete potential previous containers
# if there's no container, it prints an error message but keeps going (due to || true)
#docker stop descriptorgen || true && docker rm -fv descriptorgen || true
docker rm -fv descriptorgen || true
echo "Previous container(s) stopped and removed"

docker run --name descriptorgen --rm -i -d 5gtango/tng-sdk-descriptorgen:test
docker exec -i -d descriptorgen webdriver-manager update
echo "Test container running and up-to-date"
sleep 1
docker exec -i -d descriptorgen webdriver-manager start
echo "Webdriver-manager starting (for protractor unit tests)"
sleep 3
docker exec -i descriptorgen protractor tng-sdk-descriptorgen/pipeline/unittest/conf.js

#docker stop descriptorgen

