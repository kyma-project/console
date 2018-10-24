IMG_NAME = content-ui
IMG = $(DOCKER_PUSH_REPOSITORY)/$(DOCKER_PUSH_DIRECTORY)/$(IMG_NAME)
TAG = $(DOCKER_TAG)

resolve:
	npm install

build:
	../scripts/prepare-react-components.sh -d react-components
	npm run build

validate:
	eslint -c .eslinterrc ./src

unit-tests:
	CI=true npm run test

build-image:
	docker build -t $(IMG_NAME) .

push-image:
	docker tag $(IMG_NAME) $(IMG):$(TAG)
	docker push $(IMG):$(TAG)