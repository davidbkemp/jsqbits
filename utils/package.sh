#!/bin/bash

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "1 argument required, $# provided"
echo creating release $1

mkdir -p jsqbits-doc-$1
rm -r jsqbits-doc-$1/*
rm jsqbits-doc-$1.tar.gz

git checkout $1

[ $? -eq 0 ] || die "Could not checkout the git tag"

cp -r jsqbits-$1.js jsqbitsManual.html jsqbitsTutorial.html jsqbitsRunner.html LICENSE README css js jsqbits-doc-$1

tar -czf jsqbits-doc-$1.tar.gz jsqbits-doc-$1

git checkout master
