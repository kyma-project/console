IMG_NAME = console-integration
IMG = $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(IMG_NAME)
TAG = $(DOCKER_TAG)

ci-pr: install-dependencies validate build-image push-image
ci-master: install-dependencies validate build-image push-image
ci-release: install-dependencies validate build-image push-image

install-dependencies:
	npm ci

validate:

# scan:
# 	sed -i -e 's/APIKEY/$(API_KEY)/g; s/USERKEY/$(USER_KEY)/g' /whitesource.config.json && cp /whitesource.config.json ./whitesource.config.json
# 	whitesource run

build-image:
	docker build -t $(IMG_NAME) .

push-image:
	docker tag $(IMG_NAME) $(IMG):$(TAG)
	docker push $(IMG):$(TAG)
