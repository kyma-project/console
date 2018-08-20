import styled from 'styled-components';

export const CardWrapper = styled.div`
  box-sizing: border-box;
  padding: 10px 0;
  width: 100%;
  flex: 0 1 33.33%;
`;

export const CardContent = styled.div`
  box-sizing: border-box;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px rgba(63, 80, 96, 0.15);
  color: #3f5060;
  font-family: '72';
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  font-size: 14px;
  font-weight: 300;
  padding: 20px;
  margin: 10px;
  height: 100%;
  transition: box-shadow ease-out 0.2s;

  &:hover {
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1), 0 2px 14px 0 rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
`;

export const CardTop = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
`;

export const CardThumbnail = styled.div`
  width: 45px;
  height: 45px;
  min-width: 45px;
  min-height: 45px;
  margin-right: 20px;
  line-height: 45px;
  text-align: center;
  border-radius: 4px;
  background-color: #00b6ff;
  color: #ffffff;
  font-size: 19px;
`;

export const CardHeader = styled.div``;

export const CardTitle = styled.h3`
  font-size: 16px;
`;

export const CardCompany = styled.h4`
  color: #b2b9bf;
`;

export const CardDescription = styled.p``;
