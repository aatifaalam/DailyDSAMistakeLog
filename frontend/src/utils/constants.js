export const MISTAKE_TYPES = [
  { value: 'WRONG_ALGORITHM', label: 'Wrong algorithm / assumption', color: '#ef4444' },
  { value: 'IMPLEMENTATION_SYNTAX', label: 'Implementation / syntax', color: '#f97316' },
  { value: 'EDGE_CASE', label: 'Edge case', color: '#eab308' },
  { value: 'TIME_COMPLEXITY', label: 'Time complexity', color: '#8b5cf6' },
  { value: 'SPACE_COMPLEXITY', label: 'Space complexity', color: '#ec4899' },
  { value: 'MISUNDERSTOOD_PROBLEM', label: 'Misunderstood problem', color: '#06b6d4' },
  { value: 'OTHER', label: 'Other', color: '#64748b' }
];

export const PLATFORMS = [
  'LeetCode',
  'HackerRank',
  'GeeksforGeeks',
  'Codeforces',
  'InterviewBit',
  'CodeChef',
  'Other'
];

export const TOPICS = [
  'Arrays',
  'Strings',
  'HashMap',
  'Binary Search',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Queue',
  'Linked List',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Heap / Priority Queue',
  'Bit Manipulation',
  'Backtracking',
  'Math',
  'Other'
];

export const REVIEW_STATUSES = [
  { value: 'NOT_REVIEWED', label: 'Not reviewed', badgeClass: 'bg-secondary' },
  { value: 'NEEDS_ANOTHER_REVIEW', label: 'Needs another review', badgeClass: 'bg-warning text-dark' },
  { value: 'REVIEWED', label: 'Reviewed', badgeClass: 'bg-success' }
];

export const getMistakeTypeBadge = (type) => {
  const found = MISTAKE_TYPES.find(t => t.value === type);
  return found ? found.label : type || 'Unspecified';
};

export const getMistakeTypeColor = (type) => {
  const found = MISTAKE_TYPES.find(t => t.value === type);
  return found ? found.color : '#64748b';
};

export const getReviewStatusBadge = (status) => {
  const found = REVIEW_STATUSES.find(s => s.value === status);
  return found || { value: status, label: status, badgeClass: 'bg-secondary' };
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};
