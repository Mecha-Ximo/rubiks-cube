import { GameState } from '../types';
import { pad } from '../utils';

type StartingStateInfo = {
  state: GameState.STARTING;
  spinsLeft: number;
};

type PlayingStateInfo = {
  state: GameState.PLAYING;
  spins: number;
  seconds: number;
};

type UpdateGameStateProps = StartingStateInfo | PlayingStateInfo;

export class GameManagerUI {
  private gameStateDIV: HTMLDivElement;

  private readonly surrenderButton: HTMLButtonElement;

  private readonly restartButton: HTMLButtonElement;

  private classes = ['absolute', 'top-0', 'right-0', 'p-4', 'font-bold'];

  constructor(onSurrender: () => void, onNewGame: () => void) {
    this.gameStateDIV = this.createGameStateDIV();
    this.surrenderButton = this.createButton('Surrender', onSurrender);
    this.restartButton = this.createButton('Restart', onNewGame);

    document.body.append(this.gameStateDIV);
  }

  private createButton(text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.display = 'block';
    button.onclick = onClick;

    return button;
  }

  public updateGameStateDIV(props: UpdateGameStateProps): void {
    if (props.state === GameState.STARTING) {
      this.gameStateDIV.innerText = `Shuffling cube: spins left ${props.spinsLeft}`;
    }

    if (props.state === GameState.PLAYING) {
      this.gameStateDIV.innerHTML = `
            <p>Spins done: ${props.spins}</p>
            <p>Timer: ${this.updateTimer(props.seconds)}</p>
        `;
      this.gameStateDIV.append(this.surrenderButton);
      this.gameStateDIV.append(this.restartButton);
    }
  }

  private createGameStateDIV(): HTMLDivElement {
    const div = document.createElement('div');
    div.classList.add(...this.classes);

    return div;
  }

  private updateTimer(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }
}
