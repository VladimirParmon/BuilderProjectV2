import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { ToolService } from 'src/app/services/tool.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ToolbarToolListOption } from 'src/constants/models';
import { ChooseFileComponent } from '../modals/choose-file/choose-file.component';
import { toolsList, ToolNames } from 'src/constants/constants';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnDestroy {
  toolsList: ToolbarToolListOption[];

  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;
  isToolbarActivated: boolean = false;
  currentPageId: string | null = null;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private stateService: StateService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private toolService: ToolService
  ) {
    this.toolsList = toolsList;
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((info) => {
        this.isToolbarActivated = info.url.includes('view') ? true : false;
      });
    this.stateService.currentPageId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => (this.currentPageId = id));
  }

  useTool(name: ToolNames): void {
    switch (name) {
      case ToolNames.TEXT:
        if (this.currentPageId) this.toolService.createNewTextTool(this.currentPageId);
        break;
      case ToolNames.AUDIO:
        this.openNewDialog(ToolNames.AUDIO);
        break;
      case ToolNames.PDF:
        this.openNewDialog(ToolNames.PDF);
        break;
      case ToolNames.COLLAGE:
        this.openNewDialog(ToolNames.COLLAGE);
        break;
      case ToolNames.VIDEO:
        this.openNewDialog(ToolNames.VIDEO);
        break;
      case ToolNames.SLIDER:
        this.openNewDialog(ToolNames.SLIDER);
        break;
    }
  }

  openNewDialog(toolName: ToolNames) {
    const dialogConfig = this.utilsService.createMatDialogConfig(
      ['choose-file-dialog'],
      toolName,
      15
    );
    const dialogRef = this.dialog.open(ChooseFileComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((fileNames: string[]) => {
      if (this.currentPageId)
        switch (toolName) {
          case ToolNames.VIDEO:
            this.toolService.createNewVideoTool(this.currentPageId, fileNames[0]);
            break;
          case ToolNames.AUDIO:
            this.toolService.createNewAudioTool(this.currentPageId, fileNames);
            break;
          case ToolNames.COLLAGE:
            this.toolService.createNewCollageTool(this.currentPageId, fileNames);
            break;
          case ToolNames.PDF:
            this.toolService.createNewPDFTool(this.currentPageId, fileNames);
            break;
          case ToolNames.SLIDER:
            this.toolService.createNewSliderTool(this.currentPageId, fileNames);
            break;
        }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
