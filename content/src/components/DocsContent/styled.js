import styled from "styled-components";

export const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 0 0 20px 0;
  text-align: left;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.08);
  font-family: '72';
  font-weight: normal;
  padding: 16px;
`;

export const ContentHeader = styled.h2`
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  margin-bottom: 26px;
  font-size: 20px;
  font-weight: bold;
  &:first-letter {
    text-transform: uppercase;
  }
`;

export const ContentDescription = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 0;
`;

export const Anchor = styled.a`
  display: block;
  height: 0;
  overflow: none;
  visibility: hidden;
`;

export const TextWrapper = styled.div`
  font-size: 16px;
  font-weight: normal;
  color: #515559;
  line-height: 1.57;
  margin: 0;

  code {
    font-size: 14px;
  }
`;