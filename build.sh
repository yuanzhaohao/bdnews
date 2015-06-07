#!/bin/bash

if [ -e output ]; then
    rm -rf output
fi

if [ "$(uname)" == "Darwin" ]; then
    SED_REGEX_EXTEND=E
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    SED_REGEX_EXTEND=r
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
    SED_REGEX_EXTEND=r
fi

OPTIMIZE="-o 1 --domains"
if [ "$1" == "debug" ]; then
    # OPTIMIZE="--md5 1"
    OPTIMIZE=""
fi

fis release -d output -c $OPTIMIZE
mkdir -p output/smartnews
cp -r smartnews output/smartnews

if [ "$1" == "debug" ]; then
    cd output/template
    find . -type f -name "*.html" \
        -exec sed -$SED_REGEX_EXTEND -i '' -e '1,$s/\{%\/?literal%\}//g' {} \;
    exit 0 
fi

find output -type d -name .svn -exec rm -rf {} \; > /dev/null 2>&1 

# cp -r output/template output/static ../release/baiduapp

# rm -rf output
