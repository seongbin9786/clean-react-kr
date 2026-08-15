export class AccessDeniedError extends Error {
  constructor () {
    super('접근 권한이 없습니다!')
    this.name = 'AccessDeniedError'
  }
}
