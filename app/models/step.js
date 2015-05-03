import DS from 'ember-data';
var attr = DS.attr;

export default DS.Model.extend({
  test: DS.belongsTo('test'),
  points: DS.hasMany('point'),

  ma: attr('number', {defaultValue: 0}),

});
