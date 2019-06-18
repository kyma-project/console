import styled from 'styled-components';

const StyledSwagger = styled.section`
  .opblock-tag > a > span {
      /* font-size: 10px; */
    }  
  }
  span.schemes-title{
    display:none;
  }

  div.scheme-container {
    margin: 0;
    padding: 0;
    box-shadow: none;
  }

  &&{
      div.opblock {
      box-shadow: none;
      background-color: white;
      border: solid 1px rgba(151, 151, 151, 0.26);
      /* border-radius: 4px; */
    }
  }

  div.opblock-summary {
    
  }
  && {
    div.opblock-summary.opblock-summary-post{
      border-bottom: solid 1px rgba(151, 151, 151, 0.26);
      span.opblock-summary-method {
        background-color: #ebfaf4;
        color: rgb(73, 204, 144);
        border-bottom: #89919a;
      }
    } 
  }
  
`;

export { StyledSwagger };
