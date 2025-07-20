import React from "react"
import styles from "./pagenav.module.css"

// PAGE NAV DESIGN BY fily.gif https://fily-is.dev

type params2 = { changePage: (newpage: number) => void, curPage: number, maxPage: number }
export default function PageNav({ changePage, curPage, maxPage }: params2) {
  function renderPageButtons() {
    const pages = [];
    for (let i = 1; i <= maxPage; i++) {
      const classes = [styles.pageitem];
      if (i === 1) classes.push(styles.firstpageitem);
      if (i === curPage) classes.push(styles.current);
      if (i === maxPage) classes.push(styles.lastpageitem);
      pages.push(<button key={i} className={classes.join(' ')} onClick={() => changePage(i)}>{i}</button>);
    }

    return pages;
  };

  return (
    <nav className="m-5 p-5 pl-10 pr-10 flex flex-wrap justify-center bg-background-second">
      <button className={styles.pageitem} onClick={() => changePage(1)}>FIRST</button>
      <button className={styles.pageitem} onClick={() => changePage(curPage - 1)}>PREVIOUS</button>
      {renderPageButtons()}
      <button className={styles.pageitem} onClick={() => changePage(curPage + 1)}>NEXT</button>
      <button className={styles.pageitem} onClick={() => changePage(maxPage)}>LAST</button>
      {/* style={{ visibility: curPage < maxPage ? 'visible' : 'hidden' }} */}
    </nav>
  );
}
