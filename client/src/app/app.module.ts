import { AppComponent } from './app.component';
import { AudioUtilService } from './services/audioUtil/audio-util.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { RecorderService } from './services/recorder/recorder.service';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule
  ],
  providers: [RecorderService, AudioUtilService],
  bootstrap: [AppComponent]
})
export class AppModule { }
