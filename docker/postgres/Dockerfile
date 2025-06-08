FROM postgres:17.5

COPY 00_init.sql /docker-entrypoint-initdb.d/0-init.sql
COPY 01_import.sql /docker-entrypoint-initdb.d/1-import.sql

COPY tconst_list.txt /docker-entrypoint-initdb.d/
