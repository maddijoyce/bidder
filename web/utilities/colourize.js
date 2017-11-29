const colours = ["#1abc9c", "#16a085", "#f39c12", "#2ecc71", "#27ae60", "#e67e22", "#d35400", "#3498db", "#2980b9", "#e74c3c", "#c0392b", "#9b59b6", "#8e44ad", "#34495e", "#2c3e50", "#95a5a6", "#7f8c8d", "#ec87bf", "#d870ad", "#f69785", "#9ba37e", "#b49255", "#b49255", "#a94136"];

export function initialize(string) {
  return (string || '').split(' ').map((w) => (
    w.charAt(0)
  )).slice(0,3).join('').toUpperCase();
}

export function truncate(text) {
  if (text && text.length > 120) {
    return `${text.slice(0, 120)}...`;
  } else {
    return text;
  }
}

export default function colourize(string) {
  const lower = (string || '').toLowerCase();
  let hash = 0;
  for (let i = 0; i < (lower || '').length; i += 1) {
    hash = lower.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash %= colours.length;
  if (hash < 0) hash += colours.length;
  return colours[hash];
}
