import { ChangePassword, GetProfile, ProfileState } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { comparePasswords, Validation } from '@ngx-validate/core';
import { Store } from '@ngxs/store';
import { finalize } from 'rxjs/operators';
import snq from 'snq';
import { MessageService } from '../../theme-shared/services/message.service';
import { getPasswordValidators } from '../utils/validation.utils';

const { required } = Validators;

const PASSWORD_FIELDS = ['newPassword', 'repeatNewPassword'];

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent
  implements OnInit {
  changePasswordForm: FormGroup;

  inProgress: boolean;

  hideCurrentPassword: boolean;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private message: MessageService,
  ) { }

  ngOnInit(): void {
    console.log(this.store.selectSnapshot(ProfileState.getProfile));
    this.hideCurrentPassword = !this.store.selectSnapshot(ProfileState.getProfile).hasPassword;

    const passwordValidations = getPasswordValidators(this.store);

    this.changePasswordForm = this.fb.group(
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
        validators: [comparePasswords(PASSWORD_FIELDS)],
      },
    );

    if (this.hideCurrentPassword) {
      this.changePasswordForm.removeControl('password');
    }
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.inProgress = true;
    this.store
      .dispatch(
        new ChangePassword({
          ...(!this.hideCurrentPassword && { currentPassword: this.changePasswordForm.get('password').value }),
          newPassword: this.changePasswordForm.get('newPassword').value,
        }),
      )
      .pipe(finalize(() => (this.inProgress = false)))
      .subscribe({
        next: () => {
          this.changePasswordForm.reset();
          this.message.success('AbpAccount::PasswordChangedMessage');

          if (this.hideCurrentPassword) {
            this.hideCurrentPassword = false;
            this.changePasswordForm.addControl('password', new FormControl('', [required]));
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
