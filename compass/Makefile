IMG_NAME = compass-ui
IMG = $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(IMG_NAME)
TAG = $(DOCKER_TAG)

all: resolve prepare build validate test build-image push-image
ci-pr: resolve prepare validate test build-image push-image
ci-master: resolve prepare validate test build-image push-image
ci-release: resolve prepare validate test build-image push-image

resolve:
	npm install --no-optional

pull-licenses:
ifdef LICENSE_PULLER_PATH
	bash $(LICENSE_PULLER_PATH)
else
	mkdir -p licenses
endif

prepare:
	../scripts/prepare-react-components.sh -d react-components

build: 
	#npm run build

validate:
	#npm run lint-check
	#npm run eslint-check
	
test:
	#CI=true npm run test
	
	CI=true npm run start-and-test
	#npm run test-cypress

build-image: pull-licenses
	docker build -t $(IMG_NAME) .

push-image:
	docker tag $(IMG_NAME) $(IMG):$(TAG)
	docker push $(IMG):$(TAG)
