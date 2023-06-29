import { QueryClient, QueryKey, UseQueryOptions } from '@tanstack/react-query';

export default class QueryClientWrapper {
	public static queryClient = new QueryClient();

	public static InvalidateKey = (key: QueryKey) => {
		const queryCache = QueryClientWrapper.queryClient.getQueryCache();
		const queries = queryCache.findAll(key);
		for (let i = 0; i < queries.length; i++) {
			const element = queries[i];
			queryCache.remove(element);
		}
	};

	public static async GetData<T>(options: UseQueryOptions<T>) {
		let queryData: T | undefined;
		if (options.queryKey) {
			queryData = QueryClientWrapper.queryClient.getQueryData<T>(options.queryKey);
		}
		if (!queryData) {
			queryData = await QueryClientWrapper.queryClient.fetchQuery<T>(options);
		}
		return queryData;
	}
}
