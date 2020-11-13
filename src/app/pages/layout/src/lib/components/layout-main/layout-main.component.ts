import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { RoutesService, TreeNode, ABP } from '@abp/ng.core';
import { eIdentityRouteNames } from 'src/app/pages/identity/config/enums/route-names';

@Component({
  selector: 'app-layout-main',
  templateUrl: './layout-main.component.html',
  styleUrls: ['./layout-main.component.scss']
})
export class LayoutMainComponent implements OnInit {
  isCollapsed: boolean;
  appRoutes$: TreeNode<ABP.Route>[];
  constructor(private routes: RoutesService) {

  }

  ngOnInit(): void {
    this.routes.tree$
      .pipe(
        map(it => it.filter(i => !i.invisible)),
        tap(value => console.log(value)))
      .subscribe(value => this.appRoutes$ = value);
  }
  getParentCount(item: TreeNode<ABP.Route>, count: number = 1): number {
    if (!item.parentName) {
      return count * 28;
    } else {
      count += 1;
      return this.getParentCount(item.parent, count);
    }
  }
}
