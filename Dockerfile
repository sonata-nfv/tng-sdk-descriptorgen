FROM nginx:alpine
COPY . /usr/share/nginx/html

# update the config to enable the 'ping' health endpoint
COPY descriptorgen.conf /etc/nginx/conf.d/descriptorgen.conf
RUN rm /etc/nginx/conf.d/default.conf

# set productionMode to false to use locally served descriptors (rather than from GitHub)
RUN sed -i -e 's/productionMode = true/productionMode = false/g' /usr/share/nginx/html/generate.js
