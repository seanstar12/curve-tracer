import Ember from 'ember';

export default Ember.Component.extend({
  steps: [],

  actions: {
    addStep: function() {
      this.get('steps').pushObject(0);
    },
    removeStep: function(index) {
      var steps = this.get('steps');

      if (steps.length > 1) {
        steps.removeAt(index);
      }
    },
  },
});
