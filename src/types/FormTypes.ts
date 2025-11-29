export interface FormValidator {
    required?: boolean;
    func?: (value: any) => boolean;
    errorMsg?: string;
}

export interface FormValidatorOut{
    valid: boolean;
    errors: string;
}

export interface FormControlProps{
    value: any;
    validator?: FormValidator | undefined;
}