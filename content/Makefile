APP_NAME = content
APP_PATH = content
BUILDPACK = eu.gcr.io/kyma-project/test-infra/buildpack-node:v20200428-02dd40a1

SCRIPTS_DIR = $(realpath $(shell pwd)/..)/scripts

verify:: validate-local

validate-local:
	npm run type-check

include $(SCRIPTS_DIR)/makefile-node-common.mk