import DS from 'ember-data';

export default DS.Model.extend({
  test: DS.belongsTo('test'),
  point: DS.hasMany('step'),
});
