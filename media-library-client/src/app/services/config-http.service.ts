import { UseQueryOptions } from '@tanstack/react-query';
import FolderLibrary from '../classes/folder-library';
import {
	configAPI,
	handleResponse,
	headers,
	requestMode,
	validateOkResponse,
} from '../classes/http-helper-const';
import { cacheStaleTime } from '../constants';
import urlCombine from '../functions/url-combine';
import HttpOptions from '../interfaces/http-options';
import { MainConfig } from '../interfaces/main-config';
import QueryClientWrapper from '../utils/create-query-client';

export class ConfigHttpService {
	private readonly isConfiguredPath = 'IsConfigured';
	private readonly getConfigPath = 'GetConfig';
	private readonly saveConfigPath = 'SaveConfig';
	private readonly getFoldersPath = 'GetFolders';
	private readonly saveFoldersPath = 'SaveFolders';

	IsConfigured() {
		return {
			queryKey: [this.isConfiguredPath],
			queryFn: async (): Promise<FolderLibrary[]> => {
				const url = urlCombine(configAPI, this.isConfiguredPath);
				const res = await fetch(url, {
					headers: headers,
					mode: requestMode,
					credentials: 'include',
				});
				await validateOkResponse(res);
				return await res.clone().json();
			},
			staleTime: cacheStaleTime,
		};
	}

	GetConfig() {
		return {
			queryKey: [this.getConfigPath],
			queryFn: async (): Promise<FolderLibrary[]> => {
				const url = urlCombine(configAPI, this.getConfigPath);
				const res = await fetch(url, {
					headers: headers,
					mode: requestMode,
					credentials: 'include',
				});
				await validateOkResponse(res);
				return await res.clone().json();
			},
			staleTime: cacheStaleTime,
		};
	}

	async SaveConfig(objects: MainConfig, options?: HttpOptions) {
		const url = urlCombine(configAPI, this.saveConfigPath);
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(objects),
			mode: requestMode,
			credentials: 'include',
		});
		await handleResponse(response, 'save', FolderLibrary.name, options);
		await QueryClientWrapper.InvalidateKey([this.getConfigPath]);
	}

	GetFolders(): UseQueryOptions<FolderLibrary[], unknown, FolderLibrary[]> {
		return {
			queryKey: [this.getFoldersPath],
			queryFn: async (): Promise<FolderLibrary[]> => {
				const url = urlCombine(configAPI, this.getFoldersPath);
				const res = await fetch(url, {
					headers: headers,
					mode: requestMode,
					credentials: 'include',
				});
				await validateOkResponse(res);
				return await res.clone().json();
			},
			staleTime: cacheStaleTime,
		};
	}

	async SaveFolders(objects: FolderLibrary[], options?: HttpOptions) {
		const url = urlCombine(configAPI, this.saveFoldersPath);
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(objects),
			mode: requestMode,
			credentials: 'include',
		});
		await handleResponse(response, 'save', FolderLibrary.name, options);
		await QueryClientWrapper.InvalidateKey([this.getFoldersPath]);
	}
}
