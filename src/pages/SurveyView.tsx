import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Survey, Answer, PageAnswer, SurveyResponse } from '../types/survey';
import PageView from '../components/PageView';
import styles from './SurveyView.module.css';

function SurveyView() {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageAnswers, setPageAnswers] = useState<PageAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // JSON インポート
  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedSurvey = JSON.parse(event.target?.result as string) as Survey;
        if (!importedSurvey.pages || importedSurvey.pages.length === 0) {
          alert('有効なアンケートデータではありません');
          return;
        }
        setSurvey(importedSurvey);
        setCurrentPageIndex(0);
        setPageAnswers([]);
        setIsCompleted(false);
      } catch (error) {
        alert('JSONファイルの読み込みに失敗しました');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  // 現在のページの回答を取得
  const getCurrentPageAnswers = (): Answer[] => {
    const currentPage = survey?.pages[currentPageIndex];
    if (!currentPage) return [];

    const existingAnswers = pageAnswers.find((pa) => pa.pageId === currentPage.id);
    return existingAnswers?.answers || [];
  };

  // 次のページへ
  const handleNext = (answers: Answer[], nextPageId?: string) => {
    if (!survey) return;

    const currentPage = survey.pages[currentPageIndex];

    // 現在のページの回答を保存
    const newPageAnswers = [
      ...pageAnswers.filter((pa) => pa.pageId !== currentPage.id),
      { pageId: currentPage.id, answers },
    ];
    setPageAnswers(newPageAnswers);

    // 次のページを決定
    let nextIndex: number;
    if (nextPageId) {
      // 分岐条件で指定されたページ
      nextIndex = survey.pages.findIndex((p) => p.id === nextPageId);
    } else {
      // 通常は次のページ
      nextIndex = currentPageIndex + 1;
    }

    if (nextIndex >= survey.pages.length || nextIndex === -1) {
      // アンケート完了
      setIsCompleted(true);
    } else {
      setCurrentPageIndex(nextIndex);
    }
  };

  // 前のページへ
  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  // 回答結果をダウンロード
  const downloadResults = () => {
    if (!survey) return;

    const response: SurveyResponse = {
      surveyId: survey.id,
      pageAnswers,
      completedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(response, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `survey-response-${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // アンケートを最初からやり直し
  const restart = () => {
    setCurrentPageIndex(0);
    setPageAnswers([]);
    setIsCompleted(false);
  };

  if (!survey) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Link to="/" className={styles.backButton}>
            ← ホームに戻る
          </Link>
          <h1>アンケート回答</h1>
        </header>
        <div className={styles.uploadSection}>
          <div className={styles.uploadBox}>
            <h2>アンケートJSONを読み込んでください</h2>
            <p>アンケート作成システムでエクスポートしたJSONファイルを選択してください</p>
            <label className={styles.uploadButton}>
              ファイルを選択
              <input
                type="file"
                accept=".json"
                onChange={importJSON}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Link to="/" className={styles.backButton}>
            ← ホームに戻る
          </Link>
          <h1>アンケート回答</h1>
        </header>
        <div className={styles.completedSection}>
          <div className={styles.completedBox}>
            <h2>回答完了</h2>
            <p>アンケートへのご協力ありがとうございました。</p>
            <div className={styles.completedButtons}>
              <button onClick={downloadResults} className={styles.downloadButton}>
                回答結果をダウンロード
              </button>
              <button onClick={restart} className={styles.restartButton}>
                最初からやり直す
              </button>
              <button
                onClick={() => {
                  setSurvey(null);
                  setPageAnswers([]);
                  setIsCompleted(false);
                }}
                className={styles.newSurveyButton}
              >
                別のアンケートを読み込む
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentPage = survey.pages[currentPageIndex];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.backButton}>
          ← ホームに戻る
        </Link>
        <h1>{survey.title}</h1>
      </header>

      <div className={styles.main}>
        <div className={styles.surveyContent}>
          <div className={styles.surveyHeader}>
            <p className={styles.description}>{survey.description}</p>
            <div className={styles.progress}>
              ページ {currentPageIndex + 1} / {survey.pages.length}
            </div>
          </div>

          <PageView
            page={currentPage}
            survey={survey}
            initialAnswers={getCurrentPageAnswers()}
            onNext={handleNext}
            onPrevious={currentPageIndex > 0 ? handlePrevious : undefined}
          />
        </div>
      </div>
    </div>
  );
}

export default SurveyView;
