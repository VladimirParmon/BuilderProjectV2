import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { EnterNameComponent } from 'src/app/components/modals/enter-name/enter-name.component';
import { StateService } from 'src/app/services/state.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ModalWindowsText } from 'src/constants/constants';
import { SinglePageInfo } from 'src/constants/models/contents';
import { contentsActions } from 'src/redux/actions/contents.actions';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent {
  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;

  constructor(
    private stateService: StateService,
    private store: Store,
    private utilsService: UtilsService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  openAddNewPageDialog() {
    const dialogConfig = this.utilsService.createMatDialogConfig(
      ['add-page-dialog'],
      ModalWindowsText.CREATE_NEW_PAGE
    );
    const dialogRef = this.dialog.open(EnterNameComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((pageName) => {
      if (pageName) {
        const id = uuidv4();
        const newPage: SinglePageInfo = {
          id,
          name: pageName,
          tools: [],
          childPages: [],
          parentId: '',
        };
        this.store.dispatch(contentsActions.addNewPage({ pageInfo: newPage }));
        this.router.navigate(['/view', id]);
      }
    });
  }
}
