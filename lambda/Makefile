IMG_NAME = lambda
IMG = $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(IMG_NAME)
TAG = $(DOCKER_TAG)

ci-pr: resolve validate test build build-image push-image
ci-master: resolve validate test build build-image push-image
ci-release: resolve validate test build build-image push-image

resolve:
	npm install --no-optional

pull-licenses:
ifdef LICENSE_PULLER_PATH
	bash $(LICENSE_PULLER_PATH)
else
	mkdir -p licenses
endif

validate:
	npm run lint

test:
	npm run test

build:
	npm run build

build-image: pull-licenses
	docker build -t $(IMG_NAME) .

push-image:
	docker tag $(IMG_NAME) $(IMG):$(TAG)
	docker push $(IMG):$(TAG)
