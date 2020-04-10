const load = (script) => {
    document.write('<' + 'script src="' + script + '" type="text/javascript"><' + '/script>');
}

load('./js/utilities.js');
load('./js/classes.js');

const app = {};

const init = () => {
    app.currentGameState = new GameState();
    app.MoveHistory = new HistoryStack();
    app.isInProgress = false;
    app.selectedId = -1;
    updateUserInterface();
}

window.onload = init;