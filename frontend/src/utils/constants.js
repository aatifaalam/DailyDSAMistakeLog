export const MISTAKE_TYPES = [
  { value: 'WRONG_ALGORITHM', label: 'Wrong algorithm / assumption', color: '#EF4743', bg: 'rgba(239, 71, 67, 0.15)' },
  { value: 'IMPLEMENTATION_SYNTAX', label: 'Implementation / syntax', color: '#FFA116', bg: 'rgba(255, 161, 22, 0.15)' },
  { value: 'EDGE_CASE', label: 'Edge case', color: '#FFC01E', bg: 'rgba(255, 192, 30, 0.15)' },
  { value: 'TIME_COMPLEXITY', label: 'Time complexity', color: '#58A6FF', bg: 'rgba(88, 166, 255, 0.15)' },
  { value: 'SPACE_COMPLEXITY', label: 'Space complexity', color: '#A371F7', bg: 'rgba(163, 113, 247, 0.15)' },
  { value: 'MISUNDERSTOOD_PROBLEM', label: 'Misunderstood problem', color: '#00B8A3', bg: 'rgba(0, 184, 163, 0.15)' },
  { value: 'OTHER', label: 'Other', color: '#8A8A8A', bg: 'rgba(138, 138, 138, 0.15)' }
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
  { value: 'NOT_REVIEWED', label: 'Not reviewed', color: '#8A8A8A', bg: 'rgba(138, 138, 138, 0.15)', badgeClass: 'badge-status-neutral' },
  { value: 'NEEDS_ANOTHER_REVIEW', label: 'Needs another review', color: '#FFA116', bg: 'rgba(255, 161, 22, 0.15)', badgeClass: 'badge-status-warning' },
  { value: 'REVIEWED', label: 'Reviewed', color: '#2CBB5D', bg: 'rgba(44, 187, 93, 0.15)', badgeClass: 'badge-status-success' }
];

export const getMistakeTypeBadge = (type) => {
  const found = MISTAKE_TYPES.find(t => t.value === type);
  return found ? found.label : type || 'Unspecified';
};

export const getMistakeTypeColor = (type) => {
  const found = MISTAKE_TYPES.find(t => t.value === type);
  return found ? found.color : '#8A8A8A';
};

export const getMistakeTypeBg = (type) => {
  const found = MISTAKE_TYPES.find(t => t.value === type);
  return found ? found.bg : 'rgba(138, 138, 138, 0.15)';
};

export const getReviewStatusBadge = (status) => {
  const found = REVIEW_STATUSES.find(s => s.value === status);
  return found || { value: status, label: status || 'Not reviewed', color: '#8A8A8A', bg: 'rgba(138, 138, 138, 0.15)', badgeClass: 'badge-status-neutral' };
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
