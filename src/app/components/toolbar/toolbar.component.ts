import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { ToolService } from 'src/app/services/tool.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ToolNames, ToolbarToolListOption } from 'src/constants/models';
import { ChooseFileComponent } from '../modals/choose-file/choose-file.component';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnDestroy {
  toolsList: ToolbarToolListOption[] = [
    {
      name: ToolNames.TEXT,
      icon: 'border_color',
    },
    {
      name: ToolNames.COLLAGE,
      icon: 'photo_library',
    },
    {
      name: ToolNames.PDF,
      icon: 'picture_as_pdf',
    },
    {
      name: ToolNames.VIDEO,
      icon: 'video_library',
    },
    {
      name: ToolNames.AUDIO,
      icon: 'library_music',
    },

    {
      name: ToolNames.SLIDER,
      icon: 'auto_awesome_motion',
    },
    // {
    //   name: ToolNames.PRESENTATION,
    //   icon: 'picture_in_picture',
    // },
  ];

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
        if (this.currentPageId)
          this.toolService.createNewTextTool(this.currentPageId);
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
      // case ToolNames.PRESENTATION:
      //   //TODO: add a new presentation
      //   break;
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
    dialogRef.afterClosed().subscribe((fileData: string) => {
      //TODO: switch-case here
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
