import { HTMLAttributes, useEffect, useRef } from 'react';

import styles from './comments.module.scss';

export default function Comments({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptRef = document.createElement('script');
    scriptRef.setAttribute('src', 'https://utteranc.es/client.js');
    scriptRef.setAttribute('crossorigin', 'anonymous');
    scriptRef.setAttribute('async', 'true');
    scriptRef.setAttribute('repo', process.env.NEXT_PUBLIC_UTTERANCES_REPO);
    scriptRef.setAttribute('issue-term', 'url');
    scriptRef.setAttribute('theme', 'github-dark');
    commentsRef.current.appendChild(scriptRef);
  }, []);

  return (
    <div {...props} className={`${styles.commentsWrapper} ${className}`}>
      <div ref={commentsRef} />
    </div>
  );
}
