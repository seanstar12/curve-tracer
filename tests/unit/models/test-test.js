import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('test', {
  // Specify the other units that are required for this test.
  needs: ['model:step', 'model:point']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
