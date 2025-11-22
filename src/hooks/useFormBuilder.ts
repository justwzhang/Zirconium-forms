import { FormControl } from "../controls/FormControl";
import { FormGroup } from "../controls/FormGroup";
import { FormArray } from "../controls/FormArray";
import { FormControlBase } from "../controls/FormControlBase";

type Validator = FormValidator; 

export function useFormBuilder() {
    function control(value: any, validator?: Validator): FormControl {
        return new FormControl({ value, validator });
    }

    function group(controls: Record<string, FormControlBase | any>): FormGroup {
        // If a value is a string, wrap it in a FormControl
        const normalized: Record<string, FormControlBase> = {};
        for (const key in controls) {
            const val = controls[key];
            if (val instanceof FormControlBase) {
                normalized[key] = val as FormControlBase
            }else{
                normalized[key] = control(val)
            }
        }
        return new FormGroup(normalized);
    }

    function array(items: Array<FormControlBase | Record<string, any> | any>): FormArray {
        const normalized = items.map(item => {
            if (item instanceof FormControlBase) {
                return item;
            }
            if (typeof item === "object" && item !== null && !Array.isArray(item)) {
                return group(item as Record<string, any>);
            }
            // For primitives: boolean, number, string, etc.
            return control(item);
        });
        return new FormArray(normalized);
    }
    return { control, group, array };
}