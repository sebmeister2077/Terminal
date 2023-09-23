import { type JSONString } from '../../models/UtilityTypes';

declare global {
    interface JSON {
        parse<Str extends string>(text: Str): Str extends JSONString<infer T> ? T : string;
        stringify<T>(value: T): JSONString<T>;
    }
}

export {};
