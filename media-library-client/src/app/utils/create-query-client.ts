import { QueryClient, QueryKey, UseQueryOptions } from '@tanstack/react-query';

export default class QueryClientWrapper {
	public static queryClient = new QueryClient();

	public static InvalidateKey = async (key: QueryKey) => {
		await QueryClientWrapper.queryClient.invalidateQueries({ queryKey: key });
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
