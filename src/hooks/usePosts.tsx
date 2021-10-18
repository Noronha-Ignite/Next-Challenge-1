import { createContext, useContext, useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostContextProps {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
}

const postsContext = createContext({} as PostContextProps);

export const PostContextWrapper: React.FC = ({ children }) => {
  const [contextPosts, setContextPosts] = useState<Post[]>([]);

  const setPosts = (posts: Post[]) => {
    setContextPosts(posts);
  };

  return (
    <postsContext.Provider value={{ posts: contextPosts, setPosts }}>
      {children}
    </postsContext.Provider>
  );
};

export const usePosts = () => useContext(postsContext);
