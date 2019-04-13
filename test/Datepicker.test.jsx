import React from 'react';
import ReactDOM from 'react-dom';
import format from 'date-fns/format';
import Datepicker from '../src/Datepicker';
import { clickOnElement, sel } from './test-utils';

const wait = miliseconds => new Promise(resolve => setTimeout(resolve, miliseconds));

jest.setTimeout(1000);

describe('Datepicker component', () => {
  const currentDate = formatDate(new Date());
  let click;
  let container;

  beforeEach(() => {
    click = clickOnElement.bind(null, window);
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
  });

  it('should render an input field', () => {
    ReactDOM.render(<Datepicker onDateChange={() => {}} />, container);
    const inputs = container.querySelectorAll('input[type="text"]');
    expect(inputs.length).toBe(1);
  });

  it(
    'clicking on the input should allow the user to select a date',
    () => new Promise((resolve) => {
      ReactDOM.render(<Datepicker onDateChange={resolve} />, container);
      const input = sel(container, 'dateInput');
      click(input);
      wait(0).then(() => click(sel(document.body, currentDate)));
    }).then(() => {
      expect(sel(container, 'dateInput').value).toBe(currentDate);
    }),
  );

  it(
    'selected date should be sent to onDateChange prop as argument',
    () => new Promise((resolve) => {
      ReactDOM.render(<Datepicker onDateChange={resolve} />, container);
      const input = sel(container, 'dateInput');
      click(input);
      wait(0).then(() => click(sel(document.body, currentDate)));
    }).then((selectedDate) => {
      expect(formatDate(selectedDate)).toBe(currentDate);
    }),
  );

  it(
    'should allow setting date through "value" prop',
    () => new Promise((resolve) => {
      ReactDOM.render(<Datepicker value={new Date(2019, 0, 1)} />, container);
      return wait(0).then(resolve);
    }).then(() => {
      const input = sel(container, 'dateInput');
      expect(input.value).toEqual('2019-01-01');
    }),
  );

  it('should start with empty input if no date given in "value" prop', () => {
    ReactDOM.render(<Datepicker value={new Date(2019, 0, 1)} />, container);
    const input = sel(container, 'dateInput');
    expect(input.value).toEqual('');
  });
});

function formatDate(date) {
  return format(date, 'YYYY-MM-DD');
}
