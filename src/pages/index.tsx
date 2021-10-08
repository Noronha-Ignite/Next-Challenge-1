import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { useState } from 'react';

import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';
import SpinningLoadingCircle from '../components/SpinningLoadingCircle';
import { formatDate } from '../utils/formatDate';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  postsPagination: { next_page, results },
}: HomeProps) {
  const [loading, setLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(next_page);
  const [posts, setPosts] = useState(results);

  const loadNextPage = () => {
    setLoading(true);
    fetch(nextPageUrl)
      .then(response => response.json())
      .then(response => {
        setNextPageUrl(response.next_page);
        setPosts([...posts, ...response.results]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main className={styles.content}>
      <div className={styles.imageWrapper}>
        <Image width={240} height={30} src="/images/logo.svg" alt="logo" />
      </div>

      {posts.map(post => (
        <Link key={post.uid} href={`post/${post.uid}`}>
          <div className={styles.post}>
            <h2>{post.data.title}</h2>
            <h4>{post.data.subtitle}</h4>
            <section className={styles.postFooter}>
              <div>
                <FiCalendar size={20} color="#BBBBBB" />
                <span>{formatDate(new Date(post.first_publication_date))}</span>
              </div>
              <div>
                <FiUser size={20} color="#BBBBBB" />
                <span>{post.data.author}</span>
              </div>
            </section>
          </div>
        </Link>
      ))}

      {nextPageUrl && (
        <button type="button" onClick={loadNextPage}>
          {!loading ? (
            <span>Carregar mais posts</span>
          ) : (
            <SpinningLoadingCircle />
          )}
        </button>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 3,
    }
  );

  const posts: Post[] = postsResponse.results.map(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
      author: post.data.author,
      subtitle: post.data.subtitle,
    },
  }));

  return {
    revalidate: 60 * 60 * 1, // 1 hour
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
  };
};
