import Ember from 'ember';
import getJSON from '../utils/get-json';

export default Ember.Route.extend({
  model: function(params) {
    if (this.store.hasRecordForId('test', params.test_id)) {
      return this.store.find('test', params.test_id);
    }

    this.transitionTo('index');
  },

  setupController(controller, model) {
    this._super(controller, model);
    this.getResults(model);
  },

  getResults: function(model) {
    var steps = model.get('currentSteps');

    this.getSteps(model, steps, 0);
  },

  getSteps: function(model, steps, i) {
    var voltageRangeFrom = model.get('voltageRangeFrom'),
        step = steps.objectAt(i),
        points = step.get('points'),
        self = this;

    this.getPoints(model, step, points, voltageRangeFrom).then(function() {
      if (i < steps.length) {
        i++;
        return self.getSteps(model, steps, i);
      }
    });
  },

  getPoints: function(model, step, points, i) {
    var voltageRangeTo = model.get('voltageRangeTo'),
        increment = model.get('increment'),
        self = this;

    var params = {
      ma: step.get('ma'),
      test: 'yes',
    };

    return getJSON('http://146.7.133.40:8080/test.json', params).then(function(results) {
      points.pushObject(
        self.store.createRecord('point', {
          voltage: results.voltage,
        })
      );

      if  (i < voltageRangeTo) {
        i += increment;
        return self.getPoints(model, step, points, i);
      }
    }, function(error) {
      console.log('error');
      console.log(error);
    },
    'Get results from Micro');
  },
});
