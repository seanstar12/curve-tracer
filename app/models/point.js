import DS from 'ember-data';

export default DS.Model.extend({
  step: DS.belongsTo('step'),

  current: DS.attr('number'),
});
