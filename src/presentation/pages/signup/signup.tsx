import Styles from './signup-styles.scss'
import { signUpState, Input, SubmitButton, FormStatus } from './components'
import { Footer, LoginHeader, currentAccountState } from '@/presentation/components'
import { Validation } from '@/presentation/protocols'
import { AddAccount } from '@/domain/usecases'

import { useHistory, Link } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import React, { useEffect } from 'react'

type Props = {
  validation: Validation
  addAccount: AddAccount
}

const SignUp: React.FC<Props> = ({ validation, addAccount }: Props) => {
  const resetSignUpState = useResetRecoilState(signUpState)
  const { setCurrentAccount } = useRecoilValue(currentAccountState)
  const history = useHistory()
  const [state, setState] = useRecoilState(signUpState)

  useEffect(() => resetSignUpState(), [])
  useEffect(() => validate('name'), [state.name])
  useEffect(() => validate('email'), [state.email])
  useEffect(() => validate('password'), [state.password])
  useEffect(() => validate('passwordConfirmation'), [state.passwordConfirmation])

  const validate = (field: string): void => {
    const { name, email, password, passwordConfirmation } = state
    const formData = { name, email, password, passwordConfirmation }
    setState(old => ({ ...old, [`${field}Error`]: validation.validate(field, formData) }))
    setState(old => ({ ...old, isFormInvalid: !!old.nameError || !!old.emailError || !!old.passwordError || !!old.passwordConfirmationError }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    try {
      if (state.isLoading || state.isFormInvalid) {
        return
      }
      setState(old => ({ ...old, isLoading: true }))
      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation
      })
      setCurrentAccount(account)
      history.replace('/')
    } catch (error) {
      setState(old => ({
        ...old,
        isLoading: false,
        mainError: error.message
      }))
    }
  }

  return (
    <div className={Styles.signupWrap}>
      <LoginHeader />
      <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
        <h2>회원가입</h2>
        <Input type="text" name="name" placeholder="이름을 입력하세요" />
        <Input type="email" name="email" placeholder="이메일을 입력하세요" />
        <Input type="password" name="password" placeholder="비밀번호를 입력하세요" />
        <Input type="password" name="passwordConfirmation" placeholder="비밀번호를 다시 입력하세요" />
        <SubmitButton text="가입하기" />
        <Link data-testid="login-link" replace to="/login" className={Styles.link}>로그인으로 돌아가기</Link>
        <FormStatus />
      </form>
      <Footer />
    </div>
  )
}

export default SignUp
