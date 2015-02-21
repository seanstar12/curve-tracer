import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return {
      chartData: {
        labels: ['Day1', 'Day2', 'Day3'],
        series: [
          [1,4,8],
          [2,3,12],
          [3,4,5],
        ]
      }
    }
  }
});
