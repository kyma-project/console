FROM cypress/included:5.0.0

WORKDIR /usr/src/app

RUN echo  " node version:    $(node -v) \n" \
  "npm version:     $(npm -v) \n" \
  "yarn version:    $(yarn -v) \n" \
  "debian version:  $(cat /etc/debian_version) \n" \
  "user:            $(whoami) \n" \
  "chrome:          $(google-chrome --version || true) \n" \
  "firefox:         $(firefox --version || true) \n"

COPY package*.json ./
RUN npm install
LABEL source git@github.com:kyma-project/console.git
COPY . .
