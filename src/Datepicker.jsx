import React, { useRef, useEffect } from 'react';
import flatpickr from 'flatpickr';
// eslint-disable-next-line import/no-extraneous-dependencies
import format from 'date-fns/format';

export default function Datepicker({ value = null, onDateChange = () => {} }) {
  const inputEl = useRef(null);

  useEffect(() => {
    const flatpickrInstance = flatpickr(inputEl.current, {
      defaultDate: value,
      onDayCreate(dObj, dStr, fp, dayElem) {
        if (process.env.NODE_ENV !== 'production') {
          dayElem.setAttribute(
            'data-testid',
            format(dayElem.dateObj, 'yyyy-MM-dd'),
          );
        }
      },
      onChange(selectedDates) {
        onDateChange(selectedDates[0]);
      },
    });

    return () => flatpickrInstance.destroy();
  }, [value, onDateChange]);

  return (
    <>
      <input ref={inputEl} type="text" data-testid="dateInput" />
    </>
  );
}
