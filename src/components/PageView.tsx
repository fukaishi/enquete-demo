import { useState, useEffect } from 'react';
import { SurveyPage, Survey, Answer } from '../types/survey';
import ItemView from './ItemView';
import styles from './PageView.module.css';

interface PageViewProps {
  page: SurveyPage;
  survey: Survey;
  initialAnswers: Answer[];
  onNext: (answers: Answer[], nextPageId?: string) => void;
  onPrevious?: () => void;
}

function PageView({ page, initialAnswers, onNext, onPrevious }: PageViewProps) {
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);

  useEffect(() => {
    setAnswers(initialAnswers);
  }, [page.id, initialAnswers]);

  // 回答の更新
  const updateAnswer = (itemId: string, value: string | string[] | number) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.itemId === itemId);
      if (existing) {
        return prev.map((a) => (a.itemId === itemId ? { ...a, value } : a));
      } else {
        return [...prev, { itemId, value }];
      }
    });
  };

  // 次へボタンのハンドラー
  const handleNext = () => {
    // バリデーション：すべての項目が回答されているかチェック
    const allItems = page.questions.flatMap((q) => q.items);
    const unansweredItems = allItems.filter(
      (item) => !answers.find((a) => a.itemId === item.id)
    );

    if (unansweredItems.length > 0) {
      alert('すべての項目に回答してください');
      return;
    }

    // 分岐条件のチェック
    let nextPageId: string | undefined = undefined;

    for (const question of page.questions) {
      for (const item of question.items) {
        if (item.branchConditions && item.branchConditions.length > 0) {
          const answer = answers.find((a) => a.itemId === item.id);
          if (answer) {
            const answerValue = Array.isArray(answer.value)
              ? answer.value[0]
              : String(answer.value);

            const matchedCondition = item.branchConditions.find(
              (bc) => bc.value === answerValue
            );

            if (matchedCondition) {
              nextPageId = matchedCondition.nextPageId;
              break;
            }
          }
        }
      }
      if (nextPageId) break;
    }

    onNext(answers, nextPageId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {page.questions.map((question, questionIndex) => (
          <div key={question.id} className={styles.question}>
            <div className={styles.questionHeader}>
              <h3 className={styles.questionTitle}>
                Q{questionIndex + 1}. {question.title}
              </h3>
              {question.description && (
                <p className={styles.questionDescription}>{question.description}</p>
              )}
            </div>

            <div className={styles.items}>
              {question.items.map((item) => {
                const answer = answers.find((a) => a.itemId === item.id);
                return (
                  <ItemView
                    key={item.id}
                    item={item}
                    value={answer?.value}
                    onChange={(value) => updateAnswer(item.id, value)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.navigation}>
        {onPrevious && (
          <button onClick={onPrevious} className={styles.previousButton}>
            ← 前のページ
          </button>
        )}
        <button onClick={handleNext} className={styles.nextButton}>
          次のページ →
        </button>
      </div>
    </div>
  );
}

export default PageView;
