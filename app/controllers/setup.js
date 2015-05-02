import Ember from 'ember';

export default Ember.Controller.extend({
  types: ['NPN BJT', 'PNP BJT', 'Diode', 'Zener Diode'],
  selectedType: 'PNP BJT',

  incrementMin: 0.005,
  incrementMax: 1,
  incrementStep: 0.005,
  selectedIncrement: 0.5,

  voltageRangeMin: -10,
  voltageRangeMax: 10,
  voltageRangeStep: 0.05,
  selectedVoltageRangeFrom: 0,
  selectedVoltageRangeTo: 5,

  currentSteps: [''],

  actions: {
    addStep: function() {
      this.get('currentSteps').pushObject('');
    },
    removeStep: function(index) {
      this.get('currentSteps').removeAt(index);
    },
  },
});
