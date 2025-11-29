import React from "react";
import { useFormArray } from "../contexts";

interface FormArrayDeleteComponentProps {
    children: React.ReactElement;
    index: number;
}


export function FormArrayDeleteComponent(props: FormArrayDeleteComponentProps) {
    const { removeItem } = useFormArray();
    let controlProps={
        onClick:()=>{
            removeItem(props.index);
        }
    };
    return React.cloneElement(React.Children.only(props.children), controlProps);
}