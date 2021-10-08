/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.imageWrapper}>
        <Link href="/">
          <a>
            <Image src="/images/logo.svg" alt="logo" width={240} height={26} />
          </a>
        </Link>
      </div>
    </header>
  );
}
