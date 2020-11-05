import { Injectable } from '@angular/core';
import snq from 'snq';
import { NzMessageDataOptions, NzMessageRef, NzMessageService } from 'ng-zorro-antd/message';
import { LocalizationService, Config } from '@abp/ng.core';
export enum messageSeverity {
    info = 'info',
    success = 'success',
    error = 'error',
    warning = 'warning'
}
@Injectable({
    providedIn: 'root',
})
export class MessageService {
    constructor(private message: NzMessageService, private localizer: LocalizationService) { }
    /**
     * Creates an info toast with given parameters.
     * @param message Content of the toast
     * @param title Title of the toast
     * @param options Spesific style or structural options for individual toast
     */
    info(
        message: Config.LocalizationParam,
        options?: NzMessageDataOptions,
    ): NzMessageRef {
        return this.show(message, messageSeverity.info, options);
    }

    /**
     * Creates a success toast with given parameters.
     * @param message Content of the toast
     * @param title Title of the toast
     * @param options Spesific style or structural options for individual toast
     */
    success(
        message: Config.LocalizationParam,
        options?: NzMessageDataOptions,
    ): NzMessageRef {
        return this.show(message, messageSeverity.success, options);
    }

    /**
     * Creates a warning toast with given parameters.
     * @param message Content of the toast
     * @param title Title of the toast
     * @param options Spesific style or structural options for individual toast
     */
    warn(
        message: Config.LocalizationParam,
        options?: NzMessageDataOptions,
    ): NzMessageRef {
        return this.show(message, messageSeverity.warning, options);
    }

    /**
     * Creates an error toast with given parameters.
     * @param message Content of the toast
     * @param severity Title of the toast
     * @param options Spesific style or structural options for individual toast
     */
    error(
        message: Config.LocalizationParam,
        options?: NzMessageDataOptions,
    ): NzMessageRef {
        return this.show(message, messageSeverity.error, options);
    }

    /**
     * Creates a toast with given parameters.
     * @param message Content of the toast
     * @param title Title of the toast
     * @param severity Sets color of the toast. "success", "warning" etc.
     * @param options Spesific style or structural options for individual toast
     */

    show(
        message: Config.LocalizationParam,
        severity: messageSeverity,
        options = {} as NzMessageDataOptions,
    ): NzMessageRef {
        const messageD = this.localizer.instant(message);
        return this.message.create(severity.toString(), messageD, options);
    }
}

