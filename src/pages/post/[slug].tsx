import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import { Fragment } from 'react';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';

import Header from '../../components/Header';
import SpinningLoadingCircle from '../../components/SpinningLoadingCircle';
import Comments from '../../components/Comments';

import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';
import commonStyles from '../../styles/common.module.scss';

import { formatDate } from '../../utils/formatDate';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  preview: boolean;
}

function getWordAmountByPost(post: Post) {
  return post.data.content.reduce((acc, contentBlock) => {
    const contentWordAmount = contentBlock.body.reduce((sum, body) => {
      return sum + body.text.split(' ').length;
    }, 0);

    return acc + contentWordAmount;
  }, 0);
}

export default function Post({ post, preview }: PostProps) {
  const router = useRouter();

  if (router.isFallback)
    return (
      <div className={styles.center}>
        <h3>Carregando...</h3>
        <SpinningLoadingCircle />
      </div>
    );

  const estimateMinutesToRead = Math.ceil(getWordAmountByPost(post) / 200);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt="banner" />
      </div>
      <main>
        <header>
          <h1>{post.data.title}</h1>
          <section>
            <div>
              <FiCalendar size={20} color="#BBBBBB" />
              <span>{formatDate(new Date(post.first_publication_date))}</span>
            </div>
            <div>
              <FiUser size={20} color="#BBBBBB" />
              <span>{post.data.author}</span>
            </div>
            <div>
              <FiClock size={20} color="#BBBBBB" />
              <span>{estimateMinutesToRead} min</span>
            </div>
          </section>
        </header>

        <div className={styles.content}>
          {post.data.content.map(content => (
            <Fragment key={content.heading}>
              <h2>{content.heading}</h2>
              <div
                className={styles.postContent}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </Fragment>
          ))}
        </div>
        <Comments className={styles.commentsWrapper} />

        {preview && (
          <aside className={commonStyles.exitPreviewBtn}>
            <Link href="/api/exit-preview">
              <a>Sair do modo Preview</a>
            </Link>
          </aside>
        )}
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params as { slug: string };
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', slug, {
    ref: previewData?.ref ?? null,
  });

  const post: Post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => ({
        heading: content.heading,
        body: content.body,
      })),
    },
  };

  return {
    props: {
      post,
      preview,
    },
    revalidate: 60 * 60 * 4, // 4 hours
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      pageSize: 5,
    }
  );

  return {
    paths: [
      ...posts.results.map(result => ({
        params: { slug: result.uid },
      })),
    ],
    fallback: true,
  };
};
