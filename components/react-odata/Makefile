ci-pr: resolve build validate test lint
ci-master: resolve build validate test lint
ci-release: resolve build validate test lint

resolve:
	npm install

build:
	npm run build

validate:
	npm run conflict-check
	npm run lint-check

lint:
	npm run lint-fix

test:
	CI=true npm run test