FROM postgres:17.5

COPY 00_init.sql /docker-entrypoint-initdb.d/

COPY tconst_list.txt /docker-entrypoint-initdb.d/
