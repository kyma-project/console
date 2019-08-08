IMG_NAME = service-catalog-ui
IMG = $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(IMG_NAME)
TAG = $(DOCKER_TAG)

ci-pr: resolve build validate test build-image push-image
ci-master: resolve build validate test build-image push-image
ci-release: resolve build validate test build-image push-image

resolve:
	npm install --unsafe-perm

pull-licenses:
ifdef LICENSE_PULLER_PATH
	bash $(LICENSE_PULLER_PATH)
else
	mkdir -p licenses
endif

build:
	../scripts/prepare-react-components.sh -d react-components
	rm -rf ./brokers/node_modules/@kyma-project/react-components/lib/index.js
	rm -rf ./catalog/node_modules/@kyma-project/react-components/lib/index.js
	rm -rf ./instances/node_modules/@kyma-project/react-components/lib/index.js
	cp ./react-components/index.js ./brokers/node_modules/@kyma-project/react-components/lib/index.js
	cp ./react-components/index.js ./catalog/node_modules/@kyma-project/react-components/lib/index.js
	cp ./react-components/index.js ./instances/node_modules/@kyma-project/react-components/lib/index.js
	npm run-script build

validate:
	npm run lint-check
	npm run eslint-check
	
test:
	CI=true npm run test

build-image: pull-licenses
	docker build -t $(IMG_NAME) .

push-image:
	docker tag $(IMG_NAME) $(IMG):$(TAG)
	docker push $(IMG):$(TAG)
