import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import format from 'date-fns/format';
import Datepicker from '../src/Datepicker';
import { clickOnElement, sel, find } from './test-utils';

const wait = miliseconds =>
  new Promise(resolve => setTimeout(resolve, miliseconds));

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

  afterEach(() => ReactDOM.unmountComponentAtNode(container));

  it('should render an input field', () => {
    renderDatepicker({});
    const inputs = container.querySelectorAll('input[type="text"]');
    expect(inputs.length).toBe(1);
  });

  it('should use empty function if onDateChange handler not provided', () =>
    new Promise(resolve => {
      renderDatepicker({});
      click(dateInput());
      return wait(0)
        .then(() => click(sel(document.body, currentDate)))
        .then(resolve);
    }));

  it('clicking on the input should allow the user to select a date', () =>
    new Promise(resolve => {
      renderDatepicker({ onDateChange: resolve });
      click(dateInput());
      wait(0).then(() => click(sel(document.body, currentDate)));
    }).then(() => expect(dateInput().value).toBe(currentDate)));

  it('selected date should be sent to onDateChange prop as argument', () =>
    new Promise(resolve => {
      renderDatepicker({ onDateChange: resolve });
      click(dateInput());
      wait(0).then(() => click(sel(document.body, currentDate)));
    }).then(selectedDate =>
      expect(formatDate(selectedDate)).toBe(currentDate),
    ));

  it('should allow setting date through "value" prop', () =>
    new Promise(resolve => {
      renderDatepicker({ value: new Date(2019, 0, 1) });
      return wait(0).then(resolve);
    }).then(() => expect(dateInput().value).toEqual('2019-01-01')));

  it('should open datepicker to the same month as given in value argument', () =>
    new Promise(resolve => {
      renderDatepicker({ value: new Date(2018, 2, 8) });
      click(dateInput());
      return wait(0).then(() => {
        resolve(find(document.body, formatDate(new Date(2018, 2, 8))));
      });
    }).then(datepickerDateCell =>
      expect(datepickerDateCell).not.toEqual(null),
    ));

  it('should start with empty input if no date given in "value" prop', () => {
    renderDatepicker({});
    expect(dateInput().value).toEqual('');
  });

  it('should cleanup after itself', () => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
    renderDatepicker({});

    ReactDOM.unmountComponentAtNode(container);

    expect(document.body.innerHTML).toBe('<div></div>');
  });

  it.skip('should support different locales', () => {});

  it.skip('multiple components should work independently at the same time', () => {});

  describe('React specific behaviour', () => {
    it('should rerender component if value prop changes', () => {
      function Parent() {
        const [date, setDate] = useState(new Date());

        return (
          <>
            <button
              type="button"
              onClick={() => setDate(new Date(2018, 7, 13))}
              data-testid="changeDate"
            />
            <Datepicker value={date} />
          </>
        );
      }
      ReactDOM.render(<Parent />, container);

      return new Promise(resolve => {
        click(sel(container, 'changeDate'));
        return wait(0).then(resolve);
      }).then(() => expect(dateInput().value).toEqual('2018-08-13'));
    });

    it('should rerender component if onDateChange prop changes', () =>
      new Promise(resolve => {
        function Parent() {
          const [value, setValue] = useState('x');

          return (
            <>
              <button
                type="button"
                onClick={() => setValue('y')}
                data-testid="changeDate"
              />
              <Datepicker onDateChange={() => resolve(value)} />
            </>
          );
        }
        ReactDOM.render(<Parent />, container);

        // We trigger the Parent value change, and this changes onDateChange callback
        click(sel(container, 'changeDate'));
        click(dateInput());

        return wait(0).then(() => click(sel(document.body, currentDate)));
        // Must be y if onDateChange is correctly specified as useEffect dependency
      }).then(value => expect(value).toEqual('y')));
  });

  function renderDatepicker({ value, onDateChange }) {
    ReactDOM.render(
      <Datepicker value={value} onDateChange={onDateChange} />,
      container,
    );
  }

  function dateInput() {
    return sel(container, 'dateInput');
  }
});

function formatDate(date) {
  return format(date, 'YYYY-MM-DD');
}
