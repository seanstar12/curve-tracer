import DS from 'ember-data';

export default DS.Model.extend({
  step: DS.belongsTo('step'),

  voltage: DS.attr('number'),
});
