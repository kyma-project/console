import { Injectable } from '@angular/core';
import LuigiClient from '@luigi-project/client';

@Injectable({
  providedIn: 'root'
})
export class WindowTitleService {

  set(title: string) {
    LuigiClient.sendCustomMessage({ id: 'console.setWindowTitle', title });
  }
}
