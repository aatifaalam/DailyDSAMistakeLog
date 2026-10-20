/**
 * Helper to provide beginner-friendly Guess Prompts (Stage A)
 * and Interactive Practice Micro-Checks (Stage D) for each DSA learning point.
 */

export const getPointStageData = (point, topicSlug) => {
  // If point already has custom guess/practice defined, use it
  if (point.guessQuestion && point.practiceQuestion) {
    return {
      guess: point.guessQuestion,
      practice: point.practiceQuestion
    };
  }

  // Topic-specific tailored everyday questions and practice checks
  switch (topicSlug) {
    case 'arrays-and-strings':
      if (point.id.includes('two-pointers') || point.id.includes('sliding')) {
        return {
          guess: {
            scenario: "Two runners starting at opposite ends of a 100-meter track...",
            question: "If two runners jog toward each other from opposite ends of a 100m track, when do they meet?",
            options: [
              { text: "In the middle, having jointly covered the track exactly once!", isCorrect: true, feedback: "Spot on! That's why two pointers achieve O(N) linear time — each element is checked at most once." },
              { text: "They need to run back and forth multiple times", isCorrect: false, feedback: "Not when moving monotonically toward each other! They meet in the middle in just a single pass." },
              { text: "I'm not sure yet — show me how it works", isCorrect: true, feedback: "Great curiosity! Let's explore how two pointers eliminate quadratic loops." }
            ]
          },
          practice: {
            question: "In the Two Pointers technique on a sorted array, if sum < target, which pointer should move?",
            options: [
              { text: "Move left pointer rightward (left++) to increase the sum", isCorrect: true, explanation: "Correct! Because the array is sorted, moving left pointer rightward increases the value." },
              { text: "Move right pointer leftward (right--) to increase the sum", isCorrect: false, explanation: "Moving the right pointer leftward would DECREASE the sum since numbers get smaller." },
              { text: "Move both pointers at the same time", isCorrect: false, explanation: "Moving both would change the sum unpredictably. You adjust one pointer based on the comparison." }
            ]
          }
        };
      }
      return {
        guess: {
          scenario: "Imagine 50 gym lockers numbered from 0 to 49 in a straight hallway.",
          question: "If your friend tells you their lock is on Locker #37, do you have to open Lockers 0 through 36 first to find it?",
          options: [
            { text: "No, I can calculate the distance and walk straight to Locker #37!", isCorrect: true, feedback: "Bingo! Because lockers are arranged consecutively in equal sizes, you jump directly to #37. That's O(1) random access!" },
            { text: "Yes, I must check every locker starting from #0", isCorrect: false, feedback: "You'd only have to do that if you didn't know the locker number! Since you know #37, you can walk directly there." },
            { text: "I'm not sure yet — let's explore", isCorrect: true, feedback: "No problem at all! Let's see how memory addresses work like consecutive lockers." }
          ]
        },
        practice: {
          question: "If an array starts at memory address 0x1000 and each integer takes 4 bytes, what is the address of arr[3]?",
          options: [
            { text: "0x100C (Address = 0x1000 + 3 × 4)", isCorrect: true, explanation: "Exactly! Base + (Index × ElementSize) = 0x1000 + 12 = 0x100C in one single CPU calculation." },
            { text: "0x1003 (Address = 0x1000 + 3)", isCorrect: false, explanation: "Remember each integer occupies 4 bytes, so we multiply index by 4." },
            { text: "0x1012 (Address = 0x1000 + 3 × 6)", isCorrect: false, explanation: "Standard 32-bit integers occupy 4 bytes, not 6." }
          ]
        }
      };

    case 'hashing':
      return {
        guess: {
          scenario: "Looking up 'Doctor Smith' in a paper telephone directory or phone contacts...",
          question: "How do you find 'Smith' in a telephone directory?",
          options: [
            { text: "Jump straight to the 'S' section using alphabetical key indexing", isCorrect: true, feedback: "Exactly! A key-based index lets you bypass millions of irrelevant names instantly." },
            { text: "Read every single name from page 1 ('A') to the end", isCorrect: false, feedback: "Reading sequentially from page 1 would take hours! Key-based grouping avoids full scans." },
            { text: "Not sure — show me the intuition", isCorrect: true, feedback: "Welcome! Hashing is inspired by this exact concept of key-based grouping." }
          ]
        },
        practice: {
          question: "What is the expected average-case time complexity of looking up a key in a HashMap?",
          options: [
            { text: "O(1) Constant Time", isCorrect: true, explanation: "Correct! With a good hash function and low load factor, HashMap gives expected O(1) lookups." },
            { text: "O(n) Linear Time", isCorrect: false, explanation: "O(n) is the worst-case when all keys collide into the same bucket, but average-case is O(1)." },
            { text: "O(log n) Logarithmic Time", isCorrect: false, explanation: "O(log n) is for balanced search trees (like TreeMap), not hash tables." }
          ]
        }
      };

    case 'linked-lists':
      return {
        guess: {
          scenario: "A sequence of train cars connected by mechanical couplers...",
          question: "If you want to insert a new train car between Car #2 and Car #3, what do you need to do?",
          options: [
            { text: "Disconnect the coupler between 2 & 3, and connect the new car in the middle", isCorrect: true, feedback: "Precisely! You only update the two connection links (pointers), without moving all other cars!" },
            { text: "Rebuild the entire train from scratch on a new track", isCorrect: false, feedback: "That's how fixed-capacity arrays work! Linked lists avoid this by simply relinking pointers." },
            { text: "I'm not sure yet — show me", isCorrect: true, feedback: "Let's discover why pointers make insertions and deletions so flexible." }
          ]
        },
        practice: {
          question: "Why can't a singly linked list look up the 50th element in O(1) time like an array?",
          options: [
            { text: "Nodes are scattered across memory; you must follow pointers sequentially from Head", isCorrect: true, explanation: "Correct! Linked list nodes do not live in contiguous memory slots, so you must traverse O(N) steps." },
            { text: "Linked lists can only hold negative numbers", isCorrect: false, explanation: "Linked lists can hold any data type." },
            { text: "Linked lists always take O(N²) time", isCorrect: false, explanation: "Traversal takes linear O(N) time, not quadratic." }
          ]
        }
      };

    case 'stacks-and-queues':
      return {
        guess: {
          scenario: "A spring-loaded pile of clean plates at a buffet...",
          question: "When a dishwasher puts a clean plate on top of the pile, who gets that plate?",
          options: [
            { text: "The next guest takes that top plate first (Last-In, First-Out)!", isCorrect: true, feedback: "Spot on! That is the LIFO principle of a Stack: the last item added is the first item removed." },
            { text: "The guest reaches to the very bottom plate", isCorrect: false, feedback: "Pulling from the bottom would tip the stack over! Stacks operate strictly from the Top." },
            { text: "Not sure — show me the plates", isCorrect: true, feedback: "Let's play with the interactive stack visualizer to see push and pop in action!" }
          ]
        },
        practice: {
          question: "Which data structure is best suited for matching nested brackets in '({[]})'?",
          options: [
            { text: "Stack (LIFO matches the most recently opened bracket first)", isCorrect: true, explanation: "Correct! The most recently opened bracket must be the first one closed, which is a perfect LIFO stack problem." },
            { text: "Queue (FIFO)", isCorrect: false, explanation: "A queue would match the first bracket opened against the first closed, which fails nested syntax." },
            { text: "Sorted Array", isCorrect: false, explanation: "Sorting would destroy the order of bracket appearance." }
          ]
        }
      };

    case 'binary-search':
      return {
        guess: {
          scenario: "Guessing a secret number between 1 and 100 with 'Too High' / 'Too Low' hints...",
          question: "What is your best first guess to eliminate as many possibilities as possible?",
          options: [
            { text: "50 (The middle, immediately cutting half the numbers away)", isCorrect: true, feedback: "Brilliant! No matter if the secret number is higher or lower, 50 numbers are eliminated instantly!" },
            { text: "1 (Start from the very beginning)", isCorrect: false, feedback: "If you guess 1 and it's 'Too Low', you only eliminated one number. Guessing the middle cuts 50%!" },
            { text: "100 (Start from the end)", isCorrect: false, feedback: "Starting at the end also only eliminates one number at a time." }
          ]
        },
        practice: {
          question: "How many steps does Binary Search take in the worst case to find a number among 1,000,000 sorted elements?",
          options: [
            { text: "About 20 steps (log₂(1,000,000) ≈ 20)", isCorrect: true, explanation: "Incredible, isn't it? Halving 1,000,000 repeatedly reaches 1 in only 20 comparisons!" },
            { text: "500,000 steps", isCorrect: false, explanation: "500,000 is linear search on half the array. Binary search cuts exponentially down to ~20." },
            { text: "1,000,000 steps", isCorrect: false, explanation: "1,000,000 would be naive linear search." }
          ]
        }
      };

    default:
      // General intuitive prompt for any other topic
      return {
        guess: {
          scenario: point.everydayAnalogy?.scenario || "A common challenge in everyday planning and organization...",
          question: `Before diving into code, how would you intuitively solve this problem in real life?`,
          options: [
            { text: point.theIntuition ? `Use the intuitive approach: ${point.theIntuition.slice(0, 75)}...` : "Look for a pattern and solve it step-by-step", isCorrect: true, feedback: "Great intuition! Let's see how computer scientists formalize this exact logic." },
            { text: "Try every single combination randomly without a plan", isCorrect: false, feedback: "Random brute force leads to exponential timeouts. We want a structured approach!" },
            { text: "I'm not sure yet — guide me through the concept", isCorrect: true, feedback: "That's why we're here! Let's explore the concept step-by-step." }
          ]
        },
        practice: {
          question: `What is the core benefit of using ${point.title}?`,
          options: [
            { text: "It replaces slow brute-force with structured, efficient logic", isCorrect: true, explanation: "Correct! Algorithms and data structures exist to solve real problems efficiently." },
            { text: "It memorizes syntax without understanding the invariant", isCorrect: false, explanation: "Our philosophy is: 'Hints, not answers. Logic, not shortcuts.'" },
            { text: "It only works on small inputs", isCorrect: false, explanation: "Efficient algorithms scale gracefully to millions of inputs." }
          ]
        }
      };
  }
};
