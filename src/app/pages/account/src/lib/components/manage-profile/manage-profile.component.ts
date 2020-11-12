import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetProfile, ProfileState } from '@abp/ng.core';
@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.scss']
})
export class ManageProfileComponent implements OnInit {
  isProfileLoaded: boolean;
  selectedTab: number;
  hideChangePasswordTab: boolean;
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetProfile()).subscribe(() => {
      this.isProfileLoaded = true;
      this.selectedTab = 0;
      if (this.store.selectSnapshot(ProfileState.getProfile).isExternal) {
        this.hideChangePasswordTab = true;
        this.selectedTab = 1;
      }
    });
    console.log(this.selectedTab);
  }
}
