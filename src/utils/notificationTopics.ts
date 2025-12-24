// Whenever need to integrate push notifications - topic based

export const ALL_USERS_TOPIC = "all_users";

export const userTopic = (userId: string) => `user_${userId}`;

/**
 * Condition-based sending supports up to 5 topics. :contentReference[oaicite:7]{index=7}
 * We will use conditions only when <= 5 topics, otherwise send topic-by-topic.
 */
export const topicsToOrCondition = (topics: string[]) => {
  const unique = Array.from(new Set(topics)).filter(Boolean);
  if (unique.length < 1) return "";

  // "'topic1' in topics || 'topic2' in topics"
  return unique.map((t) => `'${t}' in topics`).join(" || ");
};
