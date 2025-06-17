import qs from "query-string";
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";

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

  // ✅ Correctly typed for React Query v4
  const fetchMessages = async (
    context: QueryFunctionContext,
  ): Promise<ChatResponse> => {
    const pageParam = context.pageParam as string | undefined;

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
      initialPageParam: undefined,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
