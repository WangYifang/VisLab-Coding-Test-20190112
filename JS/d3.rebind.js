// d3.rebind()
// Copies a variable number of methods from source to target.
d3.rebind = function(target, source) {
  var i = 1, n = arguments.length, method;
  while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
  return target;
};

// Method is assumed to be a standard D3 getter-setter:
// If passed with no arguments, gets the value.
// If passed with arguments, sets the value and returns the target.
function d3_rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments);
    return value === source ? target : value;
  };
}

function d3_dispatch_event(dispatch) {
  var listeners = [], listenerByName = new d3_Map();
  function event() {
    var z = listeners, i = -1, n = z.length, l;
    while (++i < n) if (l = z[i].on) l.apply(this, arguments);
    return dispatch;
  }
  event.on = function (name, listener) {
    var l = listenerByName.get(name), i;
    if (arguments.length < 2) return l && l.on;
    if (l) {
      l.on = null;
      listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
      listenerByName.remove(name);
    }
    if (listener) listeners.push(listenerByName.set(name, {
      on: listener
    }));
    return dispatch;
  };
  return event;
}