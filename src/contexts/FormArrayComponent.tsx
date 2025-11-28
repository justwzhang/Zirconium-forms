import React, { createContext, useContext, useState, ReactNode, ReactElement } from "react";
import { FormArray } from "../controls/FormArray";
import { FormControlBase } from "../controls/FormControlBase";
import { FormControl } from "../controls/FormControl";

interface FormArrayContextValue {
    formarray: FormArray;
    
    handleItemChange: (index: number, value: any) => void;
    addItem: (value: any, validator: FormValidator | undefined) => void;
    removeItem: (index: number) => void;
}
const FormArrayContext = createContext<FormArrayContextValue | undefined>(undefined);

interface Props {
    formarray: FormArray;
    children: ReactNode | (()=>ReactNode);
    formUpdate?: () => void;
}

export function FormArrayComponent({ formarray, children, formUpdate }: Props): ReactElement {

    const [, setVersion] = useState(0);
    
    const handleItemChange = (index: number, value: any) => {
        const control = formarray.controls[index];
        if (control) {
            (control as FormControl).patchValue(value);
            // redraw this section, prefer calling the provided formUpdate
            setVersion(v => v + 1);

        }
    };

    const addItem = (value: any, validator: FormValidator | undefined) => {
        // allow callers to pass a FormControlBase, FormGroup, FormArray, a plain object
        // or a primitive value. If a validator is provided we create a FormControl
        // and pass that into the FormArray so it receives the validator.
        if (value instanceof FormControlBase) {
            formarray.addItem(value);
        } else if (validator) {
            formarray.addItem(new FormControl({ value: value, validator: validator }));
        } else {
            formarray.addItem(value);
        }
        if(!formUpdate){
            console.error("FormArrayComponent does not have formUpdate function passed in props.");
        }else{
            formUpdate();
        }
        
    };

    const removeItem = (index: number) => {
        // Use an immutable update if possible; fall back to splice if not.
        try {
            // If FormArray exposes a removeAt, prefer that.
            if (typeof (formarray as any).removeAt === 'function') {
                (formarray as any).removeAt(index);
            } else {
                formarray.controls.splice(index, 1);
            }
        } catch (e) {
            formarray.controls.splice(index, 1);
        }
        if(!formUpdate){
            console.error("FormArrayComponent does not have formUpdate function passed in props.");
        }else{
            formUpdate();
        }
    };

    const ctxValue = { formarray, handleItemChange, addItem, removeItem } as FormArrayContextValue;

    return (
        <FormArrayContext.Provider value={ctxValue}>
            {typeof children === "function" ? (children as (ctx: FormArrayContextValue) => ReactNode)(ctxValue) : children}
        </FormArrayContext.Provider>
    );
}

export function useFormArray() {
    const context = useContext(FormArrayContext);
    if (!context) throw new Error("useFormArray must be used within a FormArrayComponent");
    return context;
}