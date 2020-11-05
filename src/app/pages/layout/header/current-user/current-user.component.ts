import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { OAuthService } from 'angular-oauth2-oidc';
import { ConfigState, ApplicationConfiguration, AuthService } from '@abp/ng.core';
@Component({
  selector: 'app-current-user',
  templateUrl: './current-user.component.html',
  styleUrls: ['./current-user.component.scss']
})
export class CurrentUserComponent implements OnInit {
  @Select(ConfigState.getOne('currentUser')) currentUser$: Observable<ApplicationConfiguration.CurrentUser>;
  isAuthenticated: boolean;
  constructor(private authService: AuthService, private oauthService: OAuthService) { }

  ngOnInit(): void {
    this.isAuthenticated = this.oauthService.hasValidAccessToken();
  }
  logout(): void {
    this.authService.logout();
  }
  login(): void {
    console.log('login');
    this.authService.initLogin();
  }
}
