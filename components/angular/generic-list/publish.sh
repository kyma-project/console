#!/bin/bash

rm -rd dist
npm run packagr
npm publish dist

