FROM nginx:stable

# copy custom config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static file and set correct right
COPY output /usr/share/nginx/ramle.be
RUN chown -R nginx:nginx //usr/share/nginx/ramle.be && chmod -R 755 /usr/share/nginx/ramle.be && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/nginx.conf && \
    chown -R nginx:nginx /var/cache/nginx

# set correct right to pid (and touch it), without that nginx crash
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 80
# non-root
USER nginx
