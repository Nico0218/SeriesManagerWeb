import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { firstValueFrom, lastValueFrom } from "rxjs";
import { map, take } from "rxjs/operators";
import { Video } from "../../../classes/Models/Video";
import { VideoGallery } from "../../../classes/Models/video-gallery";
import { AiringState } from "../../../enums/airing-state";
import { ObjectStatus } from "../../../enums/config/object-status";
import { VideoGalleryService } from "../../../services/video-gallery.service";
import { VideoService } from "../../../services/video.service";
import { UIBase } from "../../common/ui-base-component/ui-base.component";

@Component({
  selector: "video-list-component",
  templateUrl: "./video-list.component.html",
  styleUrls: ["./video-list.component.scss"],
})
export class VideoListComponent extends UIBase implements OnInit, OnDestroy {
  public videoGallery?: VideoGallery;
  public videos?: Video[];
  public selectedVideo?: Video;
  public page = 1;
  public pageSize = 12;
  public collectionSize = 0;
  public canEdit = false;
  public AiringState = AiringState;

  private tempVideoGallery?: VideoGallery;

  constructor(
    private videoGalleryService: VideoGalleryService,
    private videoService: VideoService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    super(router.config);
  }

  ngOnInit(): void {
    this.selectedVideo = {
      id: '',
      name: '',
      displayName: '',
      galleryID: '',
      status: ObjectStatus.Created
    };
    this.loading = true;
    if (!history.state.videoGallery) {
      //redirect to not found
      this.activeRoute.paramMap
        .pipe(
          map((params: ParamMap) => {
            const objID = params.get("objID");
            if (objID) {
              this.videoGalleryService
                .GetByID(objID)
                .pipe(
                  map((videoGallery) => {
                    this.onVideoGalleryReady(videoGallery);
                  }),
                  take(1)
                )
                .subscribe()
            }
          }
          ),
          take(1)
        )
        .subscribe();
    } else {
      this.onVideoGalleryReady(history.state.videoGallery);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private async onVideoGalleryReady(videoGallery: VideoGallery) {
    this.videoGallery = videoGallery;
    this.loadBreadcrumb();
    this.collectionSize = await firstValueFrom(this.videoService
      .GetCountByGallery(this.videoGallery.id));
    this.loadVideoPage();
  }

  pageChange() {
    this.loading = true;
    this.loadVideoPage();
  }

  private loadVideoPage() {
    if (this.videoGallery) {
      this.videoService
        .GetByPage(this.videoGallery.id, this.page, this.pageSize)
        .pipe(
          map((result) => {
            this.videos = result;
            this.loading = false;
          }),
          take(1)
        )
        .subscribe();
    } else {
      console.error(`Video Gallery has not been set`);
    }
  }

  private loadBreadcrumb() {
    if (this.videoGallery) {
      this.AddBreadCrumbItem("Home");
      this.AddBreadCrumbItem("VideoGalleryList");
      this.AddBreadCrumbItem(
        "VideoList",
        this.videoGallery.displayName,
        this.videoGallery.id
      );
    } else {
      console.error(`Video Gallery has not been set`);
    }
  }

  SelectFile(episode: Video) {
    this.selectedVideo = undefined;
    setTimeout(() => {
      this.selectedVideo = episode;
    }, 500);
  }

  download(id: string) {
    console.log(id);
  }

  Edit() {
    this.tempVideoGallery = JSON.parse(JSON.stringify(this.videoGallery));
    this.canEdit = true;
  }

  async Save() {
    this.canEdit = false;
    this.loading = true;
    if (this.videoGallery) {
      this.videoGallery.status = ObjectStatus.Modified;
      await lastValueFrom(this.videoGalleryService.Save(this.videoGallery));
      this.videoGallery.status = ObjectStatus.None;
      this.tempVideoGallery = undefined;
      this.loading = false;
    } else {
      console.error(`Video Gallery has not been set`);
    }
  }

  Cancel() {
    this.videoGallery = JSON.parse(JSON.stringify(this.tempVideoGallery));
    this.canEdit = false;
  }

  RateChange($event: any) {
    this.Save();
  }

  AiringStateClicked(airingState: number) {
    if (this.videoGallery) {
      this.videoGallery.airingState = airingState;
    } else {
      console.error(`Video Gallery has not been set`);
    }
  }
}
