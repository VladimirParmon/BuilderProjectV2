import { Component, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { StateService } from 'src/app/services/state.service';

import { filter, takeUntil } from 'rxjs/operators';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SinglePageInfo } from 'src/constants/models';
import { Store } from '@ngrx/store';
import { getOnePageInfo } from 'src/redux/selectors';
import { contentsActions } from 'src/redux/actions';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnDestroy {
  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;
  destroy$: Subject<boolean> = new Subject<boolean>();
  pageData: SinglePageInfo | null = null;
  inputValue: string = '';
  isEditorOn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private stateService: StateService,
    private router: Router
  ) {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const pageId = this.route.snapshot.paramMap.get('id');
        if (pageId)
          this.store
            .select(getOnePageInfo(pageId))
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
              if (data) {
                this.pageData = data;
                this.inputValue = data.name;
              }
            });
      });
  }

  @HostListener('document:keydown.enter')
  onEnter() {
    this.savePageName();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
    //TODO: implement page DND
  }

  deleteTool(toolId: string) {
    //TODO: delete the tool
  }

  savePageName() {
    this.isEditorOn = false;
    if (!this.pageData) return;
    this.store.dispatch(
      contentsActions.updatePageName({
        pageId: this.pageData.id,
        newName: this.inputValue,
      })
    );
  }

  editPageName() {
    this.isEditorOn = true;
  }
}
