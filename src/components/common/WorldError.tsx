interface WorldErrorProps {
  onBack: () => void;
  title?: string;
  description?: string;
}

function WorldError({
  onBack,
  title = "世界載入失敗",
  description = "請重新整理頁面後再試一次。",
}: WorldErrorProps) {
  return (
    <div className="grid h-full place-items-center p-6 text-center">
      <div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-muted mt-2 text-sm">{description}</p>
        <div className="mt-5 flex justify-center gap-3">
          <button
            className="bg-primary text-on-primary min-h-11 rounded-lg px-4 text-sm"
            type="button"
            onClick={() => window.location.reload()}
          >
            重新整理
          </button>
          <a
            className="border-line hover:bg-hover flex min-h-11 items-center rounded-lg border px-4 text-sm"
            href={import.meta.env.BASE_URL}
            onClick={(event) => {
              event.preventDefault();
              onBack();
            }}
          >
            回首頁
          </a>
        </div>
      </div>
    </div>
  );
}

export default WorldError;
