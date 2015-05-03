import Ember from 'ember';

export default Ember.Component.extend({
  steps: [],

  actions: {
    addStep: function() {
      this.sendAction('addStep');
    },
    removeStep: function(index) {
      this.sendAction('removeStep', index);
    },
  },
});
