IMG_NAME = compass-ui
IMG = $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(IMG_NAME)
TAG = $(DOCKER_TAG)

all: resolve test pre-build-image build-image push-image
ci-pr: resolve test pre-build-image pull-licenses build-image push-image
ci-master:  resolve test pre-build-image pull-licenses build-image push-image


.PHONY: resolve
resolve:
	cd .. && npm ci
	cd ../components/react && npm ci && npm run build
	npm ci

.PHONY: test
test:
	CI=true npm run test

.PHONY: build
build:
	npm run build

.PHONY: pre-build-image	
pre-build-image:	
	../scripts/pre-build-docker-image.sh	


.PHONY: pull-licenses
pull-licenses:
ifdef LICENSE_PULLER_PATH
	@echo "Pulling licenses..."
	bash $(LICENSE_PULLER_PATH) --dirs-to-pulling="../,../common,../components/react,../components/shared,../components/generic-documentation" > null
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
