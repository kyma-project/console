IMG_NAME = console
IMG = $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(IMG_NAME)
TAG = $(DOCKER_TAG)

ci-pr: install-dependencies validate test build build-image push-image
ci-master: install-dependencies validate test build build-image push-image
ci-release: install-dependencies validate test build build-image push-image

copy-generic-list:
	rm -r src/app/generic-list || true
	cp -R ../components/angular/generic-list/src/app/modules/list src/app/generic-list

recreate-symlink:
	rm -r src/app/generic-list || true
	ln -s ../../../components/angular/generic-list/src/app/modules/list src/app/generic-list

install-dependencies:
	npm ci

validate:
	npm run lint

test:
	make copy-generic-list
	npm run test:single
	make recreate-symlink

build:
	npm run build

scan:
	sed -i -e 's/APIKEY/$(API_KEY)/g; s/USERKEY/$(USER_KEY)/g' /whitesource.config.json && cp /whitesource.config.json ./whitesource.config.json
	whitesource run

build-image:
	docker build -t $(IMG_NAME) .

push-image:
	docker tag $(IMG_NAME) $(IMG):$(TAG)
	docker push $(IMG):$(TAG)
