ci-pr: resolve build validate test
ci-master: resolve build validate test
ci-release: resolve build validate test

resolve:
	npm install

build:
	npm run build

validate:
	eslint -c .eslinterrc ./src

test:
	CI=true npm run test

scan:
	sed -i -e 's/APIKEY/$(API_KEY)/g; s/USERKEY/$(USER_KEY)/g' /whitesource.config.json && cp /whitesource.config.json ./whitesource.config.json
	whitesource run