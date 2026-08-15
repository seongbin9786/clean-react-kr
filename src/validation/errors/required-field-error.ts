export class RequiredFieldError extends Error {
  constructor () {
    super('필수 입력 항목입니다')
    this.name = 'RequiredFieldError'
  }
}
