import { atom } from 'recoil';

export const LocationState = atom({
    key: 'LocationState',
    default: {
        data: null as any,
    },
});