ci-pr: resolve build validate test
ci-master: resolve build validate test
ci-release: resolve build validate test

resolve:
	npm install

build:
	npm run build

validate:
	npm run conflict-check
	npm run lint-check

test:
	CI=true npm run test