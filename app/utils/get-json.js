import Ember from 'ember';

// Almost all of this was borrowed from ember-data/lib/adapters/rest_adapter
export default function getJSON(url, params) {
  function InvalidError(errors) {
    var tmp = Error.prototype.constructor.call(this, "The backend rejected the commit because it was invalid: " + Ember.inspect(errors));
    this.errors = errors;
    for (var i=0, l=errors.length; i<l; i++) {
      this[errors[i]] = tmp[errors[i]];
    }
  }
  InvalidError.prototype = Ember.create(Error.prototype);

  function ajax(url, type, options) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var hash = ajaxOptions(url, type, options);
      hash.success = function(json, textStatus, jqXHR) {
        json = ajaxSuccess(jqXHR, json);
        if (json instanceof InvalidError) {
          Ember.run(null, reject, json);
        } else {
          Ember.run(null, resolve, json);
        }
      };
      hash.error = function(jqXHR, textStatus, errorThrown) {
        Ember.run(null, reject, ajaxError(jqXHR, jqXHR.responseText, errorThrown));
      };
      Ember.$.ajax(hash);
    }, 'Utils#getJSON ' + type + ' to ' + url);
  }

  function ajaxSuccess(jqXHR, jsonPayload) {
    return jsonPayload;
  }

  function ajaxError(jqXHR, responseText, errorThrown) {
    var isObject = jqXHR !== null && typeof jqXHR === 'object';
    if (isObject) {
      jqXHR.then = null;
      if (!jqXHR.errorThrown) {
        jqXHR.errorThrown = errorThrown;
      }
    }
    return jqXHR;
  }

  function ajaxOptions(url, type, options) {
    var hash = options || {};
    hash.url = url;
    hash.type = type;
    hash.dataType = 'json';
    //hash.context = this;
    if (hash.data && type !== 'GET') {
      hash.contentType = 'application/json; charset=utf-8';
      hash.data = JSON.stringify(hash.data);
    }
    //var headers = get(this, 'headers');
    //if (headers !== undefined) {
    //  hash.beforeSend = function (xhr) {
    //    forEach.call(Ember.keys(headers), function(key) {
    //      xhr.setRequestHeader(key, headers[key]);
    //    });
    //  };
    //}
    return hash;
  }
  return ajax(url, 'GET', {data: params});
}
