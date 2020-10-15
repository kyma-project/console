import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { SideDrawer } from '../components/SideDrawer/SideDrawer';

export const useSideDrawer = (
  withYamlEditor,
  initialContent,
  bottomContent,
  buttonText = 'YAML code',
  isOpenInitially = false,
) => {
  const [content, setContent] = useState(initialContent);
  const [isOpen, setOpen] = useState(isOpenInitially);

  useEffect(() => {
    // return a function to skip changing the open state on initial render
    return _ => setOpen(true);
  }, [content]);

  const drawerComponent = content ? (
    <SideDrawer
      withYamlEditor={withYamlEditor}
      isOpen={isOpen}
      setOpen={setOpen}
      buttonText={buttonText}
      bottomContent={bottomContent}
    >
      {content}
    </SideDrawer>
  ) : null;

  return [drawerComponent, setContent, setOpen];
};

useSideDrawer.propTypes = {
  initialContent: PropTypes.any,
  bottomContent: PropTypes.any,
  withYamlEditor: PropTypes.bool,
  buttonText: PropTypes.string,
  isOpenInitially: PropTypes.bool,
};
