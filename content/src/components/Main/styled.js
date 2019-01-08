import styled from 'styled-components';

export const LeftSideWrapper = styled.div`
  box-sizing: border-box;
  text-align: left;
  flex: 0 0 auto;
  position: fixed;
  height: 100%;
  width: 280px;
  bottom: 0;
  z-index: 1;
  overflow: auto;
  background-color: #fff;
  -webkit-transition: -webkit-transform 0.2s ease-in-out;
  transition: -webkit-transform 0.2s ease-in-out;
  transition: transform 0.2s ease-in-out;
  transition: transform 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out;
  -webkit-box-shadow: 0 0 1px #ebebeb;
  box-shadow: 0 0 1px #ebebeb;
`;

export const CenterSideWrapper = styled.div`
  box-sizing: border-box;
  max-width: 1272px;
  padding: 0 30px;
  padding-left: 311px;

  text-align: left;
  flex: 1 1 auto;
`;