import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  // Add other fields your message object includes
}

interface ChatResponse {
  messages: ChatMessage[];
  nextCursor?: string | null;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({
    pageParam = undefined,
  }: {
    pageParam?: string;
  }): Promise<ChatResponse> => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true },
    );

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch messages");
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery<ChatResponse>({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
