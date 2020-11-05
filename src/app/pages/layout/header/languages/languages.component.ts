import { Component, OnInit, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import snq from 'snq';
import { ApplicationConfiguration, ConfigState, SessionState, SetLanguage } from '@abp/ng.core';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
})
export class LanguagesComponent implements OnInit {
  get smallScreen(): boolean {
    return window.innerWidth < 992;
  }

  @Select(ConfigState.getDeep('localization.languages'))
  languages$: Observable<ApplicationConfiguration.Language[]>;

  get defaultLanguage$(): Observable<string> {
    return this.languages$.pipe(
      map(
        languages =>
          snq(
            () => languages.find(lang => lang.cultureName === this.selectedLangCulture).displayName,
          ),
        '',
      ),
    );
  }

  get dropdownLanguages$(): Observable<ApplicationConfiguration.Language[]> {
    return this.languages$.pipe(
      map(
        languages =>
          snq(() => languages.filter(lang => lang.cultureName !== this.selectedLangCulture)),
        [],
      ),
    );
  }

  get selectedLangCulture(): string {
    return this.store.selectSnapshot(SessionState.getLanguage);
  }

  constructor(private store: Store) { }

  ngOnInit(): void { }

  onChangeLang(cultureName: string): void {
    this.store.dispatch(new SetLanguage(cultureName));
  }
}
