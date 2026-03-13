import { atom } from 'recoil';

export const FolderState = atom({
    key: 'FolderState',
    default: {
        data: [] as any[],
    },
});