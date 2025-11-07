import { SurveyItem } from '../types/survey';
import styles from './ItemView.module.css';

interface ItemViewProps {
  item: SurveyItem;
  value: string | string[] | number | undefined;
  onChange: (value: string | string[] | number) => void;
}

function ItemView({ item, value, onChange }: ItemViewProps) {
  const renderInput = () => {
    switch (item.type) {
      case 'text':
        return (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            className={styles.textInput}
            placeholder="回答を入力してください"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            className={styles.textareaInput}
            placeholder="回答を入力してください"
            rows={4}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={(value as number) || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            className={styles.numberInput}
            placeholder="数値を入力してください"
          />
        );

      case 'radio':
        return (
          <div className={styles.radioGroup}>
            {item.options?.map((option) => (
              <label key={option} className={styles.radioLabel}>
                <input
                  type="radio"
                  name={item.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className={styles.radioInput}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        const checkboxValues = Array.isArray(value) ? value : [];
        return (
          <div className={styles.checkboxGroup}>
            {item.options?.map((option) => (
              <label key={option} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  value={option}
                  checked={checkboxValues.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...checkboxValues, option]);
                    } else {
                      onChange(checkboxValues.filter((v) => v !== option));
                    }
                  }}
                  className={styles.checkboxInput}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div className={styles.ratingGroup}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => onChange(rating)}
                className={`${styles.ratingButton} ${
                  value === rating ? styles.ratingButtonActive : ''
                }`}
              >
                {rating}
              </button>
            ))}
            <div className={styles.ratingLabels}>
              <span>低い</span>
              <span>高い</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.itemHeader}>
        <h4 className={styles.itemTitle}>{item.title}</h4>
        {item.description && (
          <p className={styles.itemDescription}>{item.description}</p>
        )}
      </div>
      <div className={styles.itemInput}>{renderInput()}</div>
    </div>
  );
}

export default ItemView;
