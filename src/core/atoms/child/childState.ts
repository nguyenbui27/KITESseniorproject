import { atom } from 'recoil';

export const ChildState = atom({
    key: 'ChildState',
    default: {
        data: [] as any[],
    },
});