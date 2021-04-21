import React from 'react'

import styles from './BtnSpinner.module.css'

export default function BtnSpinner() {
    return (
        <div className={styles.loader}>
            Loading...
        </div>
    )
}
