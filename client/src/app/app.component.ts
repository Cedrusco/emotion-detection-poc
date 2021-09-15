import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { RecorderService } from './services/recorder/recorder.service';

import 'tracking/build/tracking';
import 'tracking/build/data/face';

declare var tracking: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Emotion Detection POC';
  emotionData = { happy: 1, sad: 0.25, angry: 0, neutral: 0.5 };
  videoNativeElement; // html element where video is streamed.
  canvasNativeElement; // html element where image is stored.
  speechRecognition; // speech recognition api for browsers.
  audioContext; // represents audio processing graph.
  imageContext; // represents image with face.
  analyser; // provides real time frequency analysis info for audio.
  tracking;
  recorder;

  audioBlob;
  faceImages = [];

  @ViewChild('userVideoStream') userVideoStream;
  @ViewChild('canvasToRenderUserImage') canvasToRenderUserImage;

  constructor(
    private _recorderService: RecorderService,
    private _cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.videoNativeElement = <HTMLVideoElement>(
      this.userVideoStream.nativeElement
    );

    this.canvasNativeElement = <HTMLCanvasElement>(
      this.canvasToRenderUserImage.nativeElement
    );
    this.imageContext = this.canvasNativeElement.getContext('2d');

    this.speechRecognition = new (<any>window).webkitSpeechRecognition();
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this._recorderService.init.call(this);

    navigator.mediaDevices
      .getUserMedia({ video: { width: 500, height: 500 } })
      .then((stream) => {
        this.videoNativeElement.srcObject = stream;
      })

      // hands free might be possible.
      // have not gotten this to work yet.
      
      // this.speechRecognition.start(); 

      // this.speechRecognition.onspeechstart = (event) => {
      //   console.log('speech started');
      //   this.startRecognition();
      // };

      // this.speechRecognition.onspeechend = (event) => {
      //   console.log('speech ended');
      // }

      this.speechRecognition.onerror = (event) => {
        console.log(event.message);
      }
  }

  startRecognition() {
    this.faceImages = [];
    this.speechRecognition.start();
    this.analyzeVoice();
    const intervalId = setInterval(this.analyzeFace.bind(this), 1000);

    this.speechRecognition.onresult = (event) => {
      this.recorder.stop();
      clearInterval(intervalId);

      this.recorder.exportWAV((blob) => {
        console.log(blob);
        console.log(this.faceImages);

        // not calling external apis yet.
        // let formData: FormData = new FormData();
        // formData.append('apikey', environment.apiKeys.webEmpath);
        // formData.append('wav', blob);
        // this._webEmpathService.getUserEmotion(formData).subscribe(response => {
        //   this.emotionData = response;
        //   this._cdRef.detectChanges();
        // });
      }, 'audio/wav');
    };
  }

  analyzeVoice() {
    navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(
      (stream) => {
        let input = this.audioContext.createMediaStreamSource(stream);
        this.recorder = new (<any>window).Recorder(input);
        input.connect(this.analyser);
        this.recorder.record();
      },
      (e) => {
        alert('Voice input is not available.');
      }
    );
  }

  analyzeFace() {
    const tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);
    tracking.track('#userVideoStream', tracker);

    tracker.once('track', (event) => {
      if (event.data.length > 0) {
        this.imageContext.drawImage(
          this.videoNativeElement,
          0,
          0,
          this.canvasNativeElement.width,
          this.canvasNativeElement.height
        );
        // this.videoNativeElement.srcObject.getVideoTracks().forEach(track => track.stop()); 
        let userImage = this.canvasNativeElement.toDataURL('image/jpeg', 1);
        this.faceImages.push(userImage);
      }
    });
  }
}
