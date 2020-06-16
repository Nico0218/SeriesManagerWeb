import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoHostComponent } from './video-host-component.component';

describe('VideoHostComponentComponent', () => {
  let component: VideoHostComponent;
  let fixture: ComponentFixture<VideoHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
