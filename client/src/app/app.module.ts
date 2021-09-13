import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { RecorderService } from './services/recorder/recorder.service';
import { AudioUtilService } from './services/audioUtil/audio-util.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
  ],
  providers: [RecorderService, AudioUtilService],
  bootstrap: [AppComponent]
})
export class AppModule { }
