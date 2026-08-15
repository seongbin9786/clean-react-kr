export class UnexpectedError extends Error {
  constructor () {
    super('문제가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    this.name = 'UnexpectedError'
  }
}
