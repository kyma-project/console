#!/usr/bin/env bash

set -e

readonly ARGS=("$@")
readonly TEMP_DIR="temp"
readonly SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
readonly ROOT_DIR="$( cd "${SCRIPT_DIR}/.." && pwd )"

COPY_ROOT_NODE_MODULES=false
function read_arguments() {
    for arg in "${ARGS[@]}"
    do
        case $arg in
            --copy-root-node-modules)
                COPY_ROOT_NODE_MODULES=true
                shift # past argument with no value
                ;;
            *)
                # unknown option
            ;;
        esac
    done
    readonly COPY_ROOT_NODE_MODULES
}

function copyFiles() {
  mkdir -p "${PWD}/${TEMP_DIR}" 

  echo "Copying files"
  if [ "${COPY_ROOT_NODE_MODULES}" == true ]; then
    cp -R  "${ROOT_DIR}/node_modules" "${PWD}/${TEMP_DIR}/node_modules/"
  fi

  local files="package.json package-lock.json gulpfile.js tsconfig.base.json"
  local filesArray=(${files})

  for f in "${filesArray[@]}"; do
    cp "${ROOT_DIR}/${f}" "${PWD}/${TEMP_DIR}/"
  done

  local dirs="common components shared"
  local dirsArray=(${dirs})

  for d in "${dirsArray[@]}"; do
    cp -R "${ROOT_DIR}/${d}" "${PWD}/${TEMP_DIR}/${d}/"
  done
}

function main() {
    read_arguments "${ARGS[@]}"
    copyFiles
}

main
