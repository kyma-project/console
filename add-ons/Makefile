IMG_NAME = add-ons-ui
IMG = $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(IMG_NAME)
TAG = $(DOCKER_TAG)

ci-pr: root-pr resolve validate pre-build-image pull-licenses build-image push-image
ci-master: root-master resolve validate pre-build-image pull-licenses build-image push-image

.PHONY: root-pr
root-pr:
	make -C "../" ci-pr

.PHONY: root-master
root-master:
	make -C "../" ci-master

.PHONY: resolve
resolve:
	npm install

.PHONY: validate
resolve:
	npm run type-check

.PHONY: build
build:
	npm run build

.PHONY: pre-build-image
pre-build-image:
	../scripts/pre-build-docker-image.sh

.PHONY: pull-licenses
pull-licenses:
ifdef LICENSE_PULLER_PATH
	bash $(LICENSE_PULLER_PATH) --dirs-to-pulling="../,../common,../components/react,../components/shared,../components/generic-documentation"
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
	