import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.createRecord('test');
  },

  afterModel: function(model) {
    var steps = model.get('currentSteps');

    steps.pushObject(this.store.createRecord('step'));
  },

  actions: {
    addStep: function() {
      var steps = this.controller.get('model.currentSteps');

      steps.pushObject(this.store.createRecord('step'));
    },
    removeStep: function(index) {
      var steps = this.controller.get('model.currentSteps');

      if (steps.length > 1) {
        var step = steps.objectAt(index);
        steps.removeAt(index);
        step.destroyRecord();
      }
    },
    start: function() {
      this.transitionTo('results', this.controller.get('model'));
    },
  },
});
