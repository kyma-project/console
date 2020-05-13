IMG_NAME = console
IMG = $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(IMG_NAME)
TAG = $(DOCKER_TAG)

release: build-image push-image

resolve:
	cd .. && npm install --no-optional # Install common dependencies 
	npm ci

pull-licenses:
ifdef LICENSE_PULLER_PATH
	bash $(LICENSE_PULLER_PATH)
else
	mkdir -p licenses
endif

verify: lint test 

lint:
	npm run lint

test:
	npm run test

build:
	npm run build

build-image: 
	docker build -t $(IMG_NAME) -f Dockerfile ..

push-image:
	docker tag $(IMG_NAME) $(IMG):$(TAG)
	docker push $(IMG):$(TAG)

