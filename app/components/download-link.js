import Ember from 'ember';

export default Ember.Component.extend({
  data: null,

  cleanData: function() {
    if (Ember.isNone(this.get('data'))) {
      return null;
    }
    var data = this.get('data'),
        clean = {};

    clean.type = data.get('type');
    clean.increment = data.get('increment');
    clean.voltageRangeFrom = data.get('voltageRangeFrom');
    clean.voltageRangeTo = data.get('voltageRangeTo');

    clean.steps = [];
    data.get('currentSteps').forEach(function(step, i) {
      clean.steps[i] = {
        ma: step.get('ma'),
        points: [],
      };

      step.get('points').forEach(function(point, p) {
        clean.steps[i].points[p] = {current: point.get('current')};
      });
    });

    return clean;
  }.property('data.currentSteps.@each.points'),

  jsonFileData: function() {
    if (Ember.isNone(this.get('cleanData'))) {
      return null;
    }
    var data = JSON.stringify(this.get('cleanData'));
    console.log(data);
    return 'data:text/plain;base64,' + window.btoa(data);
  }.property('cleanData'),

  jsonFileName: function() {
    return 'data.json';
    if (Ember.isNone(this.get('jsonFileData'))) {
      return null;
    }
    return URL.createObjectURL(this.get('jsonFileData'));
  }.property('jsonFileData'),
});
