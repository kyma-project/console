IMG_NAME = service-catalog-ui
IMG = $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(IMG_NAME)
TAG = $(DOCKER_TAG)

ci-pr: root-pr resolve test build pre-build-image pull-licenses build-image push-image
ci-master: root-master resolve test build pre-build-image pull-licenses build-image push-image

.PHONY: root-pr
root-pr:
	make -C "../" ci-pr

.PHONY: root-master
root-master:
	make -C "../" ci-master

.PHONY: resolve
resolve:
	# mkdir -p scripts
	# cp ../scripts/load-cluster-config.sh scripts/
	# cp ../.clusterConfig.default /app/service-catalog/
	npm install --unsafe-perm

.PHONY: test
test:
	#CI=true npm run test

.PHONY: build
build:
	npm run-script build

.PHONY: pre-build-image
pre-build-image:
	../scripts/pre-build-docker-image.sh

.PHONY: pull-licenses
pull-licenses:
ifdef LICENSE_PULLER_PATH
	bash $(LICENSE_PULLER_PATH) --dirs-to-pulling="../,brokers,catalog,instances,../common,../components/react,../components/shared,../components/generic-documentation"
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
