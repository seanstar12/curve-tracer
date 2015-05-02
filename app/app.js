import Ember from 'ember';
//import DS from 'ember-data';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

//App.ApplicationSerializer = DS.LSSerializer.extend();
//App.ApplicationAdapter = DS.LSAdapter.extend({
//    namespace: 'curve'
//});

loadInitializers(App, config.modulePrefix);

export default App;
