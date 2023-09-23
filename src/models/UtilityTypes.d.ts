export type ReplaceValueOfWith<T extends object, Keys extends keyof T, NewType> = Omit<T, Keys> & { [Key in Keys]: NewType };

/** Specifies what structure (T) a string has if it is JSON.parsed() */
export type JSONString<T> = string & { _json?: never };
