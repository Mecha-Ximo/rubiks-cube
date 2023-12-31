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

  private readonly restartSection: HTMLDivElement;

  private classes = ['absolute', 'top-0', 'right-0', 'p-4', 'font-bold'];

  public uiState: { size: number };

  constructor(size: number, onSurrender: () => void, onNewGame: () => void) {
    this.uiState = {
      size,
    };
    this.gameStateDIV = this.createGameStateDIV();
    this.surrenderButton = this.createButton('Surrender', onSurrender);
    this.restartSection = this.createRestartSection(onNewGame);

    document.body.append(this.gameStateDIV);
  }

  private createRestartSection(onNewGame: () => void): HTMLDivElement {
    const div = document.createElement('div');

    const h4 = document.createElement('h4');
    h4.textContent = 'New game';

    const label = document.createElement('label');
    label.textContent = 'Size';
    label.style.display = 'block';

    const input = document.createElement('input');
    input.type = 'number';
    input.value = this.uiState.size.toString();
    input.addEventListener('input', (e) => {
      this.uiState.size = +(e.target as HTMLInputElement).value;
    });

    const restartButton = this.createButton('Restart', onNewGame);

    div.append(h4, label, input, restartButton);

    return div;
  }

  private createButton(text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.display = 'block';
    button.classList.add('border', 'p-2', 'm-2', 'border-black');
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
      this.gameStateDIV.append(this.restartSection);
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
