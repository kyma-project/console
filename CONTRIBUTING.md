
# Overview

To contribute to this project, follow the rules from the general [CONTRIBUTING.md](https://github.com/kyma-project/community/blob/master/CONTRIBUTING.md) document in the `community` repository.

## UX DoD Requirements

### General information

UI developed within the Console and Compass UI should be compliant with [Fiori Design Guidelines](https://experience.sap.com/fiori-design-web/).

### Additional guidelines for modals

* User should be able to close the modal (without saving changes, if any) by clicking anywhere outside of it.
* Modal should support keyboard control:
    * User should always be able to navigate the modal using only a keyboard. While the modal is opened, focus should not leave the modal window.
    * If the modal contains input fields, the first of them should be automatically focused on opening the modal. In some cases, we can set focus on the most important element instead (e.g. the incorrect one).
    * Main actions, such as **Confirm**,  **Save**, **Apply**, should use the [emphasized style](https://experience.sap.com/fiori-design-web/button).
* If the content of the modal is dynamic, avoid resizing the modal. Modals width should be consistent across the application.
* Follow the [ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) attributes.

### Additional guidelines for Compass

* When creating validable forms, make sure to meet the requirements outlined [here](https://github.com/kyma-incubator/compass/blob/master/docs/compass/03-input-validation.md).
* While using HTML input `type` attribute for validation, make sure to verify if their validation corresponds to the one used on the backend.
