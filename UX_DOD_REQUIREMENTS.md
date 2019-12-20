# UX DoD Requirements

## General information

UI developed within the Console and Compass UI should be compliant with [Fiori Design Guidelines](https://experience.sap.com/fiori-design-web/).

## Additional guidelines for modals

* User should be able to close the modal (without saving changes, if any) by clicking anywhere outside of it.
* Modal should support keyboard control:
    * If modal contains input fields, first of them should be automatically focused on opening the modal. In some cases, we can focus the most important element insted (e.g. invalid one).
    * If there is no input fields, user still should be able to navigate the modal by the means of keyboard only. Until modal is opened, focus should be trapped inside.
    * User should be able to close the modal by hitting the escape key (equivalent to clicking the `X` or `Cancel` button).
    * User should be able to confirm introduced changes (if any) by pressing the `enter`/`return` key (equivalent to clicking the `Confirm` button).
    * Main action (e.g. _Confirm_, _Save_, _Apply_) should use _emphasized_ style (read more [here](https://experience.sap.com/fiori-design-web/button)).
* If content of the modal is dynamic, try to avoid resizing the modal itself. What's more, modals' widths should be consistent across the application.
* Remember about [ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) attributes.

## Additional guidelines for Compass

* While creating validable forms, make sure to meet the requirements outlined [here](https://github.com/kyma-incubator/compass/blob/master/docs/architecture/input-validation.md).
* While using HTML input `type` attribute for validation, make sure to verify that their validation corresponds to one used on backend.
