import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'fundamental-react';
import './DropdownRenderer.scss';

DropdownRenderer.propTypes = {
  selectedLabels: PropTypes.arrayOf(PropTypes.string),
  recentLabels: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  logLabelCategories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  chooseLabel: PropTypes.func.isRequired,
  loadLabels: PropTypes.func.isRequired,
};

export default function DropdownRenderer({
  recentLabels,
  logLabelCategories,
  chooseLabel,
  loadLabels,
  selectedLabels,
}) {
  const [statefulLogLabels, setStatefulLogLabels] = React.useState(
    logLabelCategories.map(logLabel => ({
      isHidden: true,
      ...logLabel,
    })),
  );

  async function switchState(category) {
    const entry = statefulLogLabels.find(e => e.name === category);
    const labels = entry.labels || (await loadLabels(category));

    setStatefulLogLabels(
      statefulLogLabels.map(entry => {
        if (entry.name === category) {
          return {
            ...entry,
            labels,
            isHidden: !entry.isHidden,
          };
        } else {
          return {
            ...entry,
            isHidden: true,
          };
        }
      }),
    );
  }

  return (
    <nav className="fd-mega-menu">
      <div className="fd-mega-menu__group">
        <h3 className="fd-mega-menu__title">Recently Selected Labels</h3>
        <RecentLabelsList
          recentLabels={recentLabels}
          chooseLabel={chooseLabel}
        />
      </div>
      <div className="fd-mega-menu__group">
        <h3 className="fd-mega-menu__title">Log Labels</h3>
        <LogLabelCategoriesList
          statefulLogLabels={statefulLogLabels}
          switchState={switchState}
          chooseLabel={chooseLabel}
          selectedLabels={selectedLabels}
        />
      </div>
    </nav>
  );
}

function formatName(name) {
  return name.replace(' ', '_').toLowerCase();
}

function RecentLabelsList({ recentLabels, chooseLabel }) {
  return recentLabels.length ? (
    <ul className="fd-mega-menu__list dimmed">
      {recentLabels.map(entry => (
        <li key={entry} className="fd-mega-menu__item">
          <span
            className="cursor-pointer fd-mega-menu__link"
            onClick={() => chooseLabel(entry)}
          >
            {entry}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <span
      className="fd-mega-menu__item--disabled"
      data-test-id="no-recent-labels"
    >
      No recent labels
    </span>
  );
}

function LogLabelsSubList({ logLabel, selectedLabels, chooseLabel }) {
  if (!logLabel.labels || !logLabel.labels.length) {
    return (
      <ul
        className="fd-mega-menu__sublist"
        id={logLabel.name}
        aria-hidden={logLabel.isHidden}
      >
        <li className="fd-mega-menu__subitem" key="not-entries">
          <span className="fd-mega-menu__sublink">No entries</span>
        </li>
      </ul>
    );
  }
  return (
    <ul
      className="fd-mega-menu__sublist"
      id={logLabel.name}
      aria-hidden={logLabel.isHidden}
    >
      {logLabel.labels.map(name => {
        const formattedLabel = `${formatName(logLabel.name)}="${name}"`;
        const isSelected = ~selectedLabels.indexOf(formattedLabel);
        return (
          <li
            className={classNames('fd-mega-menu__subitem', {
              selected: isSelected,
            })}
            key={name}
          >
            <span
              className="fd-mega-menu__sublink cursor-pointer"
              onClick={() => chooseLabel(formattedLabel)}
            >
              {name}
              {(isSelected && <Icon glyph="accept" size="m" />) || null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function LogLabelCategoriesList({
  statefulLogLabels,
  switchState,
  chooseLabel,
  selectedLabels,
}) {
  return statefulLogLabels.length ? (
    <ul className="fd-mega-menu__list">
      {statefulLogLabels.map(l => (
        <li className="fd-mega-menu__item" key={l.name}>
          <span
            className="fd-mega-menu__link has-child cursor-pointer"
            aria-controls={l.name}
            aria-haspopup="true"
            onClick={() => switchState(l.name)}
          >
            {l.name}
          </span>
          <LogLabelsSubList
            logLabel={l}
            chooseLabel={chooseLabel}
            selectedLabels={selectedLabels}
          />
        </li>
      ))}
    </ul>
  ) : (
    <span className="fd-mega-menu__item--disabled" data-test-id="no-log-labels">
      No log labels
    </span>
  );
}
