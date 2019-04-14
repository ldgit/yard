# React datepicker experiment

Just an experiment to see how easy it is to integrate a not-reactive library with React.

Uses [flatpickr](https://github.com/flatpickr/flatpickr) datetime picker internally. **Note:** [fully working library](https://github.com/haoxins/react-flatpickr) exists that already does this with flatpickr.

Guidelines:
* encapsulated internal datepicker (can be replaced without affecting client code)
* must use React hooks API
* unit tested
* must work in IE9 or specify necessary polyfills
