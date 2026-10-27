import assert from 'node:assert/strict';

export class ControlledClock {
  private currentTime: number;

  constructor(initialTime: number = Date.now()) {
    assert.ok(Number.isFinite(initialTime));
    this.currentTime = initialTime;
  }

  readonly now = (): number => this.currentTime;

  advanceTo(timestamp: number): void {
    assert.ok(
      Number.isFinite(timestamp),
      'El instante debe ser un número finito.'
    );

    assert.ok(
      timestamp >= this.currentTime,
      'El reloj controlado no puede retroceder.'
    );

    this.currentTime = timestamp;
  }
}
