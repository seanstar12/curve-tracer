import DS from 'ember-data';

var Test = DS.Model.extend({
  baseCurrents: DS.hasMany('baseCurrent'),

  voltageStep: DS.attr('number'),
  voltageSteps: DS.attr('number'),
  voltageMin: DS.attr('number'),
  voltageMax: DS.attr('number'),

  currentStep: DS.attr('number'),
  currentMin: DS.attr('number'),
  currentMax: DS.attr('number'),

  numTimesToTest: DS.attr('number'), // better name please
});

Test.reopenClass({
  FIXTURES: [
    {
      baseCurrents: [0, 1], // has many - ids of basecurrent
      id: 0,

      voltageStep: 1,
      voltageSteps: 20,
      voltageMin: 0,
      voltageMax: 10,

      currentStep: 1,
      currentMin: 1,
      currentMax: 10,

      numTimesToTest: 5, // better name please
    },
  ]
});

export default Test;
