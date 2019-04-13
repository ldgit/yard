import React from 'react';
import ReactDom from 'react-dom';
import Datepicker from '../src/Datepicker';
import 'flatpickr/dist/themes/dark.css';

const app = document.createElement('div');
document.body.appendChild(app);
ReactDom.render(<Datepicker onDateChange={console.log} value={new Date()} />, app);
