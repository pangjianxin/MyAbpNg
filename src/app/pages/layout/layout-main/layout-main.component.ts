import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { RoutesService, TreeNode, ABP } from '@abp/ng.core';

@Component({
  selector: 'app-layout-main',
  templateUrl: './layout-main.component.html',
  styleUrls: ['./layout-main.component.scss']
})
export class LayoutMainComponent implements OnInit {
  isCollapsed: boolean;
  appRoutes$: Observable<TreeNode<ABP.Route>[]>;
  constructor(private routes: RoutesService) {
    this.appRoutes$ = this.routes.tree$.pipe(tap(it => it.filter(i => !i.invisible)));
  }

  ngOnInit(): void {
  }
  getParentCount(item: TreeNode<ABP.Route>, count: number = 0): number {
    if (item.parent) {
      count += 1;
      this.getParentCount(item.parent, count);
    } else {
      console.log(count);
      return count * 24;
    }
  }
}
