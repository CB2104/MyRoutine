import { useMemo, useState } from "react";

type DailySummaryProps = {
  summary: string;
};

type CopyStatus = "idle" | "copied" | "error";

export function DailySummary({ summary }: DailySummaryProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const lines = useMemo(() => summary.split("\n"), [summary]);

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="daily-summary" aria-labelledby="daily-summary-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Salida lista para pegar</p>
          <h2 id="daily-summary-title">Resumen del día</h2>
        </div>
        <button
          className="copy-button"
          type="button"
          onClick={() => {
            void copySummary();
          }}
        >
          Copiar resumen
        </button>
      </div>
      <div className="summary-preview" aria-live="polite">
        {lines.map((line, index) =>
          line ? <p key={`${index}-${line}`}>{line}</p> : <br key={`break-${index}`} />,
        )}
      </div>
      <p className="copy-feedback" role="status">
        {status === "copied" ? "✓ Resumen copiado" : null}
        {status === "error"
          ? "No se pudo copiar automáticamente. Mantén pulsado el resumen para seleccionarlo."
          : null}
      </p>
    </section>
  );
}
