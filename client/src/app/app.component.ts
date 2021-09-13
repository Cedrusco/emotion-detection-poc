import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Emotion Detection POC';
  videoNativeElement;
  @ViewChild('userVideoStream') userVideoStream;

  ngOnInit() {
    this.videoNativeElement = <HTMLVideoElement>this.userVideoStream.nativeElement;
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.videoNativeElement.srcObject = stream;
    })
  }
}
