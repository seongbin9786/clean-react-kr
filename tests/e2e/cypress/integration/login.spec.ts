import * as FormHelper from '../utils/form-helpers'
import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

import faker from 'faker'

const path = /api\/login/
const mockInvalidCredentialsError = (): void => Http.mockUnauthorizedError(path)
const mockUnexpectedError = (): void => Http.mockServerError(path, 'POST')
const mockSuccess = (): void => {
  Http.mockOk(/api\/surveys/, 'GET', 'survey-list')
  Http.mockOk(path, 'POST', 'account', 'loginRequest')
}

const populateFields = (): void => {
  cy.getByTestId('email').focus().type(faker.internet.email())
  cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
}

const simulateValidSubmit = (): void => {
  populateFields()
  cy.getByTestId('submit').click()
}

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('Should load with correct initial state', () => {
    cy.getByTestId('email').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('email', '필수 입력 항목입니다')
    cy.getByTestId('password').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('password', '필수 입력 항목입니다')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should reset state on page load', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    FormHelper.testInputStatus('email')
    cy.getByTestId('signup-link').click()
    cy.getByTestId('login-link').click()
    FormHelper.testInputStatus('email', '필수 입력 항목입니다')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word())
    FormHelper.testInputStatus('email', '올바른 값이 아닙니다')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    FormHelper.testInputStatus('password', '올바른 값이 아닙니다')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    FormHelper.testInputStatus('email')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    FormHelper.testInputStatus('password')
    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present InvalidCredentialsError on 401', () => {
    mockInvalidCredentialsError()
    simulateValidSubmit()
    FormHelper.testMainError('이메일 또는 비밀번호가 올바르지 않습니다')
    Helper.testUrl('/login')
  })

  it('Should present UnexpectedError on default error cases', () => {
    mockUnexpectedError()
    simulateValidSubmit()
    FormHelper.testMainError('문제가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    Helper.testUrl('/login')
  })

  it('Should store account on localStorage if valid credentials are provided', () => {
    mockSuccess()
    simulateValidSubmit()
    Helper.testUrl('/')
    Helper.testLocalStorageItem('account')
  })

  it('Should prevent multiple submits', () => {
    mockSuccess()
    populateFields()
    cy.getByTestId('submit').dblclick()
    cy.wait('@loginRequest')
    cy.get('@loginRequest.all').should('have.length', 1)
  })

  it('Should not call submit if form is invalid', () => {
    mockSuccess()
    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')
    cy.get('@loginRequest.all').should('have.length', 0)
  })
})
