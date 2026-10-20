import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { 
  LEARN_CURRICULUM, 
  getTotalLearningPointsCount, 
  getTopicBySlug, 
  getLessonBySlug,
  SIGNATURE_QUOTE 
} from '../data/learnCurriculum';
import ProgressiveHints from '../components/learn/ProgressiveHints';
import QuoteCard from '../components/learn/QuoteCard';
import EverydayAnalogyCard from '../components/learn/EverydayAnalogyCard';
import LearningPointStageFlow from '../components/learn/LearningPointStageFlow';
import { MemoryRouter } from 'react-router-dom';

describe('Learn DSA Curriculum & Components', () => {
  const EXPECTED_TOPIC_SLUGS = [
    'arrays-and-strings',
    'hashing',
    'linked-lists',
    'stacks-and-queues',
    'trees-and-graphs',
    'heap',
    'greedy-algorithms',
    'binary-search',
    'backtracking',
    'dynamic-programming',
    'interviews',
    'tools',
    'bonus'
  ];

  it('contains exactly 13 topics in the requested curriculum order', () => {
    expect(LEARN_CURRICULUM).toHaveLength(13);
    const actualSlugs = LEARN_CURRICULUM.map(t => t.slug);
    expect(actualSlugs).toEqual(EXPECTED_TOPIC_SLUGS);
  });

  it('verifies every learning point has a contextual quote and no empty fields', () => {
    let totalPointsChecked = 0;
    LEARN_CURRICULUM.forEach((topic) => {
      expect(topic.title).toBeTruthy();
      expect(topic.lessons.length).toBeGreaterThan(0);

      topic.lessons.forEach((lesson) => {
        expect(lesson.title).toBeTruthy();
        expect(lesson.points.length).toBeGreaterThan(0);

        lesson.points.forEach((point) => {
          totalPointsChecked++;
          expect(point.title).toBeTruthy();
          expect(point.quote).toBeTruthy();
          expect(point.quote.length).toBeGreaterThan(5);
          expect(point.formalConcept).toBeTruthy();
          expect(point.everydayAnalogy).toBeTruthy();
          expect(point.everydayAnalogy.title).toBeTruthy();
          expect(point.everydayAnalogy.scenario).toBeTruthy();
        });
      });
    });

    expect(totalPointsChecked).toBe(getTotalLearningPointsCount());
  });

  it('verifies helper functions resolve topics and lessons properly', () => {
    const arraysTopic = getTopicBySlug('arrays-and-strings');
    expect(arraysTopic).toBeDefined();
    expect(arraysTopic.title).toBe('Arrays and Strings');

    const twoPointers = getLessonBySlug('arrays-and-strings', 'two-pointers-and-sliding-window');
    expect(twoPointers).toBeDefined();
    expect(twoPointers.title).toBe('Two Pointers & Sliding Window');
  });

  it('renders QuoteCard with signature or custom quote', () => {
    render(<QuoteCard quote="Hints help, copying hurts." author="DSA Rule" />);
    expect(screen.getByText(/Hints help, copying hurts\./i)).toBeInTheDocument();
  });

  it('renders EverydayAnalogyCard with intuitive explanation sections', () => {
    const analogy = {
      title: 'The Numbered Lockers',
      scenario: 'Numbered lockers at the gym in a straight hallway'
    };
    render(
      <EverydayAnalogyCard 
        analogy={analogy} 
        theProblem="Need to find locker 42 without checking all of them"
        theIntuition="Multiply locker width by index for direct lookup"
      />
    );
    expect(screen.getByText('The Numbered Lockers')).toBeInTheDocument();
    expect(screen.getByText('Numbered lockers at the gym in a straight hallway')).toBeInTheDocument();
    expect(screen.getByText('Need to find locker 42 without checking all of them')).toBeInTheDocument();
    expect(screen.getByText('Multiply locker width by index for direct lookup')).toBeInTheDocument();
  });

  it('operates ProgressiveHints revelation ladder step-by-step', () => {
    const hints = [
      'Look at the two ends',
      'Use two pointers moving inward',
      'Compare characters at left and right pointers',
      'Left and right pointers check palindrome symmetry in O(N).'
    ];

    render(<ProgressiveHints hints={hints} />);

    // Initially, no hint text is visible
    expect(screen.queryByText('Look at the two ends')).not.toBeInTheDocument();

    // Click "Reveal Hint 1"
    const hint1Btn = screen.getByRole('button', { name: /Reveal Hint 1/i });
    fireEvent.click(hint1Btn);
    expect(screen.getByText('Look at the two ends')).toBeInTheDocument();

    // Reveal Hint 2
    const hint2Btn = screen.getByRole('button', { name: /Reveal Hint 2/i });
    fireEvent.click(hint2Btn);
    expect(screen.getByText('Use two pointers moving inward')).toBeInTheDocument();

    // Reveal Hint 3
    const hint3Btn = screen.getByRole('button', { name: /Reveal Hint 3/i });
    fireEvent.click(hint3Btn);
    expect(screen.getByText('Compare characters at left and right pointers')).toBeInTheDocument();

    // Reveal Solution
    const solutionBtn = screen.getByRole('button', { name: /Reveal Solution/i });
    fireEvent.click(solutionBtn);
    expect(screen.getByText('Left and right pointers check palindrome symmetry in O(N).')).toBeInTheDocument();
  });

  it('renders LearningPointStageFlow and transitions through the 5 learning stages', () => {
    const point = LEARN_CURRICULUM[0].lessons[0].points[0];
    const topic = LEARN_CURRICULUM[0];
    const onToggle = () => {};

    const { getByText, getByRole } = render(
      <MemoryRouter>
        <LearningPointStageFlow
          point={point}
          topic={topic}
          isCompleted={false}
          onToggleComplete={onToggle}
          isToggling={false}
        />
      </MemoryRouter>
    );

    // Initial stage: Stage A (Guess)
    expect(getByText(/Stage A: Everyday Life Question/i)).toBeInTheDocument();
    expect(getByText(/Think First: How would you approach this\?/i)).toBeInTheDocument();

    // Navigate to Stage B (Explore)
    const exploreTab = getByRole('button', { name: /^Stage B: Explore$/i });
    fireEvent.click(exploreTab);
    expect(getByText(/Everyday Life Intuition/i)).toBeInTheDocument();

    // Navigate to Stage C (Understand)
    const understandTab = getByRole('button', { name: /^Stage C: Understand$/i });
    fireEvent.click(understandTab);
    expect(getByText(/Stage C: Formal Concept in Plain English/i)).toBeInTheDocument();

    // Navigate to Stage D (Practice)
    const practiceTab = getByRole('button', { name: /^Stage D: Practice/i });
    fireEvent.click(practiceTab);
    expect(getByText(/Test Your Intuition/i)).toBeInTheDocument();

    // Navigate to Stage E (Reflect)
    const reflectTab = getByRole('button', { name: /^Stage E: Reflect/i });
    fireEvent.click(reflectTab);
    expect(getByText(/The Core Invariant/i)).toBeInTheDocument();
    expect(getByText(/Common Pitfall to Avoid/i)).toBeInTheDocument();
  });
});

