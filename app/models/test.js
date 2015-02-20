import DS from 'ember-data';

export default DS.Model.extend({
  voltageStep: DS.attr('number'),
  voltageMin: DS.attr('number'),
  voltageMax: DS.attr('number'),

  currentStep: DS.attr('number'),
  currentMin: DS.attr('number'),
  currentMax: DS.attr('number'),

  numTimesToTest: DS.attr('number'), // better name please

  baseCurrents: DS.hasMany('baseCurrent'),
});
