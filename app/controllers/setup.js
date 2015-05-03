import Ember from 'ember';

export default Ember.Controller.extend({
  types: ['NPN BJT', 'PNP BJT', 'Diode', 'Zener Diode'],

  incrementMin: 0.005,
  incrementMax: 1,
  incrementStep: 0.005,

  voltageRangeMin: -10,
  voltageRangeMax: 10,
  voltageRangeStep: 0.05,
});
