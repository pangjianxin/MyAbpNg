
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '@abp/ng.core';

@Injectable()
export class AuthenticationFlowGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    canActivate(): boolean {
        if (this.authService.isInternalAuth) { return true; }

        this.authService.initLogin();
        return false;
    }
}
