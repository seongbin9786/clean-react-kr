export class EmailInUseError extends Error {
  constructor () {
    super('이미 사용 중인 이메일입니다')
    this.name = 'EmailInUseError'
  }
}
