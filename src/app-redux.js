import { createStore } from 'redux';

// Reducer
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1;
  case 'DECREMENT':
    return state - 1;
  default:
    return state;
  }
}

// Store
const store = createStore(counter);

store.subscribe(() => {
  const p = document.createElement('p');
  p.textContent = store.getState();
  document.getElementById('app').appendChild(p);
});

store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1
