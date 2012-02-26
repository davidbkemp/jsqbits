#!/bin/bash

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "1 argument required, $# provided"
echo creating release $1

git checkout $1

[ $? -eq 0 ] || die "Could not checkout the git tag"

mkdir -p jsqbits-$1
rm -r jsqbits-$1/*

cp -r jsqbits-$1.js jsqbitsManual.html jsqbitsRunner.html LICENSE README css js jsqbits-$1

git checkout master
