APP_NAME = ui-tests
APP_PATH = tests
BUILDPACK = eu.gcr.io/kyma-project/test-infra/buildpack-node:v20200428-02dd40a1
SCRIPTS_DIR = $(realpath $(shell pwd)/..)/scripts

include $(SCRIPTS_DIR)/makefile-node-common.mk

build-image: pull-licenses
	docker build -t $(IMG_NAME) .


