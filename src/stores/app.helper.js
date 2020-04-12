import {
    get,
} from 'svelte/store';

import {
    app
} from './app';

import {
    GameState,
    HistoryStack,
} from '.././helpers/classes';

import {
    updateUserInterface,
} from '.././helpers/utilities';

const init = () => {
    app.set({
        currentGameState: new GameState(),
        MoveHistory: new HistoryStack(),
        isInProgress: false,
        selectedId: -1,
        agent: 'mtdfAgent',
        depthLimit: 1,
        timeLimit: 1,
    });
    updateUserInterface();
};

const data = () => get(app);

export default {
    init,
    data,
}