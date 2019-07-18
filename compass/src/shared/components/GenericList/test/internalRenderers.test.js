import { renderActionElement } from "../internalRenderers";
import { mockActions, mockEntry } from "./mock";

describe("GenericList > internalRenderers", () => {
  describe("renderActionElement()", () => {
    it("Renders nothing if no args provided", async () => {
      expect(renderActionElement()).toMatchSnapshot();
    });

    it("Renders the popover if correct args are provided", async () => {
      expect(renderActionElement(mockActions, mockEntry)).toMatchSnapshot();
    });
  });
});
