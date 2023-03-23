import { Injectable } from '@angular/core';

import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  snackOpen = false
  sb: MatSnackBarRef<TextOnlySnackBar>

  constructor(private snackBar: MatSnackBar) { }

  displayError(errorMsg: string) {

    if(!this.snackOpen) {

      this.sb = this.snackBar.open(`Error: ${errorMsg}`, 'Ok', {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      duration: 3000,
      panelClass: ['warning'],
      })

      this.snackOpen = true
    }

    this.sb.afterDismissed().subscribe(info => {
      this.snackOpen = (info.dismissedByAction === true) ? false : false
    })
  }

}
