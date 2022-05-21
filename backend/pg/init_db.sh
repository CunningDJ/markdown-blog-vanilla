#!/usr/bin/env bash

sd=`dirname ${0}`
DBNAME='markdownblog'

function run_psql_script_base() {
    local scriptname="$1"
    local db="$2";
    local scriptpath="$sd/psql/$scriptname"
    if [[ "$db" = "" ]]; then
        psql -U postgres -a -f "$scriptpath";
    else
        psql -U postgres -d $db -a -f "$scriptpath";
    fi
}

function run_psql_script () {
    local scriptname="$1"
    run_psql_script_base $scriptname $DBNAME
}

# CREATE DB: markdownblog
run_psql_script_base markdownblog.db.psql

# INSTALL EXTENSIONS
run_psql_script extensions.psql

# CREATE TABLES
## Create Table: article
run_psql_script article.table.psql