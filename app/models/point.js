import DS from 'ember-data';

export default DS.Model.extend({
  volts: DS.attr('number'),
  current: DS.attr('number'), // voltage
  test: DS.belongsTo('test'),
});
