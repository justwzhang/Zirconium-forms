import React from "react";
import { useFormArray } from "../contexts/FormArrayComponent";
import { FormValidator } from "../types";

interface FormArrayAddComponentProps {
    children: React.ReactElement;
    base: any;
    validator?: FormValidator | undefined;
}

export function FormArrayAddComponent(prop: FormArrayAddComponentProps) {
    const { formarray, addItem } = useFormArray();
    let controlProps={
        onClick:()=>{
            addItem(prop.base, prop.validator);
        }
    };
    return React.cloneElement(React.Children.only(prop.children), controlProps);
}