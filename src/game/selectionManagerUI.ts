export class SelectionManagerUI {
  private selectCubieDIV: HTMLDivElement;

  private spinCubieDIV: HTMLDivElement;

  private classes = ['absolute', 'top-0', 'p-4', 'font-bold'];

  constructor() {
    this.selectCubieDIV = this.createSelectCubieDIV();
    this.spinCubieDIV = this.createSpinCubieDiv();

    this.showSelectCubieDiv();
    document.body.append(this.selectCubieDIV, this.spinCubieDIV);
  }

  public showSelectCubieDiv(): void {
    this.selectCubieDIV.style.display = 'block';
    this.spinCubieDIV.style.display = 'none';
  }

  public showSpinCubieDiv(): void {
    this.selectCubieDIV.style.display = 'none';
    this.spinCubieDIV.style.display = 'block';
  }

  private createSelectCubieDIV(): HTMLDivElement {
    const div = document.createElement('div');
    div.textContent = 'Select a cubie by touching / clicking it';
    div.classList.add(...this.classes);

    return div;
  }

  private createSpinCubieDiv(): HTMLDivElement {
    const div = document.createElement('div');
    div.innerHTML = `
    Spin the selected cubie:
    <ul class="p-2">
    <li>Press &uarr; / &darr; to spin around &#128997;</li>
    <li>Press &larr; / &rarr; to spin around &#129001;</li>
    <li>Press Q / W to spin around &#128998;</li>
    </ul>
    `;
    div.classList.add(...this.classes);

    return div;
  }
}
