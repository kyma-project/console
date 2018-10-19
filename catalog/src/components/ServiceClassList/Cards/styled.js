import styled from 'styled-components';

export const CardWrapper = styled.div`
  box-sizing: border-box;
  padding: 10px 0;
  width: 100%;
  flex: 0 1 33.33%;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  position: relative;
  width: 45px;
  height: 45px;
  min-width: 45px;
  min-height: 45px;
  margin-right: 20px;
  line-height: 45px;
  text-align: center;
  border-radius: 4px;
  background-color: #f3f4f5;
  border: solid 1px rgba(63, 80, 96, 0.15);
  color: #32363a;
  font-size: 20px;
`;

export const CardImage = styled.img`
  max-width: 26px;
  max-height: 26px;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const CardHeader = styled.header``;

export const CardTitle = styled.h3`
  font-size: 16px;
`;

export const CardCompany = styled.h4`
  color: #b2b9bf;
`;

export const CardDescription = styled.p`
  flex-grow: 1;
`;

export const CardFooter = styled.footer``;

export const CardLabelWrapper = styled.div`
  display: inline-block;
  margin: 8px 8px 0 0;
`;

export const CardLabel = styled.div`
  display: inline-block;
  color: #515559;
  font-size: 12px;
  padding: 5px 8px;
  background-color: #eef5fc;
  border-radius: 4px;
  max-width: 75px;
  overflow-x: hidden
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    width: auto;
    max-width: 300px;
  }
`;

export const CardLabelWithTooltip = styled(CardLabel)`
  &:hover {
    background-color: #e2effd;
  }
`;
