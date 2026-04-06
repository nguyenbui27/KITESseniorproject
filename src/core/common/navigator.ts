import ChatListScreen from "../../page/chat";
import ChildrenScreen from "../../page/children";
import InspectorScreen from "../../page/inspector";
import MapScreen from "../../page/map";
import ProfileScreen from "../../page/profile";

export const bottomNavigator = [
    {
        component: ProfileScreen,
        name: "Account",
        icon: 'account-circle-outline',
        role: ['admin', 'parent', 'child']
    },
    {
        component: ChildrenScreen,
        name: "Children",
        icon: 'human-child',
        role: ['admin', 'parent']
    },
    {
        component: MapScreen,
        name: "Map",
        icon: 'map-marker-radius-outline',
        role: ['admin', 'parent']
    },
    {
        component: InspectorScreen,
        name: "Guardians",
        icon: 'account-supervisor-outline',
        role: ['admin', 'parent', 'child']
    },
    {
        component: ChatListScreen,
        name: "Chat",
        icon: 'chat-outline',
        role: ['admin', 'parent', 'child']
    },
]
