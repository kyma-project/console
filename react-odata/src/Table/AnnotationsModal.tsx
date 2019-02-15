import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { makeUnique } from './utils/utils';
interface Props {
  modalOpeningComponent: any;
  children?: any;
  data: any;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

const AnnotationsModal = (props: Props): JSX.Element => {
  const { modalOpeningComponent, children, data } = props;

  const [open, setOpen] = useState<boolean>(false);

  const columnData = data.children
    .flatMap((elem: { attributes: any }) => Object.keys(elem.attributes))
    .filter(makeUnique);

  return (
    <>
      <div onClick={() => setOpen(true)}>{modalOpeningComponent}</div>
      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        contentLabel="Example Modal"
        style={customStyles}
      >
        <AlignRight>
          <button onClick={() => setOpen(false)}>
            <b>{'Close'}</b>
          </button>
        </AlignRight>

        {children}
        <table>
          <thead>
            <tr>
              {columnData.map((elem: string, index: number) => (
                <th key={index}>{elem}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.children.map((child: any, index: number) => {
              return (
                <tr key={index}>
                  {columnData.map((el: any, idx: number) => {
                    return <th key={idx}>{child.attributes[el]}</th>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Modal>
    </>
  );
};

const AlignRight = styled.section`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 10px;
`;

export default AnnotationsModal;
