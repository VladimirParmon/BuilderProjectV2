import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filesActions } from 'src/redux/actions/files.actions';

@Injectable({
  providedIn: 'root',
})
export class StorageUnitsService {
  constructor(private store: Store) {}

  deleteTextToolStorageUnit(id: string) {
    this.store.dispatch(filesActions.deleteTextStorageUnit({ id }));
  }

  deleteRelatedVideoStorageUnit(fileDescriptionId: string) {
    this.store.dispatch(filesActions.deleteVideo({ fileDescriptionId }));
  }

  deleteRelatedChartStorageUnit(id: string) {
    this.store.dispatch(filesActions.deleteChart({ id }));
  }

  deleteAllCollageImages(imageDescriptionIds: string[]) {
    this.store.dispatch(filesActions.deleteMultipleImages({ imageDescriptionIds }));
  }

  deleteAllRelatedPDFs(fileDescriptionIds: string[]) {
    this.store.dispatch(filesActions.deleteMultiplePDFs({ fileDescriptionIds }));
  }

  deleteAllRelatedAudios(fileDescriptionIds: string[]) {
    this.store.dispatch(filesActions.deleteMultipleAudios({ fileDescriptionIds }));
  }
}
