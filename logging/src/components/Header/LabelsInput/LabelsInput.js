import React from 'react';

import { Search } from '@kyma-project/react-components';
import { ComboboxInput, Menu } from 'fundamental-react/ComboboxInput';

export default function LabelsInput(props) {
  return (
    <section>
      <span className="caption-muted">Labels</span>
     



      <nav class="fd-mega-menu" id="">
    <div class="fd-mega-menu__group">
        <h3 class="fd-mega-menu__title">Group Name</h3>
        <ul class="fd-mega-menu__list">
            <li class="fd-mega-menu__item">
                <a class="fd-mega-menu__link" href="#">
                    item link
                </a>
            </li>
            <li class="fd-mega-menu__item">
                <a class="fd-mega-menu__link has-child" href="#" aria-controls="kIGVv418" aria-haspopup="true">
                    item link
                </a>
                <ul class="fd-mega-menu__sublist" id="kIGVv418" aria-hidden="true">
                    <li class="fd-mega-menu__subitem">
                        <a class="fd-mega-menu__sublink" href="#">
                            Link
                        </a>
                    </li>
                    <li class="fd-mega-menu__subitem">
                        <a class="fd-mega-menu__sublink" href="#">
                            Link
                        </a>
                    </li>
                    <li class="fd-mega-menu__subitem">
                        <a class="fd-mega-menu__sublink" href="#">
                            Link
                        </a>
                    </li>
                </ul>
            </li>
            <li class="fd-mega-menu__item">
                <a class="fd-mega-menu__link" href="#">
                    item link
                </a>
            </li>
        </ul>
    </div>
    <div class="fd-mega-menu__group">
        <h3 class="fd-mega-menu__title">Group Name</h3>
        <ul class="fd-mega-menu__list">
            <li class="fd-mega-menu__item">
                <a class="fd-mega-menu__link" href="#">
                    item link
                </a>
            </li>
            <li class="fd-mega-menu__item">
                <a class="fd-mega-menu__link has-child" href="#" aria-controls="iOnP0943" aria-haspopup="true">
                    item link
                </a>
                <ul class="fd-mega-menu__sublist" id="iOnP0943" aria-hidden="true">
                    <li class="fd-mega-menu__subitem">
                        <a class="fd-mega-menu__sublink" href="#">
                            Link
                        </a>
                    </li>
                    <li class="fd-mega-menu__subitem">
                        <a class="fd-mega-menu__sublink" href="#">
                            Link
                        </a>
                    </li>
                    <li class="fd-mega-menu__subitem">
                        <a class="fd-mega-menu__sublink" href="#">
                            Link
                        </a>
                    </li>
                </ul>
            </li>
            <li class="fd-mega-menu__item">
                <a class="fd-mega-menu__link" href="#">
                    item link
                </a>
            </li>
        </ul>
    </div>
</nav>


      {/* <ComboboxInput
        menu={
          
        }
        placeholder="Select Fruit"
      /> */}
    </section>
  );
}
