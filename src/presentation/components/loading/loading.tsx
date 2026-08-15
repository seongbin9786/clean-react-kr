import Styles from './loading-styles.scss'
import { Spinner } from '@/presentation/components'

import React from 'react'

const Loading: React.FC = () => {
  return (
    <div data-testid="loading" className={Styles.loadingWrap}>
      <div className={Styles.loading}>
        <span>잠시만 기다려주세요...</span>
        <Spinner isNegative />
      </div>
    </div>
  )
}

export default Loading
