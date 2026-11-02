// Local horizontal plane: x east, y north; distance NM, speed kt, time seconds.
// All bearings clockwise from north. Magnetic variation is zero in this starter.
export const normalize = angle => ((angle % 360) + 360) % 360;
const radians = angle => angle * Math.PI / 180;
export function bearingTo(aircraft, station) {
  if (Math.hypot(station.x - aircraft.x, station.y - aircraft.y) < 0.01) return null;
  return normalize(Math.atan2(station.x - aircraft.x, station.y - aircraft.y) * 180 / Math.PI);
}
export function relativeBearing(heading, bearing) {
  return bearing === null ? null : normalize(bearing - heading);
}
export function groundVector(heading, tas, windFrom, windSpeed) {
  const east = tas * Math.sin(radians(heading)) - windSpeed * Math.sin(radians(windFrom));
  const north = tas * Math.cos(radians(heading)) - windSpeed * Math.cos(radians(windFrom));
  const speed = Math.hypot(east, north);
  return { east, north, speed, track: speed < 1e-8 ? null : normalize(Math.atan2(east, north) * 180 / Math.PI) };
}
export function step(state, seconds) {
  const { east, north } = groundVector(state.heading, state.tas, state.windFrom, state.windSpeed);
  return { ...state, x: state.x + east * seconds / 3600, y: state.y + north * seconds / 3600 };
}
