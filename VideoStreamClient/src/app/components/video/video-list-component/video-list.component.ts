import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SeriesInformation } from 'src/app/classes/Models/series-information';
import { Video } from 'src/app/classes/Models/Video';
import { VideoGalleryService } from 'src/app/services/video-gallery.service';
import { UIBase } from '../../common/ui-base-component/ui-base.component';

@Component({
    selector: 'video-list-component',
    templateUrl: './video-list.component.html',
    styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent extends UIBase implements OnInit, OnDestroy {
    private destroy$: Subject<boolean> = new Subject();
    seriesInformation: SeriesInformation;
    episodes: Video[];
    selectedEpisode: Video

    constructor(private videoGalleryService: VideoGalleryService,
        private router: Router,
        private activeRoute: ActivatedRoute) {
        super();
    }

    ngOnInit(): void {
        if (!history.state.seriesInformation) {
            //redirect to not found
            this.activeRoute.paramMap.pipe(
                map((params: ParamMap) =>
                    this.videoGalleryService.GetSeriesByID(params.get('seriesID'))
                        .pipe(
                            map(seriesInformation => {
                                this.onSeriesInfoReady(seriesInformation);
                            }),
                            take(1)
                        )
                        .subscribe()
                ),
                take(1)
            ).subscribe();
        } else {
            this.onSeriesInfoReady(history.state.seriesInformation);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private onSeriesInfoReady(seriesInformation: SeriesInformation) {
        this.seriesInformation = seriesInformation;
        this.loadBreadcrumb();
        this.loadEpisoides();
    }

    private loadBreadcrumb() {
        this.breadcrumbItems = [
            {
                id: 'Home',
                label: 'Home',
                path: '/home'
            },
            {
                id: 'series-gallery-list',
                label: 'Series Gallery',
                path: '/series-gallery-list'
            },
            {
                id: this.seriesInformation.id,
                label: this.seriesInformation.displayName,
                path: `/series-episode-list/${this.seriesInformation.id}`
            }
        ];
    }

    private loadEpisoides() {
        this.videoGalleryService.GetEpisodesForSeries(this.seriesInformation.id)
            .pipe(
                take(1),
                map(result => {
                    this.episodes = result;
                })
            )
            .subscribe();
    }

    SelectFile(episode: Video) {
        this.selectedEpisode = undefined;
        setTimeout(() => {
            this.selectedEpisode = episode;
        }, 500);
    }

}