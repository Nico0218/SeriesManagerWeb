import { environment } from '../../environments/environment';
export class Environment {
    public static get production(): boolean {
        return environment.production;
    }

    public static set production(v: boolean) {
        environment.production = v;
    }

    public static get apiUrl(): string {
        return environment.apiUrl;
    }

    public static set apiUrl(v: string) {
        environment.apiUrl = v;
    }
}