import Ember from 'ember';

export default Ember.Controller.extend({
  types: ['MPN BJT', 'PNP BJT', 'diode', 'zenier diode'],
  selectedType: 'PNP BJT',

  incrementMin: 0.001,
  incrementMax: 1,
  incrementStep: 0.001,
  selectedIncrement: 0.5,

  voltageRangeMin: -10,
  voltageRangeMax: 10,
  voltageRangeStep: 0.01,
  selectedVoltageRangeFrom: 1,
  selectedVoltageRangeTo: 2,
});
