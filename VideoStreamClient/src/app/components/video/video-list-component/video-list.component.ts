import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { map, take } from "rxjs/operators";
import { Video } from "../../../classes/Models/Video";
import { VideoGallery } from "../../../classes/Models/video-gallery";
import { VideoGalleryService } from "../../../services/video-gallery.service";
import { VideoService } from "../../../services/video.service";
import { UIBase } from "../../common/ui-base-component/ui-base.component";

@Component({
  selector: "video-list-component",
  templateUrl: "./video-list.component.html",
  styleUrls: ["./video-list.component.scss"],
})
export class VideoListComponent extends UIBase implements OnInit, OnDestroy {
  videoGallery: VideoGallery;
  videos: Video[];
  selectedVideo: Video;
  public page = 1;
  public pageSize = 12;
  public collectionSize = 0;

  constructor(
    private videoGalleryService: VideoGalleryService,
    private videoService: VideoService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    super(router.config);
  }

  ngOnInit(): void {
    this.selectedVideo = new Video();
    this.loading = true;
    if (!history.state.videoGallery) {
      //redirect to not found
      this.activeRoute.paramMap
        .pipe(
          map((params: ParamMap) =>
            this.videoGalleryService
              .GetByID(params.get("objID"))
              .pipe(
                map((videoGallery) => {
                  this.onVideoGalleryReady(videoGallery);
                }),
                take(1)
              )
              .subscribe()
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
    this.videoGallery.description =
      "Some place holder text for a nice long anime description. Some generic line about some generic show.";
    this.videoGallery.wikiLink =
      "ttps://myanimelist.net/anime/39535/Mushoku_Tensei__Isekai_Ittara_Honki_Dasu";
    this.loadBreadcrumb();
    this.collectionSize = await this.videoService
      .GetCountByGallery(this.videoGallery.id)
      .toPromise();
    this.loadVideoPage();
  }

  pageChange() {
    this.loading = true;
    this.loadVideoPage();
  }

  private loadVideoPage() {
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
  }

  private loadBreadcrumb() {
    this.AddBreadCrumbItem("Home");
    this.AddBreadCrumbItem("VideoGalleryList");
    this.AddBreadCrumbItem(
      "VideoList",
      this.videoGallery.displayName,
      this.videoGallery.id
    );
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
}
