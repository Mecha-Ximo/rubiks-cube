import { Difficulty, GameState } from '../types';
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

  public state: { size: number; difficulty: Difficulty };

  constructor(
    size: number,
    difficulty: Difficulty,
    onSurrender: () => void,
    onNewGame: () => void
  ) {
    this.state = {
      size,
      difficulty,
    };
    this.gameStateDIV = this.createGameStateDIV();
    this.surrenderButton = this.createButton('Surrender', onSurrender);
    this.restartSection = this.createRestartSection(onNewGame);

    document.body.append(this.gameStateDIV);
  }

  private createRestartSection(onNewGame: () => void): HTMLDivElement {
    const div = document.createElement('div');

    const newGameH = document.createElement('h3');
    newGameH.textContent = 'New game';

    const h4Size = document.createElement('h4');
    h4Size.textContent = 'Size';

    const input = document.createElement('input');
    input.type = 'number';
    input.value = this.state.size.toString();
    input.addEventListener('input', (e) => {
      this.state.size = +(e.target as HTMLInputElement).value;
    });

    const h4Difficulty = document.createElement('h4');
    h4Difficulty.textContent = 'Difficulty';
    const easyInput = this.createDifficultyRadioButton('Easy', Difficulty.EASY);
    const mediumInput = this.createDifficultyRadioButton(
      'Medium',
      Difficulty.MEDIUM
    );
    const hardInput = this.createDifficultyRadioButton('Hard', Difficulty.HARD);

    const restartButton = this.createButton('Restart', onNewGame);

    div.append(
      newGameH,
      h4Size,
      input,
      h4Difficulty,
      easyInput,
      mediumInput,
      hardInput,
      restartButton
    );

    return div;
  }

  private createButton(text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.display = 'block';
    button.classList.add('p-2', 'my-2');
    button.onclick = onClick;

    return button;
  }

  public updateGameStateDIV(props: UpdateGameStateProps): void {
    if (props.state === GameState.STARTING) {
      this.gameStateDIV.innerText = `Shuffling cube: spins left ${props.spinsLeft}`;
    }

    if (props.state === GameState.PLAYING) {
      this.gameStateDIV.innerHTML = `
          <div>
            <p>Spins done: ${props.spins}</p>
            <p>Timer: ${this.updateTimer(props.seconds)}</p>
          </div>
        `;
      this.gameStateDIV.append(this.surrenderButton);
      this.gameStateDIV.append(this.restartSection);
    }
  }

  private createGameStateDIV(): HTMLDivElement {
    const div = document.createElement('div');
    div.classList.add(...this.classes, 'game-state');

    return div;
  }

  private updateTimer(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }

  private createDifficultyRadioButton(label: string, value: Difficulty) {
    const labelEl = document.createElement('label');
    labelEl.htmlFor = label.toLowerCase();
    labelEl.textContent = label;

    const radioEl = document.createElement('input');
    radioEl.type = 'radio';
    radioEl.id = label.toLowerCase();
    radioEl.value = value;
    radioEl.name = 'difficulty';

    radioEl.addEventListener('change', (e) => {
      const update = (e.target as HTMLInputElement).value;
      if (!this.isValidDifficultyUpdate(update)) {
        return;
      }
      this.state.difficulty = update;
    });

    if (value === this.state.difficulty) {
      radioEl.checked = true;
    }

    const div = document.createElement('div');
    div.append(labelEl, radioEl);

    return div;
  }

  private isValidDifficultyUpdate(update: string): update is Difficulty {
    return (
      update === Difficulty.EASY ||
      update === Difficulty.MEDIUM ||
      update === Difficulty.HARD
    );
  }
}
