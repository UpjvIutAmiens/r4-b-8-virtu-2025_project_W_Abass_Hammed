#!/bin/bash

curl -o title.ratings.tsv.gz https://datasets.imdbws.com/title.ratings.tsv.gz

gunzip -c title.ratings.tsv.gz | awk 'BEGIN {FS="\t"} NR>1 {print $1}' > docker/postgres/tconst_list.txt

rm title.ratings.tsv.gz

echo "Generated $(wc -l < docker/postgres/tconst_list.txt) tconst entries"
