import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Emotion Detection POC';
  emotionData = {happy: 1, sad: 0.25, angry: 0, neutral: 0.5};
  videoNativeElement;
  @ViewChild('userVideoStream') userVideoStream;

  ngOnInit() {
    this.videoNativeElement = <HTMLVideoElement>this.userVideoStream.nativeElement;
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.videoNativeElement.srcObject = stream;
    })
  }
}
