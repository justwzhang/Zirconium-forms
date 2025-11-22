import { FormControlBase } from "./FormControlBase";
import { FormControl } from "./FormControl";
import { FormGroup } from "./FormGroup";
import { useFormBuilder } from "../hooks/useFormBuilder";
export class FormArray extends FormControlBase{
    private _items: Array<FormControlBase> = [];
    constructor(arr: any[]){
        super();
        this._items = arr;
    }

    validate(): any[] {
        let errors:any[] = [];

        for(const item of this._items){
            errors.push(item.validate());
        }
        return errors;
    }

    buildObject() {
        return this._items.map(item => item.buildObject());
    }

    addItem(item: FormControlBase | Record<string, any> | any){
        const {group, control} = useFormBuilder();

        if (item instanceof FormControlBase) {
            this._items.push(item);
        }else if (typeof item === "object" && item !== null && !Array.isArray(item)) {
            this._items.push(group(item as Record<string, any>));
        }else{
           this._items.push(control(item));
        }
    }

    get controls(): Array<FormControlBase>{
        return this._items;
    }
}