import AiringState from '../enums/airing-state';
import LogicModelBase from './logic-model-base';

export default interface VideoGallery extends LogicModelBase {
	description: string;
	wikiLink: string;
	rating: number;
	episodeCount: number;
	airingState: AiringState;
}
