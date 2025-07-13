import React from "react"

type params = { children: React.ReactNode, click: any, selected?: boolean }
function PageNavButton({ children, click, selected = false }: params) {
  return <button onClick={click} className={`text-text text-xl m-2 aspect-square p-1 w-10 hover:bg-hoverbg border border-foreground ${selected ? 'bg-hoverbg' : 'bg-background-second'} transition duration-350 hover:duration-50 `}>{children}</button>
}

type params2 = { changePage: (newpage: number) => void, curPage: number, maxPage: number }
export default function PageNav({ changePage, curPage, maxPage }: params2) {
  return (
    <div className='m-5 pl-10 pr-10 flex flex-wrap justify-center bg-background-second '>
      <PageNavButton click={() => changePage(curPage - 1)}>
        <img className="h-6 translate-x-1 translate-y-0.5" src="./left.svg"/>
      </PageNavButton>
      {Array.from({ length: maxPage }).map((_, index) => {
        return (
          <PageNavButton key={index} click={() => changePage(index + 1)} selected={curPage == index + 1}>
            {(index + 1).toString()}
          </PageNavButton>
        )
      })}
      <PageNavButton click={() => changePage(curPage + 1)}>
        <img className="h-6 translate-x-1.5 translate-y-0.5" src="./right.svg"/>
      </PageNavButton>
    </div>
  )
}
