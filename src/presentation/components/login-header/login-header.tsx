import Styles from './login-header-styles.scss'
import { Logo } from '@/presentation/components'

import React, { memo } from 'react'

const LoginHeader: React.FC = () => {
  return (
    <header className={Styles.headerWrap}>
      <Logo />
      <h1>4Dev - 개발자를 위한 설문조사</h1>
    </header>
  )
}

export default memo(LoginHeader)
