const app = {};

window.onload = () => {
    app.currentGameState = new GameState();
    app.MoveHistory = new HistoryStack();
    app.isInProgress = false;
    app.selectedId = -1;
    updateUserInterface();
}