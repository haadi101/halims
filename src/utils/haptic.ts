// Vibration API wrapper — safe no-op on unsupported devices
export const haptic = {
  tap:     () => navigator.vibrate?.(8),
  light:   () => navigator.vibrate?.(15),
  crack:   () => navigator.vibrate?.([12, 40, 18]),
  success: () => navigator.vibrate?.([10, 25, 10, 25, 40]),
  blow:    () => navigator.vibrate?.(180),
};
