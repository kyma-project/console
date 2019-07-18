import React from "react";
import Applications from "../Applications";
import renderer from "react-test-renderer";
import { MockedProvider } from "react-apollo/test-utils";
import { GET_APPLICATIONS_MOCK } from "./mock";
import { shallow } from "enzyme";

const wait = require("waait");

describe("Applications", () => {
  it("should render loading state initially", () => {
    const component = renderer.create(
      <MockedProvider mocks={GET_APPLICATIONS_MOCK} addTypename={false}>
        <Applications />
      </MockedProvider>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  describe("processStatus()", () => {
    const component = shallow(<Applications />);
    const processStatusFn = component.instance().processStatus;

    it("Renders proper <Badge> when no prop is provided", async () => {
      expect(processStatusFn()).toMatchSnapshot();
    });

    it("Renders proper <Badge> when INITIAL prop is provided", async () => {
      expect(processStatusFn("INITIAL")).toMatchSnapshot();
    });

    it("Renders proper <Badge> when ERROR prop is provided", async () => {
      expect(processStatusFn("ERROR")).toMatchSnapshot();
    });
  });
});
