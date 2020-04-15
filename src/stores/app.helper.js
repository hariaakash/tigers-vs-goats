import {
    get,
} from 'svelte/store';

import {
    app
} from './app';
import {
    GameState,
    HistoryStack,
} from '../helpers/state';
import {
    updateUserInterface,
} from '../helpers/utilities';

const methods = {
    init: () => {
        app.set({
            currentGameState: new GameState(),
            MoveHistory: new HistoryStack(),
            isInProgress: false,
            selectedId: -1,
            depthLimit: 6,
            timeLimit: 2,
            computerPlaysAs: -1,
            isInProgress: false,
        });
        updateUserInterface();
    },
    data: () => get(app),
    updateField: (key, value) => {
        app.update((data) => {
            data[key] = value;
            return data;
        });
    }
};

export default {
    ...methods,
    ...app,
}