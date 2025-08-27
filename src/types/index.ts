export interface TeeTime {
  id: string;
  courseName: string;
  time: string;
  date: string;
  price: number;
  holes: 9 | 18;
  players: number;
  available: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Vue' | 'JavaScript' | 'TypeScript' | 'Components';
  starterCode: string;
  solution: string;
  testCases: TestCase[];
}

export interface TestCase {
  input: any;
  expected: any;
  description: string;
}

export interface UserProgress {
  completedChallenges: string[];
  currentStreak: number;
  totalScore: number;
}