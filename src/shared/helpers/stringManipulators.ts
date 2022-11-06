export const getTextWithRemovedIndex = (text: string, idx: number) => text.slice(0, idx - 1) + text.slice(idx);
export const addTextWithAtIndex = (text: string, idx: number, addedText: string) => text.slice(0, idx) + addedText + text.slice(idx);
