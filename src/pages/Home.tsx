import { Link } from 'react-router-dom';
import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>アンケートシステム</h1>
        <p className={styles.description}>
          アンケートの作成と回答を行えるシステムです
        </p>

        <div className={styles.buttonGroup}>
          <Link to="/builder" className={styles.button}>
            <div className={styles.buttonIcon}>📝</div>
            <h2>アンケートを作成する</h2>
            <p>管理者向け：アンケートを自由に作成・編集できます</p>
          </Link>

          <Link to="/survey" className={styles.button}>
            <div className={styles.buttonIcon}>✍️</div>
            <h2>アンケートに回答する</h2>
            <p>回答者向け：作成されたアンケートに回答できます</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
