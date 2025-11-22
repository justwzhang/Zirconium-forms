import React, { useMemo, useState, type ReactNode } from 'react';
import './App.css';
import { useFormBuilder } from '../../../src/hooks/useFormBuilder';
import { FormGroupComponent, useFormGroup } from '../../../src/contexts/FormGroupComponent';
import { FormArrayComponent, useFormArray } from '../../../src/contexts/FormArrayComponent';
import { FormGroup } from '../../../src/controls/FormGroup';
import { FormArray } from '../../../src/controls/FormArray';
import { FormFieldComponent } from '../../../src/components/FormFieldComponent';
import { FormErrorComponent } from '../../../src/components/FormErrorComponent';
import { FormArrayAddComponent } from '../../../src/components/FormArrayAddComponent';
function App() {
  const { group, control, array } = useFormBuilder();
  // Custom validator for age > 5
  const ageValidator = {
    required: true,
    func: (val: any) => Number(val) > 5,
    errorMsg: "Age must be greater than 5."
  };

  // Build the form structure
  const form = useMemo(() =>
    group({
      userInfo: group({
        name: control(""),
        age: control(1, ageValidator)
      }),
      email: control(""),
      phoneNumbers: array(["", ""])
    })
  ,[]);

  // Get phoneNumbers array
  const phoneNumbersArray = form.get("phoneNumbers") as FormArray;
  // function handleAddNewItem(newForm: FormGroup) {
  //   phoneNumbersArray.addItem("");
  //   setForm(newForm);
  // }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(form.buildObject());
  }

  return (
    <div>
      <h1>Radioactive Forms Example</h1>
      <form onSubmit={handleSubmit}>
        <FormGroupComponent formgroup={form}>
          <FormGroupComponent formgroup={form.get("userInfo") as FormGroup}>
                <div>
                  <label>
                    Name:
                    <FormFieldComponent name="name">
                      <input type="text"/>
                    </FormFieldComponent>
                  </label>
                  <label>
                    Age:
                    <FormFieldComponent name="age">
                      <input type="number" />
                    </FormFieldComponent>
                    {/* <FormErrorComponent name="age" noText onError={()=>{console.log("error")}}/> */}
                    <FormErrorComponent name="age" onError={()=>{console.log("error")}}/>
                    {/* <FormErrorComponent name="age" errorComponent={<div>This is an error</div>} onError={()=>{console.log("error")}}/> */}
                  </label>
                </div>
          </FormGroupComponent>
          <label>
            Email:
           <FormFieldComponent name="email">
              <input type="text" />
            </FormFieldComponent>
          </label>
          <FormArrayComponent formarray={phoneNumbersArray}>
            <div>
              <label>Phone Numbers:</label>
              {phoneNumbersArray.controls.map((ctrl, i) => (
                <FormFieldComponent key={i} arrayIndex={i}>
                  <input type="text" />
                </FormFieldComponent>
              ))}
              <FormArrayAddComponent base="">
                <button type="button">Add Phone (This Dont Work yet)</button>
              </FormArrayAddComponent>
            </div>
          </FormArrayComponent>
          <button type="submit">Submit</button>
        </FormGroupComponent>
      </form>
              {/* <button onClick={()=>{setForm(form)}}>test</button> */}
    </div>
  );
}

export default App;