import DS from 'ember-data';

var BaseCurrent = DS.Model.extend({
  test: DS.belongsTo('test'),
  point: DS.hasMany('step'),
});

BaseCurrent.reopenClass({
  FIXTURES: [
    {
      id: 0,
      test: 0,
      point: 0,
    },
    {
      id: 0,
      test: 0,
      point: 1,
    },
  ]
});

export default BaseCurrent;
