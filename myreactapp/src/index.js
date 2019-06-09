import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root')); //root is DOM node.To render the react element into the 
//root DOM node we pass both to ReactDom.render();



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
