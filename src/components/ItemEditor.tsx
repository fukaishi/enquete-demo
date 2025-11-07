import { SurveyItem, ItemType, BranchCondition, SurveyPage } from '../types/survey';
import styles from './ItemEditor.module.css';

interface ItemEditorProps {
  item: SurveyItem;
  currentPageId: string;
  allPages: SurveyPage[];
  onUpdate: (item: SurveyItem) => void;
}

const itemTypes: { value: ItemType; label: string }[] = [
  { value: 'text', label: 'テキスト回答' },
  { value: 'textarea', label: 'テキストボックス回答' },
  { value: 'number', label: '数値入力回答' },
  { value: 'checkbox', label: 'チェックボックス回答' },
  { value: 'radio', label: 'ラジオボタン回答' },
  { value: 'rating', label: '5段階評価回答' },
];

function ItemEditor({ item, currentPageId, allPages, onUpdate }: ItemEditorProps) {
  const needsOptions = item.type === 'radio' || item.type === 'checkbox';

  // 選択肢の変更
  const updateOptions = (options: string[]) => {
    onUpdate({ ...item, options });
  };

  // 選択肢追加
  const addOption = () => {
    const newOptions = [...(item.options || []), '新しい選択肢'];
    updateOptions(newOptions);
  };

  // 選択肢削除
  const deleteOption = (index: number) => {
    const newOptions = item.options?.filter((_, i) => i !== index) || [];
    updateOptions(newOptions);
  };

  // 選択肢の値変更
  const updateOption = (index: number, value: string) => {
    const newOptions = [...(item.options || [])];
    newOptions[index] = value;
    updateOptions(newOptions);
  };

  // 分岐条件追加
  const addBranchCondition = () => {
    const availablePages = allPages.filter((p) => p.id !== currentPageId);
    if (availablePages.length === 0) {
      alert('分岐先のページがありません。別のページを作成してください。');
      return;
    }

    const newCondition: BranchCondition = {
      value: item.options?.[0] || '',
      nextPageId: availablePages[0].id,
    };
    onUpdate({
      ...item,
      branchConditions: [...(item.branchConditions || []), newCondition],
    });
  };

  // 分岐条件削除
  const deleteBranchCondition = (index: number) => {
    const newConditions = item.branchConditions?.filter((_, i) => i !== index) || [];
    onUpdate({ ...item, branchConditions: newConditions });
  };

  // 分岐条件更新
  const updateBranchCondition = (
    index: number,
    field: keyof BranchCondition,
    value: string
  ) => {
    const newConditions = [...(item.branchConditions || [])];
    newConditions[index] = { ...newConditions[index], [field]: value };
    onUpdate({ ...item, branchConditions: newConditions });
  };

  // 分岐先に選択可能なページ（同一ページは除外）
  const availablePages = allPages.filter((p) => p.id !== currentPageId);

  return (
    <div className={styles.container}>
      <div className={styles.basicInfo}>
        <label>
          <strong>項目タイトル</strong>
          <input
            type="text"
            value={item.title}
            onChange={(e) => onUpdate({ ...item, title: e.target.value })}
            className={styles.input}
          />
        </label>
        <label>
          <strong>項目説明</strong>
          <textarea
            value={item.description}
            onChange={(e) => onUpdate({ ...item, description: e.target.value })}
            className={styles.textarea}
            rows={2}
          />
        </label>
        <label>
          <strong>回答タイプ</strong>
          <select
            value={item.type}
            onChange={(e) =>
              onUpdate({
                ...item,
                type: e.target.value as ItemType,
                options: undefined,
                branchConditions: undefined,
              })
            }
            className={styles.select}
          >
            {itemTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {needsOptions && (
        <div className={styles.optionsSection}>
          <div className={styles.sectionHeader}>
            <strong>選択肢</strong>
            <button onClick={addOption} className={styles.addButton}>
              + 選択肢追加
            </button>
          </div>
          <div className={styles.optionsList}>
            {item.options?.map((option, index) => (
              <div key={index} className={styles.optionItem}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className={styles.input}
                />
                <button
                  onClick={() => deleteOption(index)}
                  className={styles.deleteButton}
                >
                  削除
                </button>
              </div>
            ))}
            {(!item.options || item.options.length === 0) && (
              <p className={styles.emptyText}>選択肢を追加してください</p>
            )}
          </div>
        </div>
      )}

      {(item.type === 'radio' || item.type === 'checkbox') && item.options && item.options.length > 0 && (
        <div className={styles.branchSection}>
          <div className={styles.sectionHeader}>
            <strong>分岐条件（オプション）</strong>
            <button
              onClick={addBranchCondition}
              className={styles.addButton}
              disabled={availablePages.length === 0}
            >
              + 分岐条件追加
            </button>
          </div>
          {availablePages.length === 0 && (
            <p className={styles.warningText}>
              ※ 分岐条件を設定するには、別のページを作成してください（同一ページには分岐できません）
            </p>
          )}
          <div className={styles.branchList}>
            {item.branchConditions?.map((condition, index) => (
              <div key={index} className={styles.branchItem}>
                <div className={styles.branchFields}>
                  <label>
                    <span>選択値</span>
                    <select
                      value={condition.value}
                      onChange={(e) =>
                        updateBranchCondition(index, 'value', e.target.value)
                      }
                      className={styles.select}
                    >
                      {item.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <span className={styles.arrow}>→</span>
                  <label>
                    <span>次のページ</span>
                    <select
                      value={condition.nextPageId}
                      onChange={(e) =>
                        updateBranchCondition(index, 'nextPageId', e.target.value)
                      }
                      className={styles.select}
                    >
                      {availablePages.map((page) => (
                        <option key={page.id} value={page.id}>
                          ページ {allPages.indexOf(page) + 1}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button
                  onClick={() => deleteBranchCondition(index)}
                  className={styles.deleteButton}
                >
                  削除
                </button>
              </div>
            ))}
            {(!item.branchConditions || item.branchConditions.length === 0) && (
              <p className={styles.emptyText}>分岐条件はありません</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemEditor;
