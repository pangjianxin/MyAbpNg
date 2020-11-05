import { Store } from '@ngxs/store';
import { Validators, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import { ABP, ConfigState } from '@abp/ng.core';

const { minLength, maxLength } = Validators;

export function getPasswordValidators(store: Store): ValidatorFn[] {
    const getRule = getRuleFn(store);

    const passwordRulesArr = [] as ValidatorFn[];
    let requiredLength = 1;

    if (getRule('RequireDigit') === 'true') {
        passwordRulesArr.push((control: AbstractControl) => {
            const regex: RegExp = /.*[0-9].*/;
            if (!regex.test(control.value)) {
                return { requireDigit: true }
            }
        });
    }
    if (getRule('RequireLowercase') === 'true') {
        passwordRulesArr.push((control: AbstractControl) => {
            const regex: RegExp = /.*[a-z].*/;
            if (!regex.test(control.value)) {
                return { requireLowercase: true };
            }
        });
    }
    if (getRule('RequireUppercase') === 'true') {
        passwordRulesArr.push((control: AbstractControl) => {
            const regex: RegExp = /.*[A-Z].*/;
            if (!regex.test(control.value)) {
                return { requireUppercase: true };
            }
        });
    }
    if (getRule('RequireNonAlphanumeric') === 'true') {
        passwordRulesArr.push((control: AbstractControl) => {
            const regex: RegExp = /.*[^0-9a-zA-Z].*/;
            if (!regex.test(control.value)) {
                return { requireNonAlphanumeric: true };
            }
        });
    }
    if (Number.isInteger(+getRule('RequiredLength'))) {
        requiredLength = +getRule('RequiredLength');
        passwordRulesArr.push(minLength(requiredLength));
    }
    passwordRulesArr.push(maxLength(128));
    return passwordRulesArr;
    // return [validatePassword(passwordRulesArr), minLength(requiredLength), maxLength(128)];
}
export function compareValidator(targetKey: string, toMatchKey: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
        const target = group.controls[targetKey];
        const toMatch = group.controls[toMatchKey];
        if (target.touched && toMatch.touched) {
            const isMatch = target.value === toMatch.value;
            // set equal value error on dirty controls
            if (!isMatch && target.valid && toMatch.valid) {
                toMatch.setErrors({ mismatch: targetKey });
                const message = targetKey + ' != ' + toMatchKey;
                return { mismatch: message };
            }
            if (isMatch && toMatch.hasError('mismatch')) {
                toMatch.setErrors(null);
            }
        }

        return null;
    };
}
function getRuleFn(store: Store): (key: string) => string {
    return (key: string) => {
        const passwordRules: ABP.Dictionary<string> = store.selectSnapshot(
            ConfigState.getSettings('Identity.Password'),
        );
        return (passwordRules[`Abp.Identity.Password.${key}`] || '').toLowerCase();
    };
}
