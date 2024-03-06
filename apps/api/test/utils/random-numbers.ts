export function randomNumbers(length: number): number {
  // Verifica se o tamanho é válido
  if (length <= 0) {
    throw new Error('O tamanho deve ser maior que 0')
  }

  // Gera um número aleatório com o tamanho especificado
  let randomNumber = Math.floor(Math.random() * Math.pow(10, length))

  // Garante que o número aleatório tenha o tamanho correto
  while (randomNumber.toString().length < length) {
    randomNumber = Math.floor(Math.random() * Math.pow(10, length))
  }

  return randomNumber
}
