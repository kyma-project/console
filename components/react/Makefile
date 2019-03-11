ci-pr: resolve build validate test
ci-master: resolve build validate test
ci-release: resolve build validate test

resolve:
	npm install

build:
	npm run build

validate:
	npm run lint-check
	eslint -c .eslinterrc ./src

test:
	CI=true npm run test
	