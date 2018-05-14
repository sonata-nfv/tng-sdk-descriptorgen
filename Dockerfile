FROM nginx:alpine
COPY . /usr/share/nginx/html

# update the config to enable the 'ping' health endpoint
COPY descriptorgen.conf /etc/nginx/conf.d/descriptorgen.conf
RUN rm /etc/nginx/conf.d/default.conf
