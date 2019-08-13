ci-pr: resolve validate validate-libraries
ci-master: resolve validate validate-libraries

.PHONY: resolve
resolve:
	npm run bootstrap:ci

.PHONY: validate
validate:
	npm run conflict-check
	npm run lint-check
	# npm run markdownlint
	npm run type-check

.PHONY: validate-libraries
validate:
	cd common && npm run type-check
	cd components/shared && npm run type-check
	cd components/generic-documentation && npm run type-check
