import React, { useRef, useEffect } from 'react';
import flatpickr from 'flatpickr';
// eslint-disable-next-line import/no-extraneous-dependencies
import format from 'date-fns/format';

export default function Datepicker({ onDateChange }) {
  const inputEl = useRef(null);

  useEffect(() => {
    const flatpickrInstance = flatpickr(inputEl.current, {
      onDayCreate(dObj, dStr, fp, dayElem) {
        if (process.env.NODE_ENV !== 'production') {
          dayElem.setAttribute('data-testid', format(dayElem.dateObj, 'YYYY-MM-DD'));
        }
      },
      onChange(selectedDates) {
        onDateChange(selectedDates[0]);
      },
    });

    return () => flatpickrInstance.destroy();
  }, []); // Run only on first render

  return (
    <>
      <input ref={inputEl} type="text" data-testid="dateInput" />
    </>
  );
}
