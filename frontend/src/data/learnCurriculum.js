/**
 * Daily DSA Mistake Log - Learn DSA Curriculum Dataset
 * 
 * 13 Structured Topics designed around "Everyday Life First" pedagogy:
 * 1. Everyday Analogy
 * 2. Problem to Solve
 * 3. Intuitive Idea
 * 4. Formal Concept
 * 5. Internal Mechanics
 * 6. Visual Simulation
 * 7. Step-by-Step Dry Run
 * 8. Pseudocode
 * 9. Production Code (Java & Python)
 * 10. Asymptotic Complexity
 * 11. Common Traps & Edge Cases
 * 12. Practical Triggers
 * 13. Practice Problems (with progressive hint revelation)
 * 14. Key Takeaways
 * 15. Motivational Quote
 */

export const SIGNATURE_QUOTE = "Hints, not answers. Logic, not shortcuts.";

export const MOTIVATIONAL_QUOTES = [
  "Don't copy, understand.",
  "Struggle builds logic.",
  "Hints help, copying hurts.",
  "Earn your solutions.",
  "Think before you peek.",
  "No shortcuts to mastery.",
  "Debug your thinking first.",
  "Fail honestly, learn deeply.",
  "Your logic, your victory.",
  "Stop copying, start thinking.",
  "Understand the why, not just how.",
  "Master concepts, not solutions.",
  "Learn patterns, solve problems.",
  "Clarity before complexity.",
  "Break problems into pieces.",
  "Visualize before you code.",
  "Build logic, then write code.",
  "One concept, many applications.",
  "Practice until patterns click.",
  "Depth beats memorization.",
  "Consistency beats talent.",
  "One problem, one lesson.",
  "Small steps, strong foundations.",
  "Mistakes are learning signals.",
  "Think slowly, improve daily.",
  "Repeat until it becomes intuition.",
  "Every bug teaches something.",
  "Progress over perfection.",
  "Patience builds problem-solving skills.",
  "Don't peek too early.",
  "Think. Trace. Solve.",
  "Understand before implementing.",
  "Hints, not answers.",
  "Logic over luck.",
  "Mistakes become mastery.",
  "Trace before guessing.",
  "Learn, don't imitate.",
  "Solve with intention.",
  "Review. Reflect. Improve."
];

export const LEARN_CURRICULUM = [
  // ==========================================
  // TOPIC 1: ARRAYS AND STRINGS
  // ==========================================
  {
    id: "arrays-and-strings",
    slug: "arrays-and-strings",
    title: "Arrays and Strings",
    order: 1,
    tagline: "Contiguous memory, direct indexing, and two-pointer traversal.",
    description: "Learn how contiguous memory allows instantaneous O(1) random access, and how sliding windows and two pointers turn quadratic brute force into linear efficiency.",
    everydayAnalogySummary: "Numbered gym lockers or consecutive theater seats in a single row.",
    lessons: [
      {
        id: "intro-to-arrays",
        slug: "intro-to-arrays",
        title: "Array Fundamentals & Direct Indexing",
        summary: "Understand how consecutive memory blocks give us instantaneous random access.",
        points: [
          {
            id: "arrays-point-1",
            title: "What is an Array & Why is Indexing Instant?",
            quote: "Understand the why, not just how.",
            everydayAnalogy: {
              title: "The Numbered Gym Lockers",
              scenario: "Imagine a gym with 50 lockers lined up side-by-side in a hallway, numbered 0 to 49. If you know each locker is exactly 1 foot wide and Locker #0 begins at the entrance, how long does it take to walk to Locker #37? You don't have to open Lockers 0 through 36 to find it! You calculate the exact distance (37 feet from the start) and walk straight to it."
            },
            theProblem: "How can a computer access any arbitrary item among millions in exactly one calculation, without searching from the beginning every time?",
            theIntuition: "If all items are placed adjacent to each other with equal byte sizes, we can multiply the index by the element size and add it to the base memory address: Address = Base + (Index * ElementSize).",
            formalConcept: "An Array is a linear data structure that stores elements of the same type in contiguous memory locations. Because memory addresses are contiguous, accessing any element array[i] takes O(1) constant time.",
            internalWorking: "When you allocate int[] arr = new int[5] in Java, the JVM requests 20 contiguous bytes from the OS (4 bytes per 32-bit integer). If the starting address is 0x1000, arr[3] is stored precisely at 0x1000 + (3 * 4) = 0x100C.",
            visualType: "array-visualizer",
            dryRunSteps: [
              { step: 1, label: "Base Address", value: "arr starts at 0x1000" },
              { step: 2, label: "Index Calculation", value: "arr[2] = 0x1000 + (2 * 4) = 0x1008" },
              { step: 3, label: "Memory Retrieval", value: "Read 4 bytes at 0x1008 in one CPU cycle" }
            ],
            pseudocode: `// Direct Random Access\nfunction getElement(array, index):\n    return memory_read(array.base + index * sizeof(element))\n\n// Linear Traversal\nfunction printAll(array):\n    for i from 0 to array.length - 1:\n        print array[i]`,
            codeExamples: {
              java: `public class ArrayBasics {\n    public static void main(String[] args) {\n        int[] scores = {95, 88, 72, 90, 85};\n        // O(1) Access\n        int thirdScore = scores[2]; // 72\n        // O(1) In-place Update\n        scores[2] = 75;\n        System.out.println("Updated score: " + scores[2]);\n    }\n}`,
              python: `scores = [95, 88, 72, 90, 85]\n# O(1) Access\nthird_score = scores[2] # 72\n# O(1) In-place Update\nscores[2] = 75\nprint(f"Updated score: {scores[2]}")`
            },
            complexity: {
              time: "Access: O(1), Search: O(n), Insertion (end): O(1), Insertion (middle): O(n)",
              space: "O(n) auxiliary memory for n stored elements",
              details: "Random access is constant time. However, inserting or deleting at the front requires shifting all subsequent elements by one cell, taking O(n) time."
            },
            commonMistakes: [
              { mistake: "ArrayIndexOutOfBoundsException", fix: "Remember arrays are 0-indexed; the last valid index is length - 1, not length." },
              { mistake: "Assuming array resize is free", fix: "Standard arrays have fixed capacity. In dynamic arrays (ArrayList/list), resizing allocates a 2x larger chunk and copies all elements." }
            ],
            whenToUse: {
              useWhen: "You know the count in advance, need fast random access by index, or require tight cache locality.",
              avoidWhen: "You need frequent insertions and deletions in the middle of the collection (use Linked List instead)."
            },
            practiceProblems: [
              {
                id: "two-sum",
                title: "Two Sum",
                difficulty: "Easy",
                url: "https://leetcode.com/problems/two-sum/",
                relevance: "Demonstrates array traversal and how pairing arrays with hashing cuts quadratic search to linear.",
                hints: [
                  "Hint 1: Can you check if the complement (target - current_num) already exists?",
                  "Hint 2: A nested loop takes O(n²). What data structure checks presence in O(1)?",
                  "Hint 3: Use a HashMap to store value -> index as you iterate through the array.",
                  "Solution: Iterate once. For each num, if target - num is in map, return indices. Otherwise store num -> index."
                ]
              }
            ],
            summary: "Arrays provide instantaneous O(1) access thanks to contiguous memory, but require O(n) shifts when inserting or deleting elements."
          }
        ]
      },
      {
        id: "two-pointers-and-sliding-window",
        slug: "two-pointers-and-sliding-window",
        title: "Two Pointers & Sliding Window",
        summary: "Master moving boundaries inward or forward to avoid O(n²) nested iterations.",
        points: [
          {
            id: "two-pointers-point-1",
            title: "Two Pointers Technique",
            quote: "Clarity before complexity.",
            everydayAnalogy: {
              title: "Two Friends Meeting in a Narrow Hallway",
              scenario: "Two friends start at opposite ends of a 100-meter straight hallway and walk toward each other. Instead of one person checking every single meter and running back and forth, both move simultaneously until they meet in the middle. You explore the entire hallway in just one pass!"
            },
            theProblem: "Finding pairs or reversing sequences usually requires testing every pair with two nested loops, taking O(n²) time.",
            theIntuition: "If an array is sorted or we are inspecting opposite ends (like palindrome checking), moving left pointer rightward and right pointer leftward evaluates all valid pairs in O(n) single pass.",
            formalConcept: "The Two Pointers pattern maintains two indices (often left=0 and right=n-1) that move inward or in the same direction based on a condition, reducing nested iterations to linear O(n).",
            internalWorking: "Rather than fixing i and looping j from i+1 to n, left and right only move inward. Because each element is visited at most once by either pointer, the total operations are bounded by 2n.",
            visualType: "two-pointers-visualizer",
            dryRunSteps: [
              { step: 1, label: "Initialize", value: "left = 0, right = 4 on ['r','a','c','e','r']" },
              { step: 2, label: "Compare Ends", value: "arr[0]=='r' == arr[4]=='r' -> match! left++, right--" },
              { step: 3, label: "Compare Inner", value: "arr[1]=='a' != arr[3]=='e' -> mismatch detected in O(1) step!" }
            ],
            pseudocode: `function isPalindrome(str):\n    left = 0\n    right = str.length - 1\n    while left < right:\n        if str[left] != str[right]:\n            return false\n        left++\n        right--\n    return true`,
            codeExamples: {
              java: `public class TwoPointers {\n    public static boolean isPalindrome(String s) {\n        int left = 0, right = s.length() - 1;\n        while (left < right) {\n            if (s.charAt(left) != s.charAt(right)) return false;\n            left++;\n            right--;\n        }\n        return true;\n    }\n}`,
              python: `def is_palindrome(s: str) -> bool:\n    left, right = 0, len(s) - 1\n    while left < right:\n        if s[left] != s[right]:\n            return False\n        left += 1\n        right -= 1\n    return True`
            },
            complexity: {
              time: "O(n) linear time — each pointer advances at most n times",
              space: "O(1) auxiliary space — only two integer pointer variables used"
            },
            commonMistakes: [
              { mistake: "Infinite while loop", fix: "Ensure pointers advance unconditionally or conditionally on every iteration (left++, right--)." },
              { mistake: "Applying two-pointer sorted tricks to unsorted data", fix: "Two-pointer sum target logic requires the array to be sorted first." }
            ],
            whenToUse: {
              useWhen: "Checking symmetry, reversing in-place, finding pairs in sorted arrays, or partitioning elements.",
              avoidWhen: "Array is unsorted and sorting it would violate O(n) time constraints."
            },
            practiceProblems: [
              {
                id: "valid-palindrome",
                title: "Valid Palindrome",
                difficulty: "Easy",
                url: "https://leetcode.com/problems/valid-palindrome/",
                relevance: "Canonical two-pointer question moving inward while skipping non-alphanumeric characters.",
                hints: [
                  "Hint 1: Can you move left forward while it's non-alphanumeric, and right backward?",
                  "Hint 2: Compare characters in lowercase once both point to valid characters.",
                  "Hint 3: Stop when left >= right.",
                  "Solution: While left < right, skip non-alphanumerics, compare lowercase chars, return false if mismatch."
                ]
              },
              {
                id: "best-time-stock",
                title: "Best Time to Buy and Sell Stock",
                difficulty: "Easy",
                url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
                relevance: "One-pass boundary tracking tracking min price and max profit.",
                hints: [
                  "Hint 1: You must buy before you can sell.",
                  "Hint 2: Track the minimum price seen so far as you iterate through the days.",
                  "Hint 3: At each day, profit = current_price - min_price. Update max profit.",
                  "Solution: Maintain minPrice = infinity, maxProfit = 0. In one loop, minPrice = min(minPrice, p), maxProfit = max(maxProfit, p - minPrice)."
                ]
              }
            ],
            summary: "Two Pointers turn quadratic nested search into a linear inward or forward sweep using constant O(1) extra space."
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 2: HASHING
  // ==========================================
  {
    id: "hashing",
    slug: "hashing",
    title: "Hashing",
    order: 2,
    tagline: "Instant O(1) key lookups, frequency counting, and collision resolution.",
    description: "Understand how hash functions translate strings and numbers into array indices, enabling instantaneous duplicate detection, frequency counting, and pair finding.",
    everydayAnalogySummary: "A phone contact directory or an indexed coat-check ticket system.",
    lessons: [
      {
        id: "hashmap-and-hashset",
        slug: "hashmap-and-hashset",
        title: "HashMap & HashSet Intuition",
        summary: "Turn O(n) sequential searches into expected O(1) direct dictionary lookups.",
        points: [
          {
            id: "hashing-point-1",
            title: "Why Searching Every Entry is Slow & What Hashing Does",
            quote: "Master concepts, not solutions.",
            everydayAnalogy: {
              title: "The Coat Check Ticket",
              scenario: "When you hand your winter jacket to a theater coat check, they don't throw it in a giant heap and search through 500 coats when you return. Instead, they give you a ticket numbered 42 and hang your coat on Hook #42. When you show ticket 42, they go directly to Hook 42 in 2 seconds!"
            },
            theProblem: "Checking whether an element exists in an unsorted list of size N requires checking every single item one-by-one (O(N) time).",
            theIntuition: "If we have a mathematical function that takes any object (like a name or ID) and computes its exact slot index, we can jump directly to that slot in O(1) time.",
            formalConcept: "Hashing maps arbitrary-length keys to fixed-size integers using a Hash Function. A HashMap stores key-value pairs in buckets indexed by hash(key) % capacity, yielding expected O(1) lookup, insertion, and deletion.",
            internalWorking: "In Java, key.hashCode() generates a 32-bit integer. The map computes index = (n - 1) & hash. If two different keys land in the same bucket (collision), Java stores them in a linked list or turns them into a Red-Black Tree when bucket size exceeds 8.",
            visualType: "hash-map-visualizer",
            dryRunSteps: [
              { step: 1, label: "Hash Calculation", value: "hash('apple') -> 93029210" },
              { step: 2, label: "Bucket Index", value: "93029210 % 16 = Bucket #10" },
              { step: 3, label: "Retrieve Value", value: "Check Bucket #10 -> found 'apple' -> return price $1.50 in O(1)!" }
            ],
            pseudocode: `map = new HashMap()\nfor num in array:\n    if map.contains(num):\n        return true // duplicate found\n    map.put(num, true)\nreturn false`,
            codeExamples: {
              java: `import java.util.*;\npublic class HashingDemo {\n    public static boolean containsDuplicate(int[] nums) {\n        Set<Integer> seen = new HashSet<>();\n        for (int n : nums) {\n            if (seen.contains(n)) return true;\n            seen.add(n);\n        }\n        return false;\n    }\n}`,
              python: `def contains_duplicate(nums: list[int]) -> bool:\n    seen = set()\n    for n in nums:\n        if n in seen:\n            return True\n        seen.add(n)\n    return False`
            },
            complexity: {
              time: "Expected: O(1) for insert/get/delete. Worst-case: O(n) if all keys collide into one bucket.",
              space: "O(n) auxiliary memory for hash table buckets and entries."
            },
            commonMistakes: [
              { mistake: "Assuming O(1) is guaranteed", fix: "Remember O(1) is average-case. A malicious input or terrible hash function can degrade to O(n) if all keys collide." },
              { mistake: "Mutating object keys after inserting", fix: "If you modify a key object's fields after putting it in a Map, its hashCode changes and you won't be able to find it again." }
            ],
            whenToUse: {
              useWhen: "You need fast existence checks, frequency counts, grouping items by a characteristic, or finding pairs.",
              avoidWhen: "You need elements to remain strictly sorted by value (use TreeMap / TreeSet instead)."
            },
            practiceProblems: [
              {
                id: "contains-duplicate",
                title: "Contains Duplicate",
                difficulty: "Easy",
                url: "https://leetcode.com/problems/contains-duplicate/",
                relevance: "Classic demonstration of using a HashSet to detect repeated values in O(n) time.",
                hints: [
                  "Hint 1: Can you remember what you have already seen?",
                  "Hint 2: Storing seen elements in a HashSet provides O(1) lookups.",
                  "Hint 3: If an element is already in the set, return true.",
                  "Solution: Loop through nums; if set contains num return true; else set.add(num). Return false at end."
                ]
              },
              {
                id: "group-anagrams",
                title: "Group Anagrams",
                difficulty: "Medium",
                url: "https://leetcode.com/problems/group-anagrams/",
                relevance: "Shows using sorted string or character frequency as the hash map key to group anagrams.",
                hints: [
                  "Hint 1: Two words are anagrams if their sorted characters are identical.",
                  "Hint 2: Use the sorted word as the HashMap key.",
                  "Hint 3: Map key -> list of original words.",
                  "Solution: For each word, key = sort(word). map.computeIfAbsent(key, k -> new ArrayList<>()).add(word). Return map.values()."
                ]
              }
            ],
            summary: "Hashing exchanges space for time, converting slow O(n) sequential scanning into expected O(1) direct bucket lookups."
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 3: LINKED LISTS
  // ==========================================
  {
    id: "linked-lists",
    slug: "linked-lists",
    title: "Linked Lists",
    order: 3,
    tagline: "Dynamic nodes, pointer manipulation, and cycle detection.",
    description: "Understand non-contiguous node storage, pointer chasing, list reversal, and Floyd's cycle detection algorithm.",
    everydayAnalogySummary: "Train cars hooked together or a treasure hunt where each clue reveals the location of the next clue.",
    lessons: [
      {
        id: "nodes-and-pointers",
        slug: "nodes-and-pointers",
        title: "Nodes, Pointers & List Reversal",
        summary: "Master pointer manipulation, sentinel dummy heads, and in-place list reversal.",
        points: [
          {
            id: "linked-lists-point-1",
            title: "Nodes & Pointers vs Contiguous Arrays",
            quote: "Build logic, then write code.",
            everydayAnalogy: {
              title: "The Scavenger Hunt",
              scenario: "In a scavenger hunt, you don't receive all the clues at once in a binder. Clue #1 tells you to check under the oak tree. When you walk to the oak tree, you find Clue #2, which tells you to check the fountain. You cannot jump directly to Clue #5 — you must visit each clue in sequence to find where the next one is hidden!"
            },
            theProblem: "Arrays require a fixed contiguous block of memory. Inserting an item at the front requires moving every other item one step to the right.",
            theIntuition: "Instead of moving items, let each item live anywhere in memory and hold a reference (pointer) to the address of the next item. Inserting at the front just means updating one pointer!",
            formalConcept: "A Linked List is a linear data structure consisting of nodes. Each node contains a value and a next pointer to the subsequent node. The list starts at head and ends when next is null.",
            internalWorking: "Inserting a node after current requires only two pointer reassignments: newNode.next = current.next; current.next = newNode. No elements are moved in memory, taking O(1) time.",
            visualType: "linked-list-visualizer",
            dryRunSteps: [
              { step: 1, label: "Node Creation", value: "Node(10) -> next: Node(20) -> next: null" },
              { step: 2, label: "Reversal Setup", value: "prev = null, curr = Node(10), next = Node(20)" },
              { step: 3, label: "Flip Pointer", value: "curr.next = prev; prev = curr; curr = next" }
            ],
            pseudocode: `function reverseList(head):\n    prev = null\n    curr = head\n    while curr != null:\n        nextTemp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nextTemp\n    return prev`,
            codeExamples: {
              java: `class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n}\npublic class LinkedListReversal {\n    public static ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}`,
              python: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head: ListNode) -> ListNode:\n    prev, curr = None, head\n    while curr:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev`
            },
            complexity: {
              time: "Access/Search: O(n), Insertion/Deletion at head: O(1)",
              space: "O(1) auxiliary space for in-place pointer reversal"
            },
            commonMistakes: [
              { mistake: "Losing the rest of the list", fix: "Always save curr.next in a temporary variable BEFORE reassigning curr.next to prev!" },
              { mistake: "NullPointerException on head.next", fix: "Always guard against null head and single-node edge cases." }
            ],
            whenToUse: {
              useWhen: "You need constant time O(1) insertions/deletions at the ends, or don't know collection size in advance.",
              avoidWhen: "You need random access by index arr[i] (Linked lists require sequential O(n) traversal)."
            },
            practiceProblems: [
              {
                id: "reverse-linked-list",
                title: "Reverse Linked List",
                difficulty: "Easy",
                url: "https://leetcode.com/problems/reverse-linked-list/",
                relevance: "The foundational pointer manipulation problem every developer must master.",
                hints: [
                  "Hint 1: Maintain a prev pointer initialized to null.",
                  "Hint 2: Save the next node before overwriting curr.next.",
                  "Hint 3: Return prev at the end as the new head.",
                  "Solution: Loop while curr is not null. Cache next = curr.next, flip curr.next = prev, step prev = curr, curr = next. Return prev."
                ]
              },
              {
                id: "linked-list-cycle",
                title: "Linked List Cycle",
                difficulty: "Easy",
                url: "https://leetcode.com/problems/linked-list-cycle/",
                relevance: "Floyd's Tortoise and Hare algorithm: fast and slow pointers meet if a cycle exists.",
                hints: [
                  "Hint 1: What happens if two runners run on a circular track at different speeds?",
                  "Hint 2: Advance slow by 1 step and fast by 2 steps.",
                  "Hint 3: If fast catches slow (slow == fast), there is a cycle.",
                  "Solution: Initialize slow = head, fast = head. While fast != null && fast.next != null: slow = slow.next, fast = fast.next.next; if slow == fast return true. Return false."
                ]
              }
            ],
            summary: "Linked lists trade O(1) random access for instant O(1) structural updates by linking non-contiguous nodes via memory pointers."
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 4: STACKS AND QUEUES
  // ==========================================
  {
    id: "stacks-and-queues",
    slug: "stacks-and-queues",
    title: "Stacks and Queues",
    order: 4,
    tagline: "LIFO vs FIFO orderings, parenthesis parsing, and monotonic tracking.",
    description: "Learn how Last-In-First-Out stacks manage call execution, undo history, and monotonic intervals, while First-In-First-Out queues power task scheduling and breadth-first search.",
    everydayAnalogySummary: "A spring-loaded pile of cafeteria plates (Stack) vs people waiting in line at a movie ticket counter (Queue).",
    lessons: [
      {
        id: "stack-and-queue-principles",
        slug: "stack-and-queue-principles",
        title: "LIFO vs FIFO & Monotonic Stacks",
        summary: "Understand push/pop semantics, bracket matching, and monotonic daily temperature lookups.",
        points: [
          {
            id: "stacks-point-1",
            title: "LIFO Stack Mechanics & Expression Parsing",
            quote: "Think before you peek.",
            everydayAnalogy: {
              title: "The Stack of Cafeteria Plates",
              scenario: "When the dishwasher brings clean plates to the buffet, they place new plates on top of the stack. When hungry diners arrive, they take from the very top plate. The plate placed last is the first one taken (Last-In, First-Out)!"
            },
            theProblem: "When parsing nested structures like ({[]}), an inner closing bracket must match the most recently opened bracket.",
            theIntuition: "Push opening brackets onto a stack. When a closing bracket arrives, pop the top element. If it matches, continue; if it doesn't match or the stack is empty, the string is invalid.",
            formalConcept: "A Stack is a restricted linear container adhering to Last-In, First-Out (LIFO). Supported operations are push(x) in O(1), pop() in O(1), and peek() in O(1).",
            internalWorking: "Stacks can be implemented via dynamic arrays or linked lists. An internal pointer top tracks the index of the uppermost element. In a Monotonic Stack, elements are kept sorted to find the next greater or smaller element in O(n).",
            visualType: "stack-visualizer",
            dryRunSteps: [
              { step: 1, label: "Read '('", value: "Push '(' onto stack -> [ '(' ]" },
              { step: 2, label: "Read '{'", value: "Push '{' onto stack -> [ '(', '{' ]" },
              { step: 3, label: "Read '}'", value: "Pop top '{' -> matches '}'! stack -> [ '(' ]" }
            ],
            pseudocode: `function isValid(s):\n    stack = new Stack()\n    for char in s:\n        if char in '({[':\n            stack.push(char)\n        else:\n            if stack.isEmpty() or not matches(stack.pop(), char):\n                return false\n    return stack.isEmpty()`,
            codeExamples: {
              java: `import java.util.*;\npublic class ValidParentheses {\n    public static boolean isValid(String s) {\n        Deque<Character> stack = new ArrayDeque<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`,
              python: `def is_valid(s: str) -> bool:\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return len(stack) == 0`
            },
            complexity: {
              time: "O(n) linear time — each character is pushed and popped at most once",
              space: "O(n) auxiliary space for the stack in the worst case"
            },
            commonMistakes: [
              { mistake: "Forgetting to check if stack is empty at the end", fix: "If string is '(((', stack will have remaining elements. Return stack.isEmpty()!" },
              { mistake: "Calling pop() on an empty stack", fix: "Always guard pop() with !stack.isEmpty() to prevent EmptyStackException." }
            ],
            whenToUse: {
              useWhen: "Matching paired tokens, undo/redo operations, recursion simulation, or finding next greater/smaller elements.",
              avoidWhen: "You need to access items in arrival order (use Queue instead)."
            },
            practiceProblems: [
              {
                id: "valid-parentheses",
                title: "Valid Parentheses",
                difficulty: "Easy",
                url: "https://leetcode.com/problems/valid-parentheses/",
                relevance: "The definitive problem demonstrating LIFO matching of nested enclosures.",
                hints: [
                  "Hint 1: When you see an open bracket, push the expected close bracket.",
                  "Hint 2: When you see a close bracket, verify it matches the popped character.",
                  "Hint 3: Ensure the stack is completely empty when the loop finishes.",
                  "Solution: Push corresponding closing brackets onto stack. When closing bracket encountered, pop and compare. Check isEmpty() at return."
                ]
              },
              {
                id: "daily-temperatures",
                title: "Daily Temperatures",
                difficulty: "Medium",
                url: "https://leetcode.com/problems/daily-temperatures/",
                relevance: "Teaches Monotonic Decreasing Stacks to solve next greater element in linear O(n) time.",
                hints: [
                  "Hint 1: A brute-force nested loop takes O(n²). How can we store indices of unresolved cooler days?",
                  "Hint 2: Maintain a stack of day indices where temperatures are decreasing.",
                  "Hint 3: When today's temperature is warmer than stack top, pop and resolve wait time: today - top.",
                  "Solution: Stack stores indices. While stack not empty and T[curr] > T[stack.peek()], prev = stack.pop(), ans[prev] = curr - prev. Push curr."
                ]
              }
            ],
            summary: "Stacks enforce LIFO ordering, making them the natural choice for nested hierarchies, undo buffers, and monotonic search."
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 5: TREES AND GRAPHS
  // ==========================================
  {
    id: "trees-and-graphs",
    slug: "trees-and-graphs",
    title: "Trees and Graphs",
    order: 5,
    tagline: "Hierarchical branching, network topologies, DFS depth, and BFS breadth.",
    description: "Explore recursive tree traversals (pre/in/post/level order), binary search tree invariants, and graph explorations across visited sets.",
    everydayAnalogySummary: "A company's organizational reporting hierarchy (Tree) or a city metro transit map with interconnected transfer stations (Graph).",
    lessons: [
      {
        id: "binary-tree-traversals",
        slug: "binary-tree-traversals",
        title: "Tree Hierarchies & Traversals",
        summary: "Understand root, branches, leaves, and Depth-First Search vs Breadth-First Search.",
        points: [
          {
            id: "trees-point-1",
            title: "Hierarchies, Recursion & Tree Traversals",
            quote: "One concept, many applications.",
            everydayAnalogy: {
              title: "The Company Reporting Structure",
              scenario: "At a company, the CEO is at the top (Root). Under the CEO are Vice Presidents (Children). Under each VP are Directors and Managers, down to individual engineers (Leaves). Nobody reports in a loop, and everyone has exactly one direct manager. This is a Tree!"
            },
            theProblem: "How do we model relationships where items have parent-child hierarchies rather than a simple flat sequence?",
            theIntuition: "A tree is just nodes with multiple pointers instead of just one next pointer. In a Binary Tree, each node points to at most two children: left and right.",
            formalConcept: "A Tree is a connected, undirected acyclic graph with N nodes and N-1 edges. In a Binary Search Tree (BST), for every node, all keys in the left subtree are smaller, and all keys in the right subtree are larger.",
            internalWorking: "DFS explores deeply down a branch using the call stack (Pre-order: Root-L-R, In-order: L-Root-R, Post-order: L-R-Root). BFS explores level-by-level using a FIFO Queue.",
            visualType: "tree-visualizer",
            dryRunSteps: [
              { step: 1, label: "Root Visit", value: "Visit Node(4)" },
              { step: 2, label: "Traverse Left", value: "Visit Node(2) -> then Node(1), Node(3)" },
              { step: 3, label: "Traverse Right", value: "Visit Node(7) -> then Node(6), Node(9)" }
            ],
            pseudocode: `function maxDepth(root):\n    if root == null:\n        return 0\n    leftDepth = maxDepth(root.left)\n    rightDepth = maxDepth(root.right)\n    return 1 + max(leftDepth, rightDepth)`,
            codeExamples: {
              java: `class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) { this.val = val; }\n}\npublic class TreeDepth {\n    public static int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n}`,
              python: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef max_depth(root: TreeNode) -> int:\n    if not root:\n        return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))`
            },
            complexity: {
              time: "O(n) time — every node is visited exactly once",
              space: "O(h) auxiliary recursion stack space, where h is the tree height (O(log n) balanced, O(n) skewed)"
            },
            commonMistakes: [
              { mistake: "Forgetting the base case", fix: "Always begin tree recursion with if (root == null) return ... to terminate leaf exploration." },
              { mistake: "Assuming BST invariant applies only to immediate children", fix: "In a BST, ALL nodes in left subtree must be smaller, not just the immediate left child!" }
            ],
            whenToUse: {
              useWhen: "Organizing hierarchical data, fast searching via BST O(log n), or evaluating algebraic syntax trees.",
              avoidWhen: "Your data has cycles or cross-connections (use General Graphs instead)."
            },
            practiceProblems: [
              {
                id: "max-depth-tree",
                title: "Maximum Depth of Binary Tree",
                difficulty: "Easy",
                url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
                relevance: "Fundamental recursive tree problem calculating subtree height.",
                hints: [
                  "Hint 1: If root is null, what is the depth? Zero.",
                  "Hint 2: Find the depth of left subtree and right subtree recursively.",
                  "Hint 3: Combine: 1 + max(left, right).",
                  "Solution: Base case root == null returns 0. Return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))."
                ]
              },
              {
                id: "number-of-islands",
                title: "Number of Islands",
                difficulty: "Medium",
                url: "https://leetcode.com/problems/number-of-islands/",
                relevance: "Standard grid graph traversal using DFS/BFS and visited marking.",
                hints: [
                  "Hint 1: Treat the 2D grid as a graph where land cells ('1') have up/down/left/right edges.",
                  "Hint 2: When you find a '1', increment island counter and launch DFS/BFS to sink or mark all connected '1's.",
                  "Hint 3: Marking visited cells as '0' prevents infinite looping.",
                  "Solution: Double loop over grid. If cell is '1', islands++, sink(r, c) which marks cell '0' and recurses on 4 neighbors."
                ]
              }
            ],
            summary: "Trees model hierarchical relationships without cycles, while graphs generalize connections using adjacency lists, DFS, and BFS."
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 6: HEAP
  // ==========================================
  {
    id: "heap",
    slug: "heap",
    title: "Heap / Priority Queue",
    order: 6,
    tagline: "Dynamic extrema tracking, PriorityQueue, and Top-K elements.",
    description: "Discover why sorting an entire collection is unnecessary when you only care about the highest or lowest priority item in O(log n) time.",
    everydayAnalogySummary: "A hospital emergency room triage doctor examining patients in order of medical urgency, not arrival time.",
    lessons: [
      {
        id: "min-and-max-heaps",
        slug: "min-and-max-heaps",
        title: "Min-Heap, Max-Heap & PriorityQueue",
        summary: "Understand parent-child array storage, bubble-up/sift-down, and Top K patterns.",
        points: [
          {
            id: "heap-point-1",
            title: "Why Sorting Everything is Wasteful",
            quote: "Depth beats memorization.",
            everydayAnalogy: {
              title: "The Hospital Emergency Room",
              scenario: "If 100 people enter an emergency room, the nurse does not spend 2 hours ranking all 100 patients by alphabetical order or age. They keep track of whoever has the highest urgency right now. When that patient enters treatment, the next most critical patient is identified immediately."
            },
            theProblem: "If you have 10,000,000 numbers and need the top 5 largest, sorting the entire list takes O(n log n) = ~230,000,000 operations.",
            theIntuition: "Maintain a small Min-Heap of size 5. For each number, if it's larger than the heap's smallest item, replace the smallest item. You only do O(n log k) work!",
            formalConcept: "A Binary Heap is a complete binary tree stored in an array where each parent satisfies the heap property: parent <= children (Min-Heap) or parent >= children (Max-Heap). Peek is O(1); insert and extract are O(log n).",
            internalWorking: "In an array representation: Left child of index i is at 2i + 1, Right child is at 2i + 2, and Parent is at (i - 1) / 2. Insert appends at the end and bubbles up; removal swaps root with the last element and sifts down.",
            visualType: "heap-visualizer",
            dryRunSteps: [
              { step: 1, label: "Heap State", value: "Min-Heap of size 3: [4, 7, 5]" },
              { step: 2, label: "Incoming '8'", value: "8 > min (4) -> remove 4, insert 8" },
              { step: 3, label: "Sift Down", value: "New root 8 sifts down -> heap becomes [5, 7, 8]" }
            ],
            pseudocode: `pq = new PriorityQueue() // Min-heap\nfor num in nums:\n    pq.offer(num)\n    if pq.size() > k:\n        pq.poll() // drop smallest\nreturn pq.peek() // kth largest element`,
            codeExamples: {
              java: `import java.util.PriorityQueue;\npublic class KthLargest {\n    public static int findKthLargest(int[] nums, int k) {\n        PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n        for (int n : nums) {\n            minHeap.offer(n);\n            if (minHeap.size() > k) minHeap.poll();\n        }\n        return minHeap.peek();\n    }\n}`,
              python: `import heapq\ndef find_kth_largest(nums: list[int], k: int) -> int:\n    min_heap = []\n    for n in nums:\n        heapq.heappush(min_heap, n)\n        if len(min_heap) > k:\n            heapq.heappop(min_heap)\n    return min_heap[0]`
            },
            complexity: {
              time: "Peek: O(1), Insertion: O(log k), Poll: O(log k). Total for Top K: O(n log k)",
              space: "O(k) auxiliary memory to hold k elements in the priority queue"
            },
            commonMistakes: [
              { mistake: "Using a Max-Heap for Kth largest", fix: "A Max-Heap requires storing all N elements O(n log n). A Min-Heap of size K retains only the K largest, letting the smallest of the top K sit at the root in O(n log k)!" }
            ],
            whenToUse: {
              useWhen: "Tracking running medians, Top K frequent elements, continuous priority scheduling, or Dijkstra's shortest path.",
              avoidWhen: "You need to search for an arbitrary element (Heaps do not support fast O(1) or O(log n) arbitrary search)."
            },
            practiceProblems: [
              {
                id: "kth-largest",
                title: "Kth Largest Element in an Array",
                difficulty: "Medium",
                url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
                relevance: "Canonical demonstration of Min-Heap bounded to size K.",
                hints: [
                  "Hint 1: Sorting takes O(n log n). Can we do better with space O(k)?",
                  "Hint 2: Keep a Min-Heap of size k.",
                  "Hint 3: Pop whenever size exceeds k. The root is the kth largest.",
                  "Solution: Offer each element into minHeap. If size > k, poll. Return minHeap.peek()."
                ]
              }
            ],
            summary: "Heaps maintain partial order efficiently, delivering instant O(1) extrema access and logarithmic O(log n) updates without full sorting."
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 7: GREEDY ALGORITHMS
  // ==========================================
  {
    id: "greedy-algorithms",
    slug: "greedy-algorithms",
    title: "Greedy Algorithms",
    order: 7,
    tagline: "Local optimal choices, interval scheduling, and exchange arguments.",
    description: "Learn when making the locally best choice at each step guarantees a globally optimal solution without backtracking.",
    everydayAnalogySummary: "Booking non-overlapping conference room reservations by always picking the meeting that ends earliest.",
    lessons: [
      {
        id: "greedy-choice-property",
        slug: "greedy-choice-property",
        title: "The Greedy Choice Property",
        summary: "Understand when local decisions lead to global optimality and when they fail.",
        points: [
          {
            id: "greedy-point-1",
            title: "Local Optimum vs Global Optimum",
            quote: "Small steps, strong foundations.",
            everydayAnalogy: {
              title: "Scheduling the Most Meetings",
              scenario: "If you have one conference room and 10 clubs asking to use it today, how do you fit the maximum number of meetings? You should always pick the meeting that finishes earliest! That leaves as much free room time as possible for subsequent meetings."
            },
            theProblem: "Exploring all combinations of choices takes exponential O(2^n) time.",
            theIntuition: "In specific problem structures, making the best local choice right now never locks you out of the best global outcome. Sort first, then greedily commit.",
            formalConcept: "A Greedy Algorithm makes the locally optimal choice at each stage with the hope of finding a global optimum. It succeeds when the problem exhibits the Greedy Choice Property and Optimal Substructure.",
            internalWorking: "Greedy algorithms do not backtrack. Once a decision is made, it is permanent. To verify correctness, we use an Exchange Argument: prove that swapping the greedy choice with any hypothetical optimal choice produces an equally good or better outcome.",
            visualType: "interval-visualizer",
            dryRunSteps: [
              { step: 1, label: "Sort Intervals", value: "Sort by end time: [1,2], [2,3], [1,3]" },
              { step: 2, label: "Pick First", value: "Pick [1,2], lastEnd = 2" },
              { step: 3, label: "Evaluate Next", value: "[2,3] start >= lastEnd -> take it! Count = 2" }
            ],
            pseudocode: `sort(intervals, by: end_time)\ncount = 1\nlastEnd = intervals[0].end\nfor i from 1 to intervals.length - 1:\n    if intervals[i].start >= lastEnd:\n        count++\n        lastEnd = intervals[i].end\nreturn count`,
            codeExamples: {
              java: `import java.util.Arrays;\npublic class IntervalScheduling {\n    public static int eraseOverlapIntervals(int[][] intervals) {\n        if (intervals.length == 0) return 0;\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));\n        int count = 0, lastEnd = intervals[0][1];\n        for (int i = 1; i < intervals.length; i++) {\n            if (intervals[i][0] < lastEnd) count++; // overlap -> remove\n            else lastEnd = intervals[i][1];\n        }\n        return count;\n    }\n}`,
              python: `def erase_overlap_intervals(intervals: list[list[int]]) -> int:\n    if not intervals:\n        return 0\n    intervals.sort(key=lambda x: x[1])\n    count = 0\n    last_end = intervals[0][1]\n    for i in range(1, len(intervals)):\n        if intervals[i][0] < last_end:\n            count += 1\n        else:\n            last_end = intervals[i][1]\n    return count`
            },
            complexity: {
              time: "O(n log n) dominated by the initial sorting step; O(n) for the subsequent greedy scan",
              space: "O(1) auxiliary space (or O(n) depending on sort implementation)"
            },
            commonMistakes: [
              { mistake: "Applying greedy where DP is needed", fix: "Greedy fails on the 0/1 Knapsack problem because picking the highest value-per-weight item can leave wasted capacity. Verify with an exchange argument." }
            ],
            whenToUse: {
              useWhen: "Interval scheduling, jump game reachability, coin change with canonical denominations, or minimum spanning trees.",
              avoidWhen: "Making a local choice restricts future options in unpredictable ways (use Dynamic Programming)."
            },
            practiceProblems: [
              {
                id: "jump-game",
                title: "Jump Game",
                difficulty: "Medium",
                url: "https://leetcode.com/problems/jump-game/",
                relevance: "Classic greedy reachability tracking the furthest index reachable.",
                hints: [
                  "Hint 1: Can you track the maximum index reachable from any position seen so far?",
                  "Hint 2: If the current index exceeds maxReach, you can never reach it.",
                  "Hint 3: maxReach = max(maxReach, i + nums[i]).",
                  "Solution: maxReach = 0. For each i in 0..n-1: if i > maxReach return false; maxReach = max(maxReach, i + nums[i]). Return true."
                ]
              }
            ],
            summary: "Greedy makes irrevocable local choices that lead to global solutions when problems exhibit the greedy choice property."
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 8: BINARY SEARCH
  // ==========================================
  {
    id: "binary-search",
    slug: "binary-search",
    title: "Binary Search",
    order: 8,
    tagline: "Range halving, monotonic decision predicates, and O(log n) efficiency.",
    description: "Master dividing search spaces in half, preventing integer overflow, and applying binary search on monotonic answer spaces.",
    everydayAnalogySummary: "Looking up a word in a printed dictionary or playing the higher/lower number guessing game.",
    lessons: [
      {
        id: "binary-search-foundations",
        slug: "binary-search-foundations",
        title: "Search Spaces & Loop Invariants",
        summary: "Understand midpoint calculation, boundary shifts, and binary search on the answer.",
        points: [
          {
            id: "binary-search-point-1",
            title: "Halving the Search Space in O(log n)",
            quote: "Think slowly, improve daily.",
            everydayAnalogy: {
              title: "The Number Guessing Game (1 to 100)",
              scenario: "If a friend picks a secret number between 1 and 100 and tells you 'Higher' or 'Lower', you don't guess 1, 2, 3... That takes up to 100 guesses! You guess 50. If they say 'Higher', you just eliminated 50 numbers in a single second! Next you guess 75. In at most 7 guesses, you find the exact number."
            },
            theProblem: "Searching through 1,000,000,000 items sequentially takes 1,000,000,000 checks.",
            theIntuition: "If data is ordered or a condition is monotonic (False, False, ..., True, True), checking the midpoint immediately discards half of the entire remaining candidate range.",
            formalConcept: "Binary Search operates on a sorted search space by repeatedly comparing the target to the midpoint. If target < mid, search left half; if target > mid, search right half. The search space shrinks from N -> N/2 -> N/4 -> ... -> 1 in log2(N) steps.",
            internalWorking: "To calculate the midpoint without 32-bit integer overflow, use mid = left + (right - left) / 2 instead of (left + right) / 2. Maintain clear loop invariants (e.g. while (left <= right)).",
            visualType: "binary-search-visualizer",
            dryRunSteps: [
              { step: 1, label: "Initial Range", value: "left = 0, right = 6 on [2, 5, 8, 12, 16, 23, 38], target = 23" },
              { step: 2, label: "Mid = 3", value: "arr[3] = 12 < 23 -> target must be right! left = mid + 1 = 4" },
              { step: 3, label: "Mid = 5", value: "arr[5] = 23 == target -> Found at index 5 in 2 comparisons!" }
            ],
            pseudocode: `function binarySearch(arr, target):\n    left = 0, right = arr.length - 1\n    while left <= right:\n        mid = left + (right - left) / 2\n        if arr[mid] == target: return mid\n        else if arr[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1`,
            codeExamples: {
              java: `public class BinarySearch {\n    public static int search(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            else if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n}`,
              python: `def search(nums: list[int], target: int) -> int:\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`
            },
            complexity: {
              time: "O(log n) logarithmic time — halving the remaining search space every iteration",
              space: "O(1) auxiliary space for iterative binary search"
            },
            commonMistakes: [
              { mistake: "Integer overflow on midpoint", fix: "Never write (left + right) / 2 in Java/C++. Always write left + (right - left) / 2." },
              { mistake: "Infinite loop on left < right vs left <= right", fix: "If using left <= right, update left = mid + 1 and right = mid - 1 to guarantee progress." }
            ],
            whenToUse: {
              useWhen: "Array is sorted, or whenever problem asks for min/max value satisfying a monotonic predicate ('Binary Search on Answer').",
              avoidWhen: "Array is unsorted and cannot be sorted without exceeding runtime constraints."
            },
            practiceProblems: [
              {
                id: "binary-search-problem",
                title: "Binary Search",
                difficulty: "Easy",
                url: "https://leetcode.com/problems/binary-search/",
                relevance: "Standard baseline implementation of the halving search space pattern.",
                hints: [
                  "Hint 1: Initialize left = 0 and right = n - 1.",
                  "Hint 2: While left <= right, check midpoint.",
                  "Hint 3: Shift left = mid + 1 or right = mid - 1.",
                  "Solution: Standard while left <= right loop with midpoint check."
                ]
              },
              {
                id: "koko-eating-bananas",
                title: "Koko Eating Bananas",
                difficulty: "Medium",
                url: "https://leetcode.com/problems/koko-eating-bananas/",
                relevance: "Binary Search on Answer space: speed k ranges from 1 to max(piles).",
                hints: [
                  "Hint 1: Can you write a helper function canFinish(speed) that returns true/false?",
                  "Hint 2: Notice that if speed S works, any speed > S also works (Monotonic predicate!).",
                  "Hint 3: Binary search the speed k between 1 and max(piles).",
                  "Solution: left = 1, right = max(piles). While left < right: mid = (left+right)/2; if canFinish(mid) right = mid; else left = mid + 1. Return left."
                ]
              }
            ],
            summary: "Binary search eliminates half the candidate space per step, solving problems in lightning-fast O(log n) time."
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 9: BACKTRACKING
  // ==========================================
  {
    id: "backtracking",
    slug: "backtracking",
    title: "Backtracking",
    order: 9,
    tagline: "State exploration, recursion trees, choices, and undoing actions.",
    description: "Learn how to systematically explore combination trees, prune invalid paths, and backtrack by undoing state changes.",
    everydayAnalogySummary: "Navigating a hedge maze where you drop breadcrumbs, and walk backward when you hit a dead end.",
    lessons: [
      {
        id: "backtracking-fundamentals",
        slug: "backtracking-fundamentals",
        title: "Choose, Explore, Unchoose",
        summary: "Understand recursion trees, base conditions, pruning, and state cleanup.",
        points: [
          {
            id: "backtracking-point-1",
            title: "The 3 Steps: Choose, Explore, Unchoose",
            quote: "Trace before guessing.",
            everydayAnalogy: {
              title: "Exploring a Corn Maze",
              scenario: "You enter a corn maze. When you reach a fork, you make a Choice (take the left path). You Explore forward. If you hit a dead end, you don't give up and quit! You walk backward to the fork (Undo the choice) and try the right path instead."
            },
            theProblem: "Generating all subsets, permutations, or valid board configurations requires testing many candidate paths.",
            theIntuition: "Use recursion to explore decisions. If a candidate path cannot lead to a valid answer, prune it immediately, undo the last choice, and try the next branch.",
            formalConcept: "Backtracking is an algorithmic paradigm that builds candidate solutions incrementally and abandons ('backtracks') a candidate as soon as it determines the candidate cannot be completed to a valid solution.",
            internalWorking: "Every recursive call represents a node in a decision tree. The state is modified before recursing (Choose), the recursive function is called (Explore), and the state is restored immediately after returning (Unchoose: list.remove(list.size() - 1)).",
            visualType: "backtracking-visualizer",
            dryRunSteps: [
              { step: 1, label: "Choose '1'", value: "path: [1], recurse with remaining [2,3]" },
              { step: 2, label: "Choose '2'", value: "path: [1,2], recurse with remaining [3]" },
              { step: 3, label: "Unchoose '2'", value: "Backtrack! Remove 2 from path -> path: [1]" }
            ],
            pseudocode: `function backtrack(start, currentPath):\n    result.add(copy(currentPath))\n    for i from start to nums.length - 1:\n        currentPath.add(nums[i])      // 1. Choose\n        backtrack(i + 1, currentPath) // 2. Explore\n        currentPath.removeLast()     // 3. Unchoose (Backtrack)`,
            codeExamples: {
              java: `import java.util.*;\npublic class Subsets {\n    public static List<List<Integer>> subsets(int[] nums) {\n        List<List<Integer>> res = new ArrayList<>();\n        backtrack(0, nums, new ArrayList<>(), res);\n        return res;\n    }\n    private static void backtrack(int start, int[] nums, List<Integer> path, List<List<Integer>> res) {\n        res.add(new ArrayList<>(path));\n        for (int i = start; i < nums.length; i++) {\n            path.add(nums[i]);            // Choose\n            backtrack(i + 1, nums, path, res); // Explore\n            path.remove(path.size() - 1); // Unchoose\n        }\n    }\n}`,
              python: `def subsets(nums: list[int]) -> list[list[int]]:\n    res = []\n    def backtrack(start, path):\n        res.append(list(path))\n        for i in range(start, len(nums)):\n            path.append(nums[i])          # Choose\n            backtrack(i + 1, path)        # Explore\n            path.pop()                    # Unchoose\n    backtrack(0, [])\n    return res`
            },
            complexity: {
              time: "O(2^n) for subsets, O(n!) for permutations — exponential due to total combinatorial states",
              space: "O(n) auxiliary recursion call stack and current path storage"
            },
            commonMistakes: [
              { mistake: "Adding path directly instead of a copy", fix: "Always add new ArrayList<>(path) or list(path); otherwise, future mutations modify already-saved results!" },
              { mistake: "Forgetting to undo the choice", fix: "Every path.add() must be paired with path.removeLast() after the recursive call." }
            ],
            whenToUse: {
              useWhen: "Generating all subsets, combinations, permutations, solving Sudoku, N-Queens, or word search grids.",
              avoidWhen: "Problem only asks for the count of optimal ways without needing the actual paths (use Dynamic Programming)."
            },
            practiceProblems: [
              {
                id: "subsets",
                title: "Subsets",
                difficulty: "Medium",
                url: "https://leetcode.com/problems/subsets/",
                relevance: "The cleanest template for the choose-explore-unchoose backtracking pattern.",
                hints: [
                  "Hint 1: At each step, add the current path to the result list.",
                  "Hint 2: Loop from start index to nums.length - 1.",
                  "Hint 3: Choose, backtrack with i + 1, and unchoose.",
                  "Solution: Follow standard backtracking template with path copy added at top of each call."
                ]
              }
            ],
            summary: "Backtracking methodically explores all valid branches of a combinatorial tree by choosing, recursing, and undoing choices."
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 10: DYNAMIC PROGRAMMING
  // ==========================================
  {
    id: "dynamic-programming",
    slug: "dynamic-programming",
    title: "Dynamic Programming",
    order: 10,
    tagline: "Overlapping subproblems, state transitions, memoization, and tabulation.",
    description: "Understand how storing solutions to subproblems turns exponential O(2^n) recursion into polynomial O(n) memoization.",
    everydayAnalogySummary: "Writing '1 + 1 + 1 + 1 = 4' on paper, then writing '+ 1' next to it: you don't recount from scratch, you remember '4' and say '5'!",
    lessons: [
      {
        id: "dp-fundamentals",
        slug: "dp-fundamentals",
        title: "Memoization & Tabulation",
        summary: "Identify overlapping subproblems, define state, and build transitions.",
        points: [
          {
            id: "dp-point-1",
            title: "Remembering Past Work Instead of Recomputing",
            quote: "Don't copy, understand.",
            everydayAnalogy: {
              title: "The Math on the Chalkboard",
              scenario: "A teacher writes '1 + 1 + 1 + 1 + 1' on the board and asks what it equals. A student counts: '5!'. Then the teacher adds '+ 1' at the end. Does the student recount all six ones from the beginning? No! They remember the previous total was 5, add 1, and answer '6'."
            },
            theProblem: "Calculating Fibonacci recursively computes fib(3) dozens of times independently, exploding into exponential O(2^n) complexity.",
            theIntuition: "Store the result of every subproblem the first time you compute it (in an array or hash map). When you need it again, look it up in O(1) time.",
            formalConcept: "Dynamic Programming solves optimization problems by combining solutions to subproblems. It requires two properties: 1. Overlapping Subproblems (same sub-calculations needed repeatedly) and 2. Optimal Substructure (optimal solution formed from optimal sub-solutions).",
            internalWorking: "Top-Down DP uses recursion with a cache (Memoization). Bottom-Up DP starts at base cases and fills an iterative table (Tabulation). Often space can be optimized from O(n) to O(1) by keeping only the last two values.",
            visualType: "dp-visualizer",
            dryRunSteps: [
              { step: 1, label: "Base Cases", value: "dp[0] = 1, dp[1] = 1" },
              { step: 2, label: "Step 2", value: "dp[2] = dp[1] + dp[0] = 1 + 1 = 2" },
              { step: 3, label: "Step 3", value: "dp[3] = dp[2] + dp[1] = 2 + 1 = 3" }
            ],
            pseudocode: `// Bottom-up Tabulation\nfunction climbStairs(n):\n    if n <= 1: return 1\n    prev2 = 1, prev1 = 1\n    for i from 2 to n:\n        curr = prev1 + prev2\n        prev2 = prev1\n        prev1 = curr\n    return prev1`,
            codeExamples: {
              java: `public class ClimbingStairs {\n    public static int climbStairs(int n) {\n        if (n <= 2) return n;\n        int prev2 = 1, prev1 = 2;\n        for (int i = 3; i <= n; i++) {\n            int curr = prev1 + prev2;\n            prev2 = prev1;\n            prev1 = curr;\n        }\n        return prev1;\n    }\n}`,
              python: `def climb_stairs(n: int) -> int:\n    if n <= 2:\n        return n\n    prev2, prev1 = 1, 2\n    for _ in range(3, n + 1):\n        curr = prev1 + prev2\n        prev2, prev1 = prev1, curr\n    return prev1`
            },
            complexity: {
              time: "O(n) linear time — each state is calculated exactly once",
              space: "O(1) space with variable rolling optimization (or O(n) with full dp array)"
            },
            commonMistakes: [
              { mistake: "Trying to code before defining state", fix: "Always write in plain English what dp[i] represents before writing any loop or formula." },
              { mistake: "Incorrect base case", fix: "Verify dp[0] and dp[1] manually with tiny inputs (n=0, n=1)." }
            ],
            whenToUse: {
              useWhen: "Problems asking for min/max cost, number of distinct ways, or boolean possibility where subproblems repeat.",
              avoidWhen: "Subproblems do not overlap (e.g. Merge Sort divides into completely independent sub-arrays)."
            },
            practiceProblems: [
              {
                id: "climbing-stairs",
                title: "Climbing Stairs",
                difficulty: "Easy",
                url: "https://leetcode.com/problems/climbing-stairs/",
                relevance: "The 'Hello World' of dynamic programming showcasing the Fibonacci state transition.",
                hints: [
                  "Hint 1: To reach step i, you can only come from step i-1 or step i-2.",
                  "Hint 2: Therefore, ways(i) = ways(i-1) + ways(i-2).",
                  "Hint 3: Use two variables to store previous two steps in O(1) space.",
                  "Solution: Loop from 3 to n, updating prev2 and prev1. Return prev1."
                ]
              },
              {
                id: "coin-change",
                title: "Coin Change",
                difficulty: "Medium",
                url: "https://leetcode.com/problems/coin-change/",
                relevance: "Classic unbounded knapsack pattern minimizing coin count.",
                hints: [
                  "Hint 1: Let dp[amount] be the minimum coins needed to make that amount.",
                  "Hint 2: For each coin c, dp[i] = min(dp[i], 1 + dp[i - c]).",
                  "Hint 3: Initialize dp array with amount + 1 (infinity sentinel).",
                  "Solution: dp[0]=0, others=amount+1. For i in 1..amount: for c in coins: if i-c>=0 dp[i]=min(dp[i], 1+dp[i-c]). Return dp[amount] if <= amount else -1."
                ]
              }
            ],
            summary: "Dynamic Programming stores answers to subproblems, transforming exponential recursion into polynomial efficiency."
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 11: INTERVIEWS
  // ==========================================
  {
    id: "interviews",
    slug: "interviews",
    title: "Interview Problem-Solving Framework",
    order: 11,
    tagline: "Structured thinking, communication, trade-off analysis, and dry-run checklists.",
    description: "Learn how senior engineers tackle ambiguous coding interview questions by systematically decomposing constraints, communicating logic, and managing hints.",
    everydayAnalogySummary: "An architect presenting blueprints to a client: clarify requirements first, sketch the foundation, verify with scale models, and only then lay the brickwork.",
    lessons: [
      {
        id: "interview-process",
        slug: "interview-process",
        title: "The 7-Step Interview Framework",
        summary: "A repeatable process from problem comprehension to dry-running edge cases.",
        points: [
          {
            id: "interviews-point-1",
            title: "The 7-Step Problem-Solving Checklist",
            quote: "Earn your solutions.",
            everydayAnalogy: {
              title: "The Medical Examination",
              scenario: "A surgeon does not walk into an operating room and immediately start cutting. They interview the patient, check vitals, review X-rays, explain the surgical plan, and ensure the right equipment is sterilized before making the first incision!"
            },
            theProblem: "Many candidates start typing code within 30 seconds of reading a problem, only to realize 20 minutes later that they misunderstood the constraints.",
            theIntuition: "Treat the interview as a collaborative design session. Spend the first 8-10 minutes understanding, clarifying, and agreeing on an algorithm before writing a single line of code.",
            formalConcept: "The structured interview lifecycle comprises: 1. Clarification & Constraints, 2. Concrete Examples, 3. Brute Force Baseline, 4. Bottleneck Optimization, 5. Verbal Walkthrough, 6. Clean Implementation, 7. Edge-Case Dry Run.",
            internalWorking: "Interviewers grade communication, problem decomposition, correctness, code quality, and testing ability. Talking through your thoughts out loud turns silence into positive signal.",
            visualType: "interview-checklist",
            dryRunSteps: [
              { step: 1, label: "Clarify", value: "Ask: Can array be negative? Empty? Are duplicates allowed?" },
              { step: 2, label: "Propose", value: "State brute force O(n²), then suggest HashMap O(n)" },
              { step: 3, label: "Test", value: "Walk through null, single element, and duplicate values manually" }
            ],
            pseudocode: `// 7-Step Checklist:\n1. Restate problem in your own words\n2. Ask constraint questions (N size, data types)\n3. Walk through 2 examples (including an edge case)\n4. State brute force complexity\n5. Propose optimal DS & algorithm\n6. Code with clean naming\n7. Dry-run line-by-line with sample input`,
            codeExamples: {
              java: `// Example Clean Interview Code Structure\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // 1. Guard against invalid inputs\n        if (nums == null || nums.length < 2) return new int[0];\n        \n        // 2. HashMap for O(n) complement lookup\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (seen.containsKey(complement)) {\n                return new int[]{ seen.get(complement), i };\n            }\n            seen.put(nums[i], i);\n        }\n        return new int[0]; // No pair found\n    }\n}`,
              python: `# Clean Interview Code Structure\ndef two_sum(nums: list[int], target: int) -> list[int]:\n    if not nums or len(nums) < 2:\n        return []\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return [seen[comp], i]\n        seen[num] = i\n    return []`
            },
            complexity: {
              time: "Target: optimal time matching input constraints (e.g. N <= 10^5 requires O(n) or O(n log n))",
              space: "State trade-offs explicitly (e.g. O(n) auxiliary memory to buy O(1) lookup speed)"
            },
            commonMistakes: [
              { mistake: "Jumping into code without speaking", fix: "Narrate your thought process. Say: 'First, I'm thinking of a brute force approach...'" },
              { mistake: "Ignoring interviewer hints", fix: "When an interviewer asks 'What if the array was sorted?', pause and recognize they are offering a huge hint!" }
            ],
            whenToUse: {
              useWhen: "Every technical coding interview, phone screen, or peer code review.",
              avoidWhen: "Never abandon this framework — structure reduces panic under pressure."
            },
            practiceProblems: [
              {
                id: "interview-practice",
                title: "Two Sum (Interview Protocol)",
                difficulty: "Easy",
                url: "https://leetcode.com/problems/two-sum/",
                relevance: "Practice speaking the 7 steps out loud before typing the code.",
                hints: [
                  "Hint 1: State the brute force O(n²) solution first.",
                  "Hint 2: Explain why repeated linear search is the bottleneck.",
                  "Hint 3: Propose a HashMap to achieve O(n) time with O(n) space trade-off.",
                  "Solution: Implement clean code with edge-case checks."
                ]
              }
            ],
            summary: "Success in technical interviews is driven by structured communication, deliberate constraint analysis, and methodical dry runs."
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 12: TOOLS
  // ==========================================
  {
    id: "tools",
    slug: "tools",
    title: "Tools, Debugging & Dry-Run Techniques",
    order: 12,
    tagline: "Constraint analysis, manual trace tables, breakpoints, and mistake logging.",
    description: "Learn the practical engineering habits that turn random guessing into systematic debugging, including constraint-to-complexity mapping and trace tables.",
    everydayAnalogySummary: "A pilot using pre-flight checklists and flight data recorders (Mistake Log) to ensure safety and prevent repeat errors.",
    lessons: [
      {
        id: "debugging-and-trace-tables",
        slug: "debugging-and-trace-tables",
        title: "Constraint Analysis & Trace Tables",
        summary: "Map N to expected complexity, construct dry-run trace tables, and log root causes.",
        points: [
          {
            id: "tools-point-1",
            title: "Constraint-to-Complexity Cheat Sheet & Trace Tables",
            quote: "Debug your thinking first.",
            everydayAnalogy: {
              title: "The Construction Blueprint Scale",
              scenario: "Before an engineer builds a bridge, they inspect the load limit. If a bridge must hold 50-ton freight trains, they don't guess: the load constraint dictates whether they use wood, concrete, or reinforced steel. Constraints dictate your design before you start!"
            },
            theProblem: "How do you know what algorithm an interviewer expects before writing code?",
            theIntuition: "The input size N tells you the required time complexity! Computers perform roughly 10^8 operations per second. If N = 10^5, an O(n²) algorithm will trigger Time Limit Exceeded (10^10 operations). You MUST use O(n) or O(n log n)!",
            formalConcept: "Constraint analysis maps input bounds to acceptable asymptotic algorithms. Trace Tables track variable values step-by-step on paper to locate logical errors before running code.",
            internalWorking: "Constraints guide selection: N <= 20 -> O(2^n) Backtracking; N <= 10^4 -> O(n^2) nested loops; N <= 10^5 -> O(n log n) sorting/heaps; N <= 10^9 -> O(log n) binary search or O(1) math.",
            visualType: "tools-visualizer",
            dryRunSteps: [
              { step: 1, label: "Check N", value: "N = 10^5 -> O(n²) will fail with TLE! Need O(n log n)" },
              { step: 2, label: "Trace Table", value: "Columns: i, num, target-num, map.containsKey" },
              { step: 3, label: "Log Mistake", value: "Record in Daily DSA Mistake Log under 'Time Complexity'!" }
            ],
            pseudocode: `// Constraint Rules:\n// N <= 10^2  -> O(n^3) or O(n^4)\n// N <= 10^3  -> O(n^2)\n// N <= 10^5  -> O(n log n) or O(n)\n// N <= 10^8  -> O(n)\n// N > 10^8   -> O(log n) or O(1)`,
            codeExamples: {
              java: `// Systematic Dry-Run Trace Table\n// Input: [2, 7, 11], target = 9\n// Step | i | nums[i] | complement | map state        | action\n// 1    | 0 | 2       | 7          | {}               | put(2, 0)\n// 2    | 1 | 7       | 2          | {2=0}            | FOUND! return [0, 1]`,
              python: `# Constraint Mapping Table\n# N <= 10**5 -> requires O(n log n) or O(n)\n# N <= 20    -> backtracking O(2**n) or O(n!) permitted`
            },
            complexity: {
              time: "Constraint analysis takes O(1) time and prevents writing failing solutions",
              space: "Mistake logging creates compounding cognitive savings over time"
            },
            commonMistakes: [
              { mistake: "Randomly changing operators when code fails", fix: "Stop guessing! Construct a 3-row trace table with a tiny 3-element test case and observe the exact variable divergence." }
            ],
            whenToUse: {
              useWhen: "Reading any new problem statement, debugging tricky test cases, or reviewing past errors in your Daily DSA Mistake Log.",
              avoidWhen: "Never bypass constraint analysis."
            },
            practiceProblems: [
              {
                id: "tools-practice",
                title: "Review Your Daily DSA Mistake Log",
                difficulty: "Practice Habit",
                url: "/mistakes",
                relevance: "Connect your learning directly to your real recorded blind spots.",
                hints: [
                  "Hint 1: Check your most frequent recurring failure category.",
                  "Hint 2: Review your Next-Time Strategies.",
                  "Hint 3: Re-attempt one pending mistake from your Review Queue.",
                  "Solution: Open the Review Queue and mark a problem as mastered."
                ]
              }
            ],
            summary: "Constraint analysis eliminates dead-end approaches immediately, while trace tables and mistake logs build enduring mastery."
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 13: BONUS
  // ==========================================
  {
    id: "bonus",
    slug: "bonus",
    title: "Bonus Patterns & Advanced DSA",
    order: 13,
    tagline: "Bit tricks, Trie prefix trees, Disjoint Set Union (DSU), and Topological Sort.",
    description: "Explore advanced architectural patterns that connect topics together, including bitwise XOR properties, Trie retrieval trees, and Union-Find disjoint sets.",
    everydayAnalogySummary: "A master mechanic's specialized toolkit: you don't use a torque wrench every day, but for the right engine part, nothing else will do.",
    lessons: [
      {
        id: "bit-manipulation-and-tries",
        slug: "bit-manipulation-and-tries",
        title: "Bit Manipulation & Trie Trees",
        summary: "Understand bitwise XOR cancellation, prefix trees for auto-complete, and Union-Find.",
        points: [
          {
            id: "bonus-point-1",
            title: "Bitwise XOR Tricks & The Trie Prefix Tree",
            quote: "Practice until patterns click.",
            everydayAnalogy: {
              title: "The Light Switch Toggle & The Dictionary Index",
              scenario: "Flipping a light switch twice returns it to its original state: x XOR x = 0! For Tries, think of an auto-complete search bar: as you type 'c-a-t', each letter follows a path down a letter tree, sharing prefixes with 'c-a-r' and 'c-a-n'."
            },
            theProblem: "How do you find the single unique number in an array where every other number appears twice, using O(1) space?",
            theIntuition: "Because x XOR x = 0 and x XOR 0 = x, XORing all numbers together cancels out all pairs, leaving only the unique number in a single pass!",
            formalConcept: "Bit manipulation executes operations directly on binary bits at hardware speed. A Trie (Prefix Tree) is an m-ary tree where paths from root represent common prefixes of strings, supporting O(L) search where L is string length.",
            internalWorking: "XOR properties: Commutative (a ^ b = b ^ a), Associative, Identity (a ^ 0 = a), Self-inverse (a ^ a = 0). A Trie node stores TrieNode[26] children and a boolean isEndOfWord.",
            visualType: "trie-visualizer",
            dryRunSteps: [
              { step: 1, label: "Input", value: "nums = [4, 1, 2, 1, 2]" },
              { step: 2, label: "Compute XOR", value: "4 ^ (1 ^ 1) ^ (2 ^ 2) = 4 ^ 0 ^ 0 = 4" },
              { step: 3, label: "Result", value: "Single number 4 isolated with O(1) memory!" }
            ],
            pseudocode: `function singleNumber(nums):\n    res = 0\n    for n in nums:\n        res = res ^ n\n    return res`,
            codeExamples: {
              java: `public class SingleNumber {\n    public static int singleNumber(int[] nums) {\n        int res = 0;\n        for (int n : nums) res ^= n;\n        return res;\n    }\n}`,
              python: `def single_number(nums: list[int]) -> int:\n    res = 0\n    for n in nums:\n        res ^= n\n    return res`
            },
            complexity: {
              time: "Single Number: O(n) time. Trie lookup: O(L) where L is string length",
              space: "Single Number: O(1) constant auxiliary space"
            },
            commonMistakes: [
              { mistake: "Operator precedence of bitwise operators", fix: "Bitwise operators like ^ and & have lower precedence than == in Java/Python. Always use parentheses: if ((n & 1) == 0)." }
            ],
            whenToUse: {
              useWhen: "Prefix search, autocompletion, cycle detection in undirected graphs (Union-Find), or finding unique elements via XOR.",
              avoidWhen: "Beginners: Master foundational Arrays, Hashing, Two Pointers, and Trees first before deep-diving into segment trees."
            },
            practiceProblems: [
              {
                id: "single-number",
                title: "Single Number",
                difficulty: "Easy",
                url: "https://leetcode.com/problems/single-number/",
                relevance: "The classic bit manipulation problem demonstrating the XOR cancellation identity.",
                hints: [
                  "Hint 1: If you XOR two identical numbers (x ^ x), what do you get? Zero.",
                  "Hint 2: What is x ^ 0? It is x.",
                  "Hint 3: XOR all numbers together. Pairs cancel out to 0.",
                  "Solution: Initialize res = 0. XOR all elements in nums. Return res."
                ]
              }
            ],
            summary: "Advanced patterns like bit manipulation, Tries, and DSU provide specialized solutions for prefix searching, hardware-level bit operations, and disjoint connectivity."
          }
        ]
      }
    ]
  }
];

// Helper utilities for curriculum traversal
export const getAllTopics = () => LEARN_CURRICULUM;

export const getTopicBySlug = (slug) => {
  return LEARN_CURRICULUM.find(t => t.slug === slug) || LEARN_CURRICULUM[0];
};

export const getLessonBySlug = (topicSlug, lessonSlug) => {
  const topic = getTopicBySlug(topicSlug);
  if (!topic || !topic.lessons) return null;
  return topic.lessons.find(l => l.slug === lessonSlug) || topic.lessons[0];
};

export const getAllLearningPoints = () => {
  const points = [];
  LEARN_CURRICULUM.forEach(topic => {
    topic.lessons.forEach(lesson => {
      lesson.points.forEach(point => {
        points.push({
          ...point,
          topicSlug: topic.slug,
          topicTitle: topic.title,
          lessonSlug: lesson.slug,
          lessonTitle: lesson.title
        });
      });
    });
  });
  return points;
};

export const getTotalLearningPointsCount = () => {
  return getAllLearningPoints().length;
};

export const getDailyQuote = () => {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
};
