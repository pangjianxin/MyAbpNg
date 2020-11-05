import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { finalize } from 'rxjs/operators';
import snq from 'snq';
import { ChangePassword, ProfileState } from '@abp/ng.core';
import { MessageService } from 'src/app/pages/theme-shared/services/message.service';
import { compareValidator, getPasswordValidators } from 'src/app/pages/theme-shared/uitls/validation.utils';

import { Account } from '../../models/account';
const { required } = Validators;
@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password.component.html',
  exportAs: 'abpChangePasswordForm',
})
export class ChangePasswordComponent
  implements OnInit, Account.ChangePasswordComponentInputs, Account.ChangePasswordComponentOutputs {
  form: FormGroup;
  PASSWROD_FIELDS = ['newPassword', 'repeatNewPassword'];
  inProgress: boolean;

  hideCurrentPassword: boolean;

  // mapErrorsFn: Validation.MapErrorsFn = (errors, groupErrors, control) => {
  //   if (PASSWORD_FIELDS.indexOf(String(control.name)) < 0) {
  //     return errors;
  //   }

  //   return errors.concat(groupErrors.filter(({ key }) => key === 'passwordMismatch'));
  // }

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private message: MessageService,
  ) { }

  ngOnInit(): void {

    this.hideCurrentPassword = !this.store.selectSnapshot(ProfileState.getProfile).hasPassword;

    const passwordValidations = getPasswordValidators(this.store);


    this.form = this.fb.group(
      {
        password: ['', required],
        newPassword: [
          '',
          {
            validators: [required, ...passwordValidations],
          },
        ],
        repeatNewPassword: [
          '',
          {
            validators: [required, ...passwordValidations],
          },
        ],
      },
      {
        validators: [compareValidator('newPassword', 'repeatNewPassword')],
      },
    );

    if (this.hideCurrentPassword) {
      this.form.removeControl('password');
    }
  }
  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.inProgress = true;
    this.store
      .dispatch(
        new ChangePassword({
          ...(!this.hideCurrentPassword && { currentPassword: this.form.get('password').value }),
          newPassword: this.form.get('newPassword').value,
        }),
      )
      .pipe(finalize(() => (this.inProgress = false)))
      .subscribe({
        next: () => {
          this.form.reset();
          this.message.success('AbpAccount::PasswordChangedMessage');

          if (this.hideCurrentPassword) {
            this.hideCurrentPassword = false;
            this.form.addControl('password', new FormControl('', [required]));
          }
        },
        error: err => {
          this.message.error(
            snq(() => err.error.error.message, 'AbpAccount::DefaultErrorMessage'),
          );
        },
      });
  }
}
