IMG_NAME = lambda
IMG = $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(IMG_NAME)
TAG = $(DOCKER_TAG)

ci-pr: resolve validate test build build-image push-image
ci-master: resolve validate test build build-image push-image
ci-release: resolve validate test build build-image push-image

copy-generic-list:
	rm -r src/app/generic-list
	cp -R ../components/angular/generic-list/src/app/modules/list src/app/generic-list

resolve:
	npm install --no-optional

validate:
	npm run lint

test:
	npm run test

scan:
	sed -i -e 's/APIKEY/$(API_KEY)/g; s/USERKEY/$(USER_KEY)/g' /whitesource.config.json && cp /whitesource.config.json ./whitesource.config.json
	whitesource run

build:
	npm run build

build-image:
	docker build -t $(IMG_NAME) .

push-image:
	docker tag $(IMG_NAME) $(IMG):$(TAG)
	docker push $(IMG):$(TAG)
