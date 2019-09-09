IMG_NAME = ui-tests
IMG = $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(IMG_NAME)
TAG = $(DOCKER_TAG)

ci-pr: root-pr resolve pull-licenses build-image push-image
ci-master: root-master resolve pull-licenses build-image push-image

.PHONY: root-pr
root-pr:
	make -C "../" ci-pr

.PHONY: root-master
root-master:
	make -C "../" ci-master

.PHONY: resolve
resolve:
	npm ci

.PHONY: pull-licenses
pull-licenses:
ifdef LICENSE_PULLER_PATH
	bash $(LICENSE_PULLER_PATH)
else
	mkdir -p licenses
endif

.PHONY: build-image
build-image:
	docker build -t $(IMG_NAME) .

.PHONY: push-image
push-image:
	docker tag $(IMG_NAME) $(IMG):$(TAG)
	docker push $(IMG):$(TAG)
