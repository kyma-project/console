IMG_NAME = console
IMG = $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(IMG_NAME)
TAG = $(DOCKER_TAG)

ci-pr: install-dependencies validate test build build-image push-image
ci-master: install-dependencies validate test build build-image push-image
ci-release: install-dependencies validate test build build-image push-image

install-dependencies:
	cd .. && npm install --no-optional # Install common dependencies 
	npm ci

pull-licenses:
ifdef LICENSE_PULLER_PATH
	bash $(LICENSE_PULLER_PATH)
else
	mkdir -p licenses
endif

validate:
	npm run lint

test:
	npm run test:single

build:
	npm run build

build-image: pull-licenses
	docker build -t $(IMG_NAME) .

push-image:
	docker tag $(IMG_NAME) $(IMG):$(TAG)
	docker push $(IMG):$(TAG)
