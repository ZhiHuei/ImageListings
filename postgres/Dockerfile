FROM postgres:13.3

ADD /tables/ /docker-entrypoint-initdb.d/tables/
ADD deployschemas.sql /docker-entrypoint-initdb.d/