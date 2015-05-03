import DS from 'ember-data';
var attr = DS.attr;

export default DS.Model.extend({
  currentSteps: DS.hasMany('step'),

  type: attr('string', {defaultValue: 'PNP BJT'}),
  increment: attr('number', {defaultValue: 0.5}),
  voltageRangeFrom: attr('number', {defaultValue: 0}),
  voltageRangeTo: attr('number', {defaultValue: 5}),
});
