# Zirconium Forms 🧪

A lightweight, React-first forms library that provides builder helpers, form controls, and context components for building nested forms and arrays with validation and re-rendering support.

> NOTE: This project is a work-in-progress (WIP). The library is not published yet. Installation and publish steps are **TBD** — see the Installation section.

---

## Overview

Radioactive Forms focuses on a simple API for building forms using a builder pattern. It provides:

- Builder hooks (`useFormBuilder`) to create `control`, `group`, and `array` constructs.
- A small `FormControl` system with validation support and `buildObject()` helpers to serialize the model.
- React context components (`FormGroupComponent` and `FormArrayComponent`) to hook up inputs using `FormFieldComponent` and to render validation UI with `FormErrorComponent`.
- Helper components for array operations: `FormArrayAddComponent` and `FormArrayDeleteComponent`.

Key exports are available via `src/index.ts`.

---

## Installation (TBD) ⚠️

This package is not published to npm yet. When it is published, you will install it via:

```bash
npm install 
```

For development (local):

```bash
npm install
npm run example:install
npm run example:dev
```

The example app in `example/basic-react-forms` uses Vite for hot reloading while you develop the library.

---

## Quick Concepts 💡

- Builder: `useFormBuilder()` returns `control`, `group`, and `array` to create `FormControl`, `FormGroup`, and `FormArray` instances.
- Form state: `useForm(control)` returns a pair `[form, updateForm]` where `form` is your `FormGroup` and `updateForm` notifies the example to re-render.
- Bind inputs: `FormGroupComponent` + `FormFieldComponent` (by `name`) or `FormArrayComponent` + `FormFieldComponent` (by `arrayIndex`) will clone children (inputs) to inject `value`, `checked`, and `onChange` props.
- Validation: pass validators to `control(value, validator)`.
- Serialize: `form.buildObject()` returns the data object for `FormGroup` and arrays.

---

## Examples ✅

Below are short, copyable examples based on `example/basic-react-forms/src/App.tsx`.

> Note: the example in this repo imports the library directly from the local `src` path for development (e.g. `import { useFormBuilder } from '../../../src/hooks/useFormBuilder'`).

### 1) Basic Form

```tsx
import React from 'react';
import { useFormBuilder, useForm } from '@radioactive/forms';
import { FormGroupComponent } from '@radioactive/forms';
import { FormFieldComponent } from '@radioactive/forms';
import { FormErrorComponent } from '@radioactive/forms';

const { group, control } = useFormBuilder();
const [form, updateForm] = useForm(
  group({
    userInfo: group({
      name: control(''),
      age: control(1)
    }),
    email: control('')
  })
);

function App() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(form.buildObject());
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormGroupComponent formgroup={form}>
        <FormGroupComponent formgroup={form.get('userInfo')!}>
          <label>
            Name:
            <FormFieldComponent name="name">
              <input type="text" />
            </FormFieldComponent>
          </label>
          <label>
            Age:
            <FormFieldComponent name="age">
              <input type="number" />
            </FormFieldComponent>
            <FormErrorComponent name="age" />
          </label>
        </FormGroupComponent>
        <label>
          Email:
          <FormFieldComponent name="email">
            <input type="text" />
          </FormFieldComponent>
        </label>
        <button type="submit">Submit</button>
      </FormGroupComponent>
    </form>
  );
}
```

### 2) Add validation 🎯

```tsx
const ageValidator = {
  required: true,
  func: (val: any) => Number(val) > 5,
  errorMsg: 'Age must be greater than 5.'
};

group({
  userInfo: group({
    name: control(''),
    age: control(1, ageValidator)
  })
})
```

Use `<FormErrorComponent name="age" />` to show the validator message.

### 3) Arrays: built-in add & delete UI

The `FormArray` supports adding/removing items. `FormArrayComponent` expects a `FormArray` and a `formUpdate` function so the example can re-render on changes.

```tsx
// Create an array with initial items
const [form, updateForm] = useForm(group({
  phoneNumbers: array([group({ value: '555-111' }), group({ value: '555-222' })])
}));
const phoneNumbersArray = form.get('phoneNumbers') as FormArray;

<FormArrayComponent formarray={phoneNumbersArray} formUpdate={updateForm}>
  <div>
    {phoneNumbersArray.controls.map((ctrl, i) => (
      <FormGroupComponent key={i} formgroup={ctrl as FormGroup}>
        <FormFieldComponent name="value">
          <input type="text" />
        </FormFieldComponent>
        <FormArrayDeleteComponent index={i}>
          <button type="button">Remove</button>
        </FormArrayDeleteComponent>
      </FormGroupComponent>
    ))}
    <FormArrayAddComponent base={group({ value: control('') })}>
      <button type="button">Add Phone</button>
    </FormArrayAddComponent>
  </div>
</FormArrayComponent>
```

### 4) Arrays: custom add & delete buttons

If you need a custom button with extra logic, use `useFormArray()` to access `addItem` and `removeItem` directly:

```tsx
import { useFormArray } from '@radioactive/forms';

function CustomAdd() {
  const { addItem } = useFormArray();
  return <button onClick={() => addItem('custom-phone')}>Add Custom Phone</button>;
}

function CustomDelete({ index }: { index: number }) {
  const { removeItem } = useFormArray();
  return <button onClick={() => removeItem(index)}>Remove</button>;
}
```

This approach is handy when you want to show modals, confirm dialogs, or provide additional UI beside the default add/remove button behavior.

---

## Build & Publish Notes 🔧

- The library currently uses `tsc` for TypeScript builds (`npm run build`).
- The example application uses Vite for hot reloading, but Vite is not required to build or publish the library — it's just used for the dev example.
- Before publishing to npm, ensure `package.json` fields `main`, `module`, and `types` point to the built files in `dist/` and the `files` array includes `dist`.

Suggested publish steps (future):

```bash
npm run build  # Output JS and .d.ts to dist/
# run tests/verification steps
npm publish
```

---

## Contributing

Please use the example app while developing — run `npm run example:dev` to see live updates as you change the library code.

If you want me to add more detailed code snippets, a build configuration (Rollup/tsup), or a proper `tsconfig.build.json`, say the word and I’ll add them.

---
