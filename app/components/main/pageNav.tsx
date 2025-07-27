import Link from "next/link";
import styles from "./pagenav.module.css"
import { RootParams } from "@/app/page";

// PAGE NAV DESIGN BY fily.gif https://fily-is.dev

type params2 = { params: RootParams, curPage: number, maxPage: number }
export default function PageNav({ params, curPage, maxPage }: params2) {
  const newUrl = (newPage: number) => {
    const pageParams = new URLSearchParams({page: newPage.toString()});
    if (params.search) pageParams.set('search', params.search);

    return `/?${pageParams.toString()}`;
  }

  function renderPageButtons() {
    const pages = [];
    for (let i = 1; i <= maxPage; i++) {
      const classes = [styles.pageitem];
      if (i === 1) classes.push(styles.firstpageitem);
      if (i === curPage) classes.push(styles.current);
      if (i === maxPage) classes.push(styles.lastpageitem);
      pages.push(<Link key={i} className={classes.join(' ')} href={newUrl(i)}>{i}</Link>);
    }

    return pages;
  };

  return (
    <nav className="m-5 p-5 pl-10 pr-10 flex flex-wrap justify-center bg-background-second">
      <Link href={newUrl(1)} className={styles.pageitem}>FIRST</Link>
      <Link href={newUrl(curPage - 1)} className={styles.pageitem}>PREVIOUS</Link>
      {renderPageButtons()}
      <Link href={newUrl(curPage + 1)} className={styles.pageitem}>NEXT</Link>
      <Link href={newUrl(maxPage)} className={styles.pageitem}>LAST</Link>
      {/* style={{ visibility: curPage < maxPage ? 'visible' : 'hidden' }} */}
    </nav>
  );
}
