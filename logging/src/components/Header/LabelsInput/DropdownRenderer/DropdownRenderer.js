import React from 'react';
import PropTypes from 'prop-types';
import './DropdownRenderer.scss';

DropdownRenderer.propTypes = {
  recentLabels: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  logLabels: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  chooseLabel: PropTypes.func.isRequired,
};

export default function DropdownRenderer({
  recentLabels,
  logLabels,
  chooseLabel,
}) {
  const [statefulLogLabels, setStatefulLogLabels] = React.useState(
    logLabels
      .filter(logLabel => logLabel.labels.length)
      .map(logLabel => {
        return {
          isHidden: true,
          logLabel: logLabel,
        };
      }),
  );

  function formatName(name) {
    return name.replace(' ', '_').toLowerCase();
  }

  function switchState(labelName) {
    setStatefulLogLabels(
      statefulLogLabels.map(entry => {
        if (entry.logLabel.name === labelName) {
          return {
            ...entry,
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

  const recentLabelsList = recentLabels.length ? (
    <ul className="fd-mega-menu__list">
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

  const logLabelsSubList = ({ logLabel, isHidden }) => (
    <ul
      className="fd-mega-menu__sublist"
      id={logLabel.name}
      aria-hidden={isHidden}
    >
      {logLabel.labels.map(name => (
        <li className="fd-mega-menu__subitem" key={name}>
          <span
            className="fd-mega-menu__sublink cursor-pointer"
            onClick={() =>
              chooseLabel(`${formatName(logLabel.name)}="${name}"`)
            }
          >
            {name}
          </span>
        </li>
      ))}
    </ul>
  );

  const logLabelsList = logLabels.length ? (
    <ul className="fd-mega-menu__list">
      {statefulLogLabels.map(l => (
        <li className="fd-mega-menu__item" key={l.logLabel.name}>
          <span
            className="fd-mega-menu__link has-child cursor-pointer"
            aria-controls={l.logLabel.name}
            aria-haspopup="true"
            onClick={() => switchState(l.logLabel.name)}
          >
            {l.logLabel.name}
          </span>
          {logLabelsSubList(l)}
        </li>
      ))}
    </ul>
  ) : (
    <span className="fd-mega-menu__item--disabled" data-test-id="no-log-labels">
      No log labels
    </span>
  );

  return (
    <nav className="fd-mega-menu">
      <div className="fd-mega-menu__group">
        <h3 className="fd-mega-menu__title">Recently Selected Labels</h3>
        {recentLabelsList}
      </div>
      <div className="fd-mega-menu__group">
        <h3 className="fd-mega-menu__title">Log Labels</h3>
        {logLabelsList}
      </div>
    </nav>
  );
}
