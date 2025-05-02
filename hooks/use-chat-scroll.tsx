import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadmore: () => void;
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  loadmore,
  shouldLoadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const topDiv = chatRef?.current;

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;
      if (scrollTop === 0 && shouldLoadMore) {
        loadmore();
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);
    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadmore, chatRef]);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef.current;
    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) {
        return false;
      }

      const distanceeFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceeFromBottom <= 100;
    };
    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [bottomRef, chatRef, count, hasInitialized]);
};
