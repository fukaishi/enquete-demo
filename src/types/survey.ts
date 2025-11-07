// 回答項目のタイプ
export type ItemType = 'text' | 'textarea' | 'number' | 'checkbox' | 'radio' | 'rating';

// 分岐条件
export interface BranchCondition {
  value: string; // 選択された値
  nextPageId: string; // 次のページID
}

// 回答項目
export interface SurveyItem {
  id: string;
  title: string; // 見出し
  description: string; // 本文
  type: ItemType;
  options?: string[]; // radio/checkbox用の選択肢
  branchConditions?: BranchCondition[]; // 分岐条件
}

// 設問
export interface Question {
  id: string;
  title: string; // 見出し
  description: string; // 本文
  items: SurveyItem[];
}

// ページ
export interface SurveyPage {
  id: string;
  questions: Question[];
}

// アンケート全体
export interface Survey {
  id: string;
  title: string;
  description: string;
  pages: SurveyPage[];
}

// 回答データ
export interface Answer {
  itemId: string;
  value: string | string[] | number; // checkbox は string[]
}

export interface PageAnswer {
  pageId: string;
  answers: Answer[];
}

export interface SurveyResponse {
  surveyId: string;
  pageAnswers: PageAnswer[];
  completedAt?: string;
}
