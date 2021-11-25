import { AiringState } from 'src/app/enums/airing-state';
import { LogicModelBase } from './logic-model-base';

export class VideoGallery extends LogicModelBase {
    public description = "";
    public wikiLink = "";
    public rating = 0;
    public episodeCount = 0;
    public airingState = AiringState.Unknown;
}