export interface Draft {
  id: number;
  contributorId: number;
  contributorUsername: string;
  title: string;
  story: string;
  emoji: string;
  colour: string;
  questionsJson: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELETED';
  rejectionReason?: string;
  approvedLessonId?: number;
  createdAt: string;
  updatedAt: string;
}

export type ContribTab = 'create' | 'pending' | 'approved' | 'rejected';
