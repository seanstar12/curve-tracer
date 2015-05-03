import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['large-12', 'columns'],
  value: 0,

  currentMin: -7.5,
  currentMax: 7.5,
  currentStep: 0.001,
  hasError: false,

  keyPress: function(e) {
    switch (e.which) {
      case 46: // period
        this.checkForPeriod(e);
        break;
      case 48: // 0
      case 49: // 1
      case 50: // 2
      case 51: // 3
      case 52: // 4
      case 53: // 5
      case 54: // 6
      case 55: // 7
      case 56: // 8
      case 57: // 9
        this.checkDecimalPlace(e);
        break;
      default:
        e.preventDefault();
    }
  },

  // Needed to capture backspace
  keyUp: function(e) {
    this.validate(e);
  },

  checkForPeriod: function(e) {
    var value = this.get('value');

    if (value.indexOf('.') !== -1) {
      e.preventDefault();
    }
  },

  checkDecimalPlace: function(e) {
    var value = this.get('value');

    var match = (''+value).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);

    if (!match) {
      return;
    }

    var decimals = Math.max(
       0,
       // Number of digits right of decimal point.
       (match[1] ? match[1].length : 0) -
       // Adjust for scientific notation.
       (match[2] ? +match[2] : 0));

    if (decimals <= 2) {
      return;
    }

    e.preventDefault();
  },

  validate: function(e) {
    var key = e.which,
        hasError = this.get('hasError'),
        hasErrorNew = false,
        currentMin = this.get('currentMin'),
        currentMax = this.get('currentMax'),
        value = this.get('value');

    // ensure you can't put more than one period
    if (key === 46 && value.indexOf('.') !== -1) {
      e.preventDefault();
    }
    else {
      value += String.fromCharCode(key);
    }

    value = parseFloat(value);

    if (value > currentMax || value < currentMin) {
      hasErrorNew = true;
    }

    if (hasError !== hasErrorNew) {
      this.set('hasError', hasErrorNew);
    }
  },

  actions: {
    validate: function(e) {
      console.log(e);
    },
  },
});
