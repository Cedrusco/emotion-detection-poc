import { Component, OnInit, ViewChild } from '@angular/core';

import 'tracking/build/tracking';
import 'tracking/build/data/face';

import toWav from 'audiobuffer-to-wav';
import { AnalyzerService } from './services/analyzer/analyzer.service';
import { AnalyzerResponse } from './services/analyzer/analyzer';

declare var window: any;
declare var tracking: any;
declare var MediaRecorder: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Emotion Detection POC';
  emotionData: AnalyzerResponse;
  videoNativeElement; // html element where video is streamed.
  canvasNativeElement; // html element where image is stored.
  audioPlayerElement; // html element where audio is stored.
  speechRecognition; // speech recognition api for browsers.
  audioContext; // represents audio processing graph.
  imageContext; // represents image with face.
  tracking; // face tracking.

  faceImages = [];
  disableRecord;
  intervalId;

  mediaRecorder;
  recordedChunks = [];

  apiResponsePending = false;

  @ViewChild('userVideoStream') userVideoStream;
  @ViewChild('canvasToRenderUserImage') canvasToRenderUserImage;
  // @ViewChild('audioPlayer') audioPlayer;

  constructor(public analyzer: AnalyzerService) {}

  ngOnInit() {
    this.videoNativeElement = <HTMLVideoElement>(
      this.userVideoStream.nativeElement
    );

    this.canvasNativeElement = <HTMLCanvasElement>(
      this.canvasToRenderUserImage.nativeElement
    );

    // this.audioPlayerElement = <HTMLAudioElement>this.audioPlayer.nativeElement;

    this.imageContext = this.canvasNativeElement.getContext('2d');

    this.speechRecognition = new (<any>window).webkitSpeechRecognition();
    this.audioContext = new AudioContext({ sampleRate: 11025 });

    navigator.mediaDevices
      .getUserMedia({
        video: { width: { ideal: 500 }, height: { ideal: 400 } },
      })
      .then((stream) => {
        this.videoNativeElement.srcObject = stream;
      });

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
    };
  }

  startRecognition() {
    this.disableRecord = true;
    this.faceImages = [];
    // this.audioPlayerElement.src = '';
    this.emotionData = null;
    this.speechRecognition.start();
    this.analyzeVoice();

    this.speechRecognition.onresult = (event) => {
      this.disableRecord = false;
      this.mediaRecorder.stop();
      clearInterval(this.intervalId);
      this.intervalId = '';
    };
  }

  analyzeVoice() {
    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: { channelCount: 1, sampleRate: 11025 },
      })
      .then(
        (stream) => {
          this.recordedChunks = [];
          this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm',
          });

          this.mediaRecorder.addEventListener(
            'dataavailable',
            function (e) {
              if (e.data.size > 0) this.recordedChunks.push(e.data);
            }.bind(this)
          );

          this.mediaRecorder.addEventListener(
            'stop',
            function () {
              const fileReader = new FileReader();

              // Set up file reader on loaded end event
              fileReader.onloadend = () => {
                const arrayBuffer = fileReader.result as ArrayBuffer;

                // Convert array buffer into audio buffer
                this.audioContext.decodeAudioData(
                  arrayBuffer,
                  (audioBuffer) => {
                    // Do something with audioBuffer
                    const wav = toWav(audioBuffer);

                    const audioBlob = new Blob([wav], { type: 'audio/wav' });

                    // this.audioPlayerElement.src =
                    //   window.URL.createObjectURL(audioBlob);

                    var reader = new window.FileReader();
                    reader.readAsDataURL(audioBlob);
                    let audioBase64;
                    
                    reader.onloadend = function () {
                      audioBase64 = reader.result;
                      this.apiResponsePending = true
                      this.analyzer
                        .analyze({
                          voiceAudio: audioBase64,
                          faceImages: this.faceImages,
                        })
                        .subscribe(
                          (result) => {
                            this.emotionData = result;
                          },
                          (e) => {
                            console.error(e);
                          },
                          () => {
                            this.apiResponsePending = false;
                          }
                        );
                    }.bind(this);
                  }
                );
              };

              //Load blob
              fileReader.readAsArrayBuffer(
                new Blob(this.recordedChunks, {
                  type: this.mediaRecorder.mimeType,
                })
              );
            }.bind(this)
          );

          this.mediaRecorder.start();
          this.intervalId = setInterval(this.analyzeFace.bind(this), 500);

          setTimeout(() => {
            if (this.intervalId) {
              clearInterval(this.intervalId);
              this.intervalId = '';
              this.disableRecord = false;
              this.mediaRecorder.stop();
            }
          }, 5000);
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
