ci-pr: root-pr resolve build test
ci-master: root-master resolve build test

.PHONY: root-pr
root-pr:
	make -C "../../" ci-pr

.PHONY: root-master
root-master:
	make -C "../../" ci-master

.PHONY: resolve
resolve:
	npm install

.PHONY: build
build:
	npm run build

.PHONY: test
test:
	CI=true npm run test
	