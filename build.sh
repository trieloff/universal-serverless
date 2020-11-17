#!/bin/sh
rm hello.zip
cd hello
zip ../hello.zip -r *
cd ..
# zip again for azure
zip hello.zip -r hello