import DS from 'ember-data';

var Point = DS.Model.extend({
  baseCurrent: DS.belongsTo('baseCurrent'),
  volts: DS.attr('number'),
  current: DS.attr('number'), // voltage
});


Point.reopenClass({
  FIXTURES: [
    {
      id: 0,
      baseCurrent: 0,
      volts: 1,
      current: 1, // voltage
    },
    {
      id: 1,
      baseCurrent: 0,
      volts: 2,
      current: 2, // voltage
    },
  ]
});

export default Point;
