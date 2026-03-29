export type DraftStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface DraftQuestion {
  question_type: 'INTRO' | 'SELECT' | 'TRANSLATE';
  title: string;
  content?: string;
  explanation: string;
  options?: string[];
  correctAnswer?: number;
  wordbank?: string[];
  target?: string;
}

export interface DraftSummary {
  id: number;
  title: string;
  colour: string;
  emoji: string;
  status: DraftStatus;
  rejectionNote?: string;
  createdAt: string;
  updatedAt: string;
  contributorUsername: string;
}

export interface DraftDetail extends DraftSummary {
  story: string;
  questions: DraftQuestion[];
}

export interface ContributorStats {
  total: number;
  draft: number;
  submitted: number;
  approved: number;
  rejected: number;
}

export type ContributorTab = 'dashboard' | 'my-drafts' | 'create';
