FROM nginx:alpine

# Копіюємо білд (статичні файли) у стандартну nginx папку
COPY build /usr/share/nginx/html

# (опційно) Можна скопіювати свою конфігурацію
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080