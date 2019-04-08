#!/usr/bin/env bash
set -x

yarn build && \
yarn test && \
rm -rf dist && \
cp -r src dist && \
cp package.json tsconfig.json README.md dist && \
pushd dist && \
npm publish && \
popd
