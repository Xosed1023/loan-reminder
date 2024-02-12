export function transformNumbers(value: number | string) {
  // Se eliminan los puntos para poder hacer un posterior casteo a numero
  if (String(value).includes('.')) {
    value = replaceAll(String(value), '.', '');
  }
  return Number(value).toLocaleString('es-CO');
}

export function replaceAll(inputString: string, search: string, replacement: string) {
  return inputString.replaceAll(search, replacement);
}

export function generateUniqueId() {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}`;
}