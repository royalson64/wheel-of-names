export function getSliceAngle(sliceCount: number): number {
  return 360 / sliceCount;
}

export function getTargetRotation(winnerIndex: number, sliceCount: number): number {
  const sliceAngle = getSliceAngle(sliceCount);
  return ((360 - (winnerIndex + 0.5) * sliceAngle) % 360 + 360) % 360;
}

export function nextSpinRotation(
  currentRotation: number,
  winnerIndex: number,
  sliceCount: number,
  spins: number
): number {
  const currentMod = ((currentRotation % 360) + 360) % 360;
  const targetMod = getTargetRotation(winnerIndex, sliceCount);
  const delta = (targetMod - currentMod + 360) % 360;
  return currentRotation + spins * 360 + delta;
}
