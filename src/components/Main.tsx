import {twMerge} from "tailwind-merge";

export function Main({children, className}: { children: React.ReactNode, className?: string }) {
  return (
    <main className="flex-1 px-4 py-6 lg:px-6">
      <div className={twMerge("container grid max-w-6xl gap-6 lg:gap-10 mx-auto", className)}>
        {children}
      </div>
    </main>
  )
}
