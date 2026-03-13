import { atom } from 'recoil';

export const ProfileState = atom({
    key: 'ProfileState',
    default: {
        data: {} as any,
    },
});