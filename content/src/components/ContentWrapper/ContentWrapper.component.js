// import React from 'react';
// import styled from 'styled-components';
// import { Markdown, Toolbar } from '@kyma-project/react-components';
// import { sortByOrder, filterWithoutInternal } from '../../commons/helpers';
// import Highlight from 'react-highlight/lib/optimized.js';

// const Wrapper = styled.div`
//   box-sizing: border-box;
//   width: 100%;
//   margin: 0 0 20px 0;
//   text-align: left;
//   border-radius: 4px;
//   background-color: #ffffff;
//   box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.08);
//   font-family: '72';
//   font-weight: normal;
//   padding: 16px;
// `;

// const ContentHeader = styled.h2`
//   box-sizing: border-box;
//   width: 100%;
//   margin: 0;
//   margin-bottom: 26px;
//   font-size: 20px;
//   font-weight: bold;
//   &:first-letter {
//     text-transform: uppercase;
//   }
// `;

// const ContentDescription = styled.div`
//   box-sizing: border-box;
//   width: 100%;
//   margin: 0;
// `;

// const Anchor = styled.a`
//   display: block;
//   height: 0;
//   overflow: none;
//   visibility: hidden;
// `;

// const TextWrapper = styled.div`
//   font-size: 16px;
//   font-weight: normal;
//   color: #515559;
//   line-height: 1.57;
//   margin: 0;

//   code {
//     font-size: 14px;
//   }
// `;

// function ContentWrapper(props) {
//   let content = null,
//     docs = null;
//   if (!props.content.loading) {
//     if (props.content.content) {
//       content = props.content.content;
//       if (content.docs) {
//         docs = sortByOrder(content.docs);
//         docs = filterWithoutInternal(docs);
//       }
//     }
//   }

//   let lastTypeHash;
//   let removeSpaces = name => {
//     return name
//       .trim()
//       .replace(/ /g, '-')
//       .toLowerCase();
//   };

//   return (
//     <div>
//       {content && (
//         <div>
//           <Toolbar headline={content.displayName} customPadding={'28px 0'} />

//           {docs &&
//             docs.map((item, i) => {
//               const type = item.type ? item.type : item.title;
//               const hash = `${removeSpaces(type)}-${removeSpaces(item.title)}`;
//               let isFirtsOfType = false;
//               const currentTypeHash = `${removeSpaces(type)}-${removeSpaces(
//                 type,
//               )}`;

//               isFirtsOfType = lastTypeHash !== currentTypeHash;
//               lastTypeHash = currentTypeHash;

//               return (
//                 <Wrapper key={i}>
//                   {isFirtsOfType &&
//                     currentTypeHash !== hash && <Anchor id={currentTypeHash} />}
//                   <ContentHeader id={hash}>{item.title}</ContentHeader>
//                   <ContentDescription>
//                     <TextWrapper>
//                       <Markdown>
//                         <Highlight
//                           languages={['javascript', 'go']}
//                           innerHTML={true}
//                         >
//                           {item.source}
//                         </Highlight>
//                       </Markdown>
//                     </TextWrapper>
//                   </ContentDescription>
//                 </Wrapper>
//               );
//             })}
//         </div>
//       )}
//     </div>
//   );
// }
// export default ContentWrapper;
