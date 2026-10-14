package com.dsa.mistakelog.config;

import com.dsa.mistakelog.entity.Mistake;
import com.dsa.mistakelog.entity.MistakeType;
import com.dsa.mistakelog.entity.ReviewStatus;
import com.dsa.mistakelog.repository.MistakeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final MistakeRepository mistakeRepository;

    @Value("${app.seed-data.enabled:true}")
    private boolean seedDataEnabled;

    @Override
    public void run(String... args) {
        if (!seedDataEnabled) {
            log.info("Seed data is disabled via configuration");
            return;
        }

        // Check if "Daily Temperatures" already exists
        if (!mistakeRepository.existsByProblemNameIgnoreCase("Daily Temperatures")) {
            Mistake dailyTemperatures = Mistake.builder()
                    .problemName("Daily Temperatures")
                    .platform("LeetCode")
                    .problemUrl("https://leetcode.com/problems/daily-temperatures/")
                    .topic("Stack")
                    .firstApproach("Only check the next element in the temperatures array.")
                    .whyWrong("I assumed that the next warmer temperature would always be on the immediately following day. " +
                            "However, the problem asks for the number of days until a warmer temperature occurs in the future, " +
                            "which can be several days later. If no warmer temperature exists, the answer must be zero.")
                    .mistakeType(MistakeType.WRONG_ALGORITHM)
                    .correctApproach("Use a monotonic decreasing stack of indices. For each temperature, resolve previous indices " +
                            "while the current temperature is warmer than the temperature at the top index. Store the difference " +
                            "between the current index and the previous index. Any unresolved index remains zero.")
                    .whatToChangeNextTime("Check every future day in the initial brute-force solution, handle the case where " +
                            "no warmer day exists, and then optimize using a monotonic stack.")
                    .timeComplexity("O(n)")
                    .spaceComplexity("O(n)")
                    .solvedIndependently(true)
                    .reviewStatus(ReviewStatus.REVIEWED)
                    .reviewDate(LocalDate.now())
                    .notes("Key takeaway: Whenever a problem asks for next greater or next smaller element, think monotonic stack immediately.")
                    .createdAt(LocalDateTime.now().minusDays(2))
                    .updatedAt(LocalDateTime.now().minusDays(1))
                    .build();

            mistakeRepository.save(dailyTemperatures);
            log.info("Seeded canonical mistake record: Daily Temperatures");
        }

        // If table only has 1 or fewer items, seed a couple more realistic DSA items to populate dashboard analytics
        if (mistakeRepository.count() <= 1) {
            Mistake threeSum = Mistake.builder()
                    .problemName("3Sum")
                    .platform("LeetCode")
                    .problemUrl("https://leetcode.com/problems/3sum/")
                    .topic("Two Pointers")
                    .firstApproach("Used three nested loops with a HashSet of lists to deduplicate triplets.")
                    .whyWrong("Time complexity blew up to O(n^3) resulting in Time Limit Exceeded (TLE) on large test inputs. Also hashing lists incurred high overhead.")
                    .mistakeType(MistakeType.TIME_COMPLEXITY)
                    .correctApproach("Sort the array first in O(n log n). Loop through the array fixing the first element, then use two pointers (left and right) to find pairs summing to -nums[i]. Skip duplicates for all three pointers.")
                    .whatToChangeNextTime("When finding tuples/combinations with zero or target sum, think about sorting first to unlock two-pointer scanning and duplicate skipping.")
                    .timeComplexity("O(n^2)")
                    .spaceComplexity("O(1) extra space")
                    .solvedIndependently(false)
                    .reviewStatus(ReviewStatus.NEEDS_ANOTHER_REVIEW)
                    .reviewDate(LocalDate.now().plusDays(3))
                    .notes("Watch out for integer overflow or duplicate elements like [-2, 0, 0, 2, 2].")
                    .createdAt(LocalDateTime.now().minusDays(4))
                    .updatedAt(LocalDateTime.now().minusDays(4))
                    .build();

            Mistake lruCache = Mistake.builder()
                    .problemName("LRU Cache")
                    .platform("LeetCode")
                    .problemUrl("https://leetcode.com/problems/lru-cache/")
                    .topic("Linked List")
                    .firstApproach("Used ArrayList to keep keys in order and a HashMap for values.")
                    .whyWrong("Removing an element from the middle of an ArrayList is an O(n) operation, violating the strict O(1) requirement for both get() and put().")
                    .mistakeType(MistakeType.TIME_COMPLEXITY)
                    .correctApproach("Combine a HashMap with a doubly linked list with dummy head and tail nodes. HashMap maps key to ListNode, enabling O(1) removal and O(1) insertion to front.")
                    .whatToChangeNextTime("Remember that O(1) lookup + O(1) arbitrary removal requires a Doubly Linked List paired with a Hash Map.")
                    .timeComplexity("O(1)")
                    .spaceComplexity("O(capacity)")
                    .solvedIndependently(true)
                    .reviewStatus(ReviewStatus.REVIEWED)
                    .reviewDate(LocalDate.now().minusDays(1))
                    .notes("Dummy head and tail simplify edge cases where list is empty or has 1 item.")
                    .createdAt(LocalDateTime.now().minusDays(6))
                    .updatedAt(LocalDateTime.now().minusDays(1))
                    .build();

            Mistake binarySearch = Mistake.builder()
                    .problemName("Search in Rotated Sorted Array")
                    .platform("LeetCode")
                    .problemUrl("https://leetcode.com/problems/search-in-rotated-sorted-array/")
                    .topic("Binary Search")
                    .firstApproach("Tried finding the pivot point with a linear scan, then running standard binary search.")
                    .whyWrong("Linear scan makes the worst-case time complexity O(n), defeating the purpose of binary search O(log n). Also failed boundary conditions when target was equal to nums[mid].")
                    .mistakeType(MistakeType.EDGE_CASE)
                    .correctApproach("In modified binary search, at least one half of the array [left..mid] or [mid..right] is always sorted. Determine which half is sorted, check if target lies within that sorted range, and narrow the window accordingly.")
                    .whatToChangeNextTime("Always draw out both cases: left sorted (nums[left] <= nums[mid]) vs right sorted (nums[mid] <= nums[right]), and include '<=' checks for boundaries.")
                    .timeComplexity("O(log n)")
                    .spaceComplexity("O(1)")
                    .solvedIndependently(false)
                    .reviewStatus(ReviewStatus.NOT_REVIEWED)
                    .reviewDate(null)
                    .notes("Be careful with duplicate elements vs strictly distinct elements.")
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .updatedAt(LocalDateTime.now().minusDays(1))
                    .build();

            mistakeRepository.saveAll(List.of(threeSum, lruCache, binarySearch));
            log.info("Seeded initial DSA mistakes for dashboard visualization");
        }
    }
}
