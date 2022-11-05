export const getTextWithRemovedIndex = (text: string, idx: number) => text.slice(0, idx) + text.slice(idx + 1)
export const addTextWithAtIndex = (text: string, idx: number, addedText: string) => text.slice(0, idx) + addedText + text.slice(idx)
