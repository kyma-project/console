APP_NAME = core-ui
IMG = $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(APP_NAME)
TAG = $(DOCKER_TAG)

all: root-pr resolve test build-image push-image
ci-pr: root-pr resolve test build-image push-image
ci-master: root-master resolve test build-image push-image

.PHONY: root-pr
root-pr:
	make -C "../" ci-pr

.PHONY: root-master
root-master:
	make -C "../" ci-master

.PHONY: resolve
resolve:
	cd .. && npm ci && npm run ci:libraries
	cd ../components/react && npm ci && npm run build
	npm ci --no-optional

.PHONY: test
test:
	CI=true npm run test

.PHONY: build
build:
	npm run build

licenses:
ifdef LICENSE_PULLER_PATH
	bash $(LICENSE_PULLER_PATH) --dirs-to-pulling="../,../common,../components/react,../components/shared,../components/generic-documentation"
else
	mkdir -p licenses
endif

.PHONY: build-image
build-image: licenses
	docker build -t $(APP_NAME) -f Dockerfile ..

.PHONY: push-image
push-image:
	docker tag $(APP_NAME) $(IMG):$(TAG)
	docker push $(IMG):$(TAG)
