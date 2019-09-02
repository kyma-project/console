IMG_NAME = service-catalog-ui
IMG = $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(IMG_NAME)
TAG = $(DOCKER_TAG)

ci-pr: root-pr resolve validate test prepare build-image push-image
ci-master: root-master resolve validate test prepare build-image push-image
ci-release: root-master resolve validate test prepare build-image push-image

root-pr:
	make -C "../" ci-pr

root-master:
	make -C "../" ci-master

resolve:
	npm install --unsafe-perm

pull-licenses:
ifdef LICENSE_PULLER_PATH
	bash $(LICENSE_PULLER_PATH)
else
	mkdir -p licenses
endif

prepare:
	../scripts/pre-build-docker-image.sh

build:
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
