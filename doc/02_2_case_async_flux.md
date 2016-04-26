非同期入れたサンプル

src/flux/ActionCreator.js
```javascript
import { COUNTER_UPDATE } from './constants';

export default class ActionCreator {

  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  fetchCount() {
    fetch('/api/count')
    .then(res => {
      return res.json();
    })
    .then(json => {
      this.dispatcher.dispatch({
        type: COUNTER_UPDATE,
        payload: json
      });
    });
  }

  plusCounter() {
    fetch('/api/vote', {
      method: 'POST'
    })
    .then(res => {
      return res.json();
    })
    .then(json => {
      this.dispatcher.dispatch({
        type: COUNTER_UPDATE,
        payload: json
      });
    });
  }

  minusCounter() {
    fetch('/api/vote', {
      method: 'DELETE'
    })
    .then(res => {
      return res.json();
    })
    .then(json => {
      this.dispatcher.dispatch({
        type: COUNTER_UPDATE,
        payload: json
      });
    });
  }
}
```

src/flux/CounterStore.js
```javascript
import { Store } from 'flux/utils';
import { COUNTER_UPDATE } from './constants';

export default class CounterStore extends Store {

  constructor(dispatcher) {
    super(dispatcher);
    this._count = 0;
  }

  getCount() {
    return this._count;
  }

  _updateCounter(payload) {
    this._count = payload.count;
    this.__emitChange();
  }

  __onDispatch(action) {
    switch (action.type) {
      case COUNTER_UPDATE:
        this._updateCounter(action.payload);
        break;
    }
  }
}
```
