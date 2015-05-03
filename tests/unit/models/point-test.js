import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('point', {
  // Specify the other units that are required for this test.
  needs: ['model:test', 'model:step']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
