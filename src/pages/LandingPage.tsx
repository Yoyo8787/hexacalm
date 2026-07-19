import {
  ArrowUpRight,
  BookOpen,
  Box,
  GitFork,
  Globe2,
  Hammer,
  Sparkles,
} from "lucide-react";

const externalLinks = [
  {
    href: "https://github.com/Yoyo8787",
    label: "GitHub",
    description: "查看原始碼與開發紀錄",
    icon: GitFork,
  },
  {
    href: "https://yoyo8787.github.io/Yoyo-s-Portfolio/",
    label: "個人網站",
    description: "認識開發者 Yoyo",
    icon: Globe2,
  },
];

interface LandingPageProps {
  canContinue: boolean;
  onBuildWorld: () => void;
  onContinue: () => void;
}

function LandingPage({
  canContinue,
  onBuildWorld,
  onContinue,
}: LandingPageProps) {
  return (
    <main className="bg-background text-foreground relative isolate min-h-svh overflow-hidden">
      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 py-6 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <a
            className="text-foreground flex items-center gap-2 text-sm font-semibold tracking-[0.18em]"
            href="#top"
          >
            <span className="border-primary/40 bg-primary/10 text-primary grid size-8 place-items-center rounded-md border">
              <Box aria-hidden="true" className="size-4" />
            </span>
            HEXACALM
          </a>
          <span className="text-muted text-xs font-medium tracking-[0.14em]">
            3D 聲景建造器
          </span>
        </header>

        <section
          className="flex flex-1 flex-col justify-center py-16 sm:py-24"
          id="top"
        >
          <p className="text-primary flex items-center gap-2 text-sm font-semibold">
            <Sparkles aria-hidden="true" className="size-4" />
            讓聲音成為一座可以漫遊的世界
          </p>
          <h1 className="text-foreground mt-5 max-w-4xl text-5xl leading-tight font-semibold sm:text-6xl lg:text-7xl">
            建造屬於你的
            <span className="text-primary block">沉靜聲景</span>
          </h1>
          <p className="text-muted mt-7 max-w-2xl text-base leading-8 sm:text-lg">
            Hexacalm 是一個 3D
            聲景建造器。以六角地圖安排森林、水域與道路，讓每一塊地景都成為可感受、可探索的環境聲音。
          </p>
          <a
            className="text-primary decoration-primary/40 hover:text-foreground hover:decoration-primary focus-visible:outline-primary mt-5 inline-flex w-fit items-center gap-2 text-sm font-medium underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
            href="https://codlin.me/column-hexazen/01-origin.html"
            rel="noreferrer"
            target="_blank"
          >
            <BookOpen aria-hidden="true" className="size-4" />
            靈感來源：Hexazen
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            {canContinue && (
              <button
                className="bg-primary text-background inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 text-base font-semibold transition-colors hover:brightness-110"
                onClick={onContinue}
                type="button"
              >
                <ArrowUpRight aria-hidden="true" className="size-5" />
                繼續上次世界
              </button>
            )}
            <button
              aria-label="隨機生成，功能即將推出"
              className="bg-primary text-background inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-md px-5 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70"
              disabled
              type="button"
            >
              <Sparkles aria-hidden="true" className="size-5" />
              隨機生成
            </button>
            <button
              aria-label="建立空白世界"
              className="border-secondary bg-surface text-foreground hover:border-primary/60 hover:bg-surface-hover inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md border px-5 text-base font-semibold transition-colors"
              onClick={onBuildWorld}
              type="button"
            >
              <Hammer aria-hidden="true" className="text-primary size-5" />
              自行建立
            </button>
          </div>
          <p className="text-muted mt-4 text-sm">
            從一個六角格開始，逐步建立你的世界。
          </p>
        </section>

        <footer className="grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
          {externalLinks.map(({ href, label, description, icon: Icon }) => (
            <a
              className="group bg-surface/80 hover:border-primary/50 hover:bg-surface-hover focus-visible:outline-primary flex min-h-20 items-center justify-between rounded-md border border-white/10 px-5 py-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              href={href}
              key={label}
              rel="noreferrer"
              target="_blank"
            >
              <span className="flex items-center gap-3">
                <Icon aria-hidden="true" className="text-primary size-5" />
                <span>
                  <span className="text-foreground block font-semibold">
                    {label}
                  </span>
                  <span className="text-muted mt-0.5 block text-sm">
                    {description}
                  </span>
                </span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="text-muted group-hover:text-primary size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          ))}
        </footer>
      </div>
    </main>
  );
}

export default LandingPage;
