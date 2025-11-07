import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Survey, SurveyPage } from '../types/survey';
import PageEditor from '../components/PageEditor';
import styles from './Builder.module.css';

function Builder() {
  const [survey, setSurvey] = useState<Survey>({
    id: `survey-${Date.now()}`,
    title: '新規アンケート',
    description: 'アンケートの説明を入力してください',
    pages: [],
  });

  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  // ページ追加
  const addPage = () => {
    const newPage: SurveyPage = {
      id: `page-${Date.now()}`,
      questions: [],
    };
    setSurvey((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }));
    setSelectedPageId(newPage.id);
  };

  // ページ削除
  const deletePage = (pageId: string) => {
    setSurvey((prev) => ({
      ...prev,
      pages: prev.pages.filter((p) => p.id !== pageId),
    }));
    if (selectedPageId === pageId) {
      setSelectedPageId(null);
    }
  };

  // ページ更新
  const updatePage = (pageId: string, updatedPage: SurveyPage) => {
    setSurvey((prev) => ({
      ...prev,
      pages: prev.pages.map((p) => (p.id === pageId ? updatedPage : p)),
    }));
  };

  // JSON エクスポート
  const exportJSON = () => {
    const dataStr = JSON.stringify(survey, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `${survey.id}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // JSON インポート
  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedSurvey = JSON.parse(event.target?.result as string) as Survey;
        setSurvey(importedSurvey);
        setSelectedPageId(importedSurvey.pages[0]?.id || null);
      } catch (error) {
        alert('JSONファイルの読み込みに失敗しました');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const selectedPage = survey.pages.find((p) => p.id === selectedPageId);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.backButton}>
          ← ホームに戻る
        </Link>
        <h1>アンケート作成</h1>
        <div className={styles.headerButtons}>
          <label className={styles.button}>
            JSONインポート
            <input
              type="file"
              accept=".json"
              onChange={importJSON}
              style={{ display: 'none' }}
            />
          </label>
          <button onClick={exportJSON} className={styles.button}>
            JSONエクスポート
          </button>
        </div>
      </header>

      <div className={styles.main}>
        <div className={styles.sidebar}>
          <div className={styles.surveyInfo}>
            <label>
              <strong>アンケートタイトル</strong>
              <input
                type="text"
                value={survey.title}
                onChange={(e) =>
                  setSurvey((prev) => ({ ...prev, title: e.target.value }))
                }
                className={styles.input}
              />
            </label>
            <label>
              <strong>説明</strong>
              <textarea
                value={survey.description}
                onChange={(e) =>
                  setSurvey((prev) => ({ ...prev, description: e.target.value }))
                }
                className={styles.textarea}
                rows={3}
              />
            </label>
          </div>

          <div className={styles.pageList}>
            <div className={styles.pageListHeader}>
              <h3>ページ一覧</h3>
              <button onClick={addPage} className={styles.addButton}>
                + ページ追加
              </button>
            </div>
            {survey.pages.map((page, index) => (
              <div
                key={page.id}
                className={`${styles.pageItem} ${
                  selectedPageId === page.id ? styles.pageItemActive : ''
                }`}
                onClick={() => setSelectedPageId(page.id)}
              >
                <span>ページ {index + 1}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePage(page.id);
                  }}
                  className={styles.deleteButton}
                >
                  削除
                </button>
              </div>
            ))}
            {survey.pages.length === 0 && (
              <p className={styles.emptyMessage}>
                ページを追加してください
              </p>
            )}
          </div>
        </div>

        <div className={styles.content}>
          {selectedPage ? (
            <PageEditor
              page={selectedPage}
              allPages={survey.pages}
              onUpdate={(updatedPage) => updatePage(selectedPage.id, updatedPage)}
            />
          ) : (
            <div className={styles.emptyState}>
              <p>左側からページを選択してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Builder;
