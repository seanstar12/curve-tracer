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
      i++;
      if (i <= steps.length -1) {
        return self.getSteps(model, steps, i);
      }
    }, function(error) {
      console.log('error');
      console.log(error);
    },
    'Get points');
  },

  getPoints: function(model, step, points, i) {
    var voltageRangeTo = model.get('voltageRangeTo'),
        increment = model.get('increment'),
        type = model.get('type'),
        relay1 = '0',
        relay2 = '0',
        self = this;

    var a = ( i < 100 ? i : 99 );
    var voltage = Math.round(i * 100) / 100;

    if (voltage > 0) {
      voltage = '+' + voltage;
    }

    switch (type) {
      case 'PNP BJT':
        relay1 = '1';
        break;
    }

    var params = {
      a: this.addPadding(Math.round(a), 4, 'front'),
      b: this.addPadding(voltage, 4, 'back'),
      c: this.addPadding(step.get('ma'), 2, 'front'),
      d: relay1,
      e: relay2,
    };

    var magic = 'a' + params.a +
                'b' + params.b +
                'c' + params.c +
                'd' + params.d +
                'e' + params.e +
                'f';


    /*
    GET 10.0.1.23:8080/?a443b-7.32c20d0e1f

    /?a******b******c******d*e*f
    a = ID
    b = Voltage of Test
    C = mA of current of Test
    d = relay1 for npn vs pnp
    e = relay2 for mosfet. also uses d for npn vs pnp
    f = signifies end of params.
    */

    //return getJSON('/test.json?' + magic, {}).then(function(results) {
    return getJSON('http://146.7.133.56:8080/test.json?' + magic, {}).then(function(results) {
      points.pushObject(
        self.store.createRecord('point', {
          current: results.current,
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

  addPadding: function(string, len, part) {
    string = '' + string;
    while (string.length < len) {
      if (part === 'front') {
        string = '0' + string;
      }
      else {
        string = string + '0';
      }
    }

    return string;
  },
});
