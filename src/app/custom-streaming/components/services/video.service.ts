import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private playingState = new Subject<boolean>();
  private loading = new BehaviorSubject<boolean>(true);
  private videoEnded = new BehaviorSubject<boolean>(false);
  private loadNext = new BehaviorSubject<string>('');

  public get loading$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  public setLoading(value: boolean): void {
    this.loading.next(value);
  }

  public play(): void {
    this.playingState.next(true);
  }

  public pause(): void {
    this.playingState.next(false);
  }

  public get playingState$(): Observable<boolean> {
    return this.playingState.asObservable();
  }

  public get videoEnded$(): Observable<boolean> {
    return this.videoEnded.asObservable();
  }

  public setVideoEnded(value: boolean): void {
    this.videoEnded.next(value);
  }

  public get loadNext$(): Observable<string> {
    return this.loadNext.asObservable();
  }

  public playNextVideo(value: string): void {
    this.loadNext.next(value)
    this.videoEnded.next(true);
    this.setLoading(false)
  }

}
