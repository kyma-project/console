import styled from 'styled-components';
import { Popover as P } from 'fundamental-react';

export const Popover = styled(P)`
  && {
    border: solid 1px rgba(137, 145, 154, 0.45);
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0 1px 0 rgba(218,222,230,.5), 0 2px 8px 0 rgba(0,8,26,.2);
    margin-top: 5px;
    z-index:5;

    .fd-popper__arrow {
      display: none;
    }
    ::before, ::after {
      height: 0;
      width: 0;
      border-style: solid;
      border-width: 0 6.5px 8px 6.5px;
      border-color: transparent;
      content: "";
      position: absolute;
      right: 22px; 
      left: auto;
    }
    ::before {
      border-bottom-color: #fff;
      top: -8px;
      z-index: 4;
    }
    ::after {
      border-bottom-color: #89919a;
      top: -9px;
      z-index: 3;
    }
    
    &[data-placement^="bottom"] {
      margin:0;
      margin-top:5px;
      &::before, &::after {
        border-color: transparent;
        border-bottom-color: #fff;
        top: -8px;
        left: 50%; 
        transform:translateX(-50%);
        bottom: auto;
      }
      &::after {
        border-bottom-color: #89919a;
        top: -9px;
      }
    }

    &[data-placement^="top"] {
      margin:0;
      margin-bottom:5px;
      &::before, &::after {
        border-width: 8px 6.5px 0 6.5px;
        border-color: transparent;
        border-top-color: #fff;
        top: auto;
        bottom: -8px;
        left: 50%; 
        transform:translateX(-50%);
      }
      &::after {
        border-top-color: #89919a;
        bottom: -9px;
      }
    }

    &[data-placement="bottom-start"], &[data-placement="top-start"]  {
      &::before, &::after {
        right: auto; 
        left: 22px;
      }
    }

    &[data-placement="bottom-end"], &[data-placement="top-end"] {
      &::before, &::after {
        right: 22px; 
        left: auto;
      }
    }


    &[data-placement^="right"] {
      margin:0;
      margin-left:5px;
      &::before, &::after {
        border-width: 6.5px 8px 6.5px 0;
        border-color: transparent;
        border-right-color: #fff;
        bottom: auto;
        left: -8px;
        top: 50%; 
        transform:translateY(-50%);
      }
      &::after {
        border-right-color: #89919a;
        left: -9px;
      }
    }

    &[data-placement^="left"] {
      margin:0;
      margin-right:5px;
      &::before, &::after {
        border-width: 6.5px 0 6.5px 8px;
        border-color: transparent;
        border-left-color: #fff;
        bottom: auto;
        right: -8px;
        top: 50%; 
        transform:translateY(-50%);
      }
      &::after {
        border-left-color: #89919a;
        right: -9px;
      }
    }

    &[data-placement="left-start"], &[data-placement="right-start"]  {
      &::before, &::after {
        bottom: auto; 
        top: 22px;
      }
    }

    &[data-placement="left-end"], &[data-placement="right-end"] {
      &::before, &::after {
        bottom: 22px; 
        top: auto;
      }
    }
    
  }
`;
