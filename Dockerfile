FROM node:lts as web

WORKDIR /app
COPY web/package.json web/package-lock.json ./
RUN npm install

COPY web/ ./
RUN npm run build


FROM python:3 as server

RUN pip install flask pandas requests requests-cache uwsgi

WORKDIR /app
COPY backend/ ./

COPY --from=web /app/dist/ static/

EXPOSE 8000
ENV FLASK_APP web:application
ENV FLASK_ENV production
CMD ["uwsgi", "--host=0.0.0.0", "--port=8000", "web:application"]
