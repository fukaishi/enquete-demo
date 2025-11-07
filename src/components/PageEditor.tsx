import { SurveyPage, Question } from '../types/survey';
import QuestionEditor from './QuestionEditor';
import styles from './PageEditor.module.css';

interface PageEditorProps {
  page: SurveyPage;
  allPages: SurveyPage[];
  onUpdate: (page: SurveyPage) => void;
}

function PageEditor({ page, allPages, onUpdate }: PageEditorProps) {
  // 設問追加
  const addQuestion = () => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      title: '新規設問',
      description: '設問の説明を入力してください',
      items: [],
    };
    onUpdate({
      ...page,
      questions: [...page.questions, newQuestion],
    });
  };

  // 設問削除
  const deleteQuestion = (questionId: string) => {
    onUpdate({
      ...page,
      questions: page.questions.filter((q) => q.id !== questionId),
    });
  };

  // 設問更新
  const updateQuestion = (questionId: string, updatedQuestion: Question) => {
    onUpdate({
      ...page,
      questions: page.questions.map((q) =>
        q.id === questionId ? updatedQuestion : q
      ),
    });
  };

  // 設問を上に移動
  const moveQuestionUp = (index: number) => {
    if (index === 0) return;
    const newQuestions = [...page.questions];
    [newQuestions[index - 1], newQuestions[index]] = [
      newQuestions[index],
      newQuestions[index - 1],
    ];
    onUpdate({ ...page, questions: newQuestions });
  };

  // 設問を下に移動
  const moveQuestionDown = (index: number) => {
    if (index === page.questions.length - 1) return;
    const newQuestions = [...page.questions];
    [newQuestions[index], newQuestions[index + 1]] = [
      newQuestions[index + 1],
      newQuestions[index],
    ];
    onUpdate({ ...page, questions: newQuestions });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>ページ編集</h2>
        <button onClick={addQuestion} className={styles.addButton}>
          + 設問追加
        </button>
      </div>

      <div className={styles.questionList}>
        {page.questions.map((question, index) => (
          <div key={question.id} className={styles.questionWrapper}>
            <div className={styles.questionHeader}>
              <span className={styles.questionNumber}>設問 {index + 1}</span>
              <div className={styles.questionControls}>
                <button
                  onClick={() => moveQuestionUp(index)}
                  disabled={index === 0}
                  className={styles.moveButton}
                  title="上に移動"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveQuestionDown(index)}
                  disabled={index === page.questions.length - 1}
                  className={styles.moveButton}
                  title="下に移動"
                >
                  ↓
                </button>
                <button
                  onClick={() => deleteQuestion(question.id)}
                  className={styles.deleteButton}
                >
                  削除
                </button>
              </div>
            </div>
            <QuestionEditor
              question={question}
              currentPageId={page.id}
              allPages={allPages}
              onUpdate={(updatedQuestion) =>
                updateQuestion(question.id, updatedQuestion)
              }
            />
          </div>
        ))}
        {page.questions.length === 0 && (
          <div className={styles.emptyState}>
            <p>設問を追加してください</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PageEditor;
