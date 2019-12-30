const PopperJS = jest.requireActual('popper.js');

export default class {
  static placements = PopperJS.placements;

  constructor() {
    return {
      destroy: () => {},
      scheduleUpdate: () => {},
    };
  }
}
