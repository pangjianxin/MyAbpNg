import { Options } from '../models/options';

export function accountOptionsFactory(options: Options): { redirectUrl: string } {
    return {
        redirectUrl: '/',
        ...options,
    };
}
