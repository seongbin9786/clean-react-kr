export class InvalidCredentialsError extends Error {
  constructor () {
    super('이메일 또는 비밀번호가 올바르지 않습니다')
    this.name = 'InvalidCredentialsError'
  }
}
