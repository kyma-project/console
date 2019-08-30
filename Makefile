ci-pr: resolve
ci-master: resolve

.PHONY: resolve
resolve:
	npm install --only=prod
	cd components/react && npm install
	cd components/react && npm run build
	cd components/generic-documentation && npm install
	cd components/generic-documentation && npm run build