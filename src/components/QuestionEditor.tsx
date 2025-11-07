import { Question, SurveyItem, SurveyPage } from '../types/survey';
import ItemEditor from './ItemEditor';
import styles from './QuestionEditor.module.css';

interface QuestionEditorProps {
  question: Question;
  currentPageId: string;
  allPages: SurveyPage[];
  onUpdate: (question: Question) => void;
}

function QuestionEditor({
  question,
  currentPageId,
  allPages,
  onUpdate,
}: QuestionEditorProps) {
  // 回答項目追加
  const addItem = () => {
    const newItem: SurveyItem = {
      id: `item-${Date.now()}`,
      title: '新規回答項目',
      description: '回答項目の説明',
      type: 'text',
    };
    onUpdate({
      ...question,
      items: [...question.items, newItem],
    });
  };

  // 回答項目削除
  const deleteItem = (itemId: string) => {
    onUpdate({
      ...question,
      items: question.items.filter((item) => item.id !== itemId),
    });
  };

  // 回答項目更新
  const updateItem = (itemId: string, updatedItem: SurveyItem) => {
    onUpdate({
      ...question,
      items: question.items.map((item) =>
        item.id === itemId ? updatedItem : item
      ),
    });
  };

  // 回答項目を上に移動
  const moveItemUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...question.items];
    [newItems[index - 1], newItems[index]] = [
      newItems[index],
      newItems[index - 1],
    ];
    onUpdate({ ...question, items: newItems });
  };

  // 回答項目を下に移動
  const moveItemDown = (index: number) => {
    if (index === question.items.length - 1) return;
    const newItems = [...question.items];
    [newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ];
    onUpdate({ ...question, items: newItems });
  };

  return (
    <div className={styles.container}>
      <div className={styles.questionInfo}>
        <label>
          <strong>設問タイトル</strong>
          <input
            type="text"
            value={question.title}
            onChange={(e) =>
              onUpdate({ ...question, title: e.target.value })
            }
            className={styles.input}
          />
        </label>
        <label>
          <strong>設問説明</strong>
          <textarea
            value={question.description}
            onChange={(e) =>
              onUpdate({ ...question, description: e.target.value })
            }
            className={styles.textarea}
            rows={2}
          />
        </label>
      </div>

      <div className={styles.itemsSection}>
        <div className={styles.itemsHeader}>
          <h4>回答項目</h4>
          <button onClick={addItem} className={styles.addButton}>
            + 回答項目追加
          </button>
        </div>

        <div className={styles.itemsList}>
          {question.items.map((item, index) => (
            <div key={item.id} className={styles.itemWrapper}>
              <div className={styles.itemHeader}>
                <span className={styles.itemNumber}>項目 {index + 1}</span>
                <div className={styles.itemControls}>
                  <button
                    onClick={() => moveItemUp(index)}
                    disabled={index === 0}
                    className={styles.moveButton}
                    title="上に移動"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveItemDown(index)}
                    disabled={index === question.items.length - 1}
                    className={styles.moveButton}
                    title="下に移動"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className={styles.deleteButton}
                  >
                    削除
                  </button>
                </div>
              </div>
              <ItemEditor
                item={item}
                currentPageId={currentPageId}
                allPages={allPages}
                onUpdate={(updatedItem) => updateItem(item.id, updatedItem)}
              />
            </div>
          ))}
          {question.items.length === 0 && (
            <div className={styles.emptyState}>
              <p>回答項目を追加してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionEditor;
