import { useMemo, useState } from "react";
import { AnimatePresence, m } from "motion/react";

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
    <m.section
      className="daily-summary"
      aria-labelledby="daily-summary-title"
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
      }}
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">Salida lista para pegar</p>
          <h2 id="daily-summary-title">Resumen del día</h2>
        </div>
        <m.button
          className="copy-button"
          type="button"
          onClick={() => {
            void copySummary();
          }}
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -2 }}
        >
          Copiar resumen
        </m.button>
      </div>
      <m.div
        className="summary-preview"
        aria-live="polite"
        layout
        transition={{ duration: 0.2 }}
      >
        {lines.map((line, index) =>
          line ? <p key={`${index}-${line}`}>{line}</p> : <br key={`break-${index}`} />,
        )}
      </m.div>
      <div className="copy-feedback" role="status">
        <AnimatePresence mode="wait">
          {status !== "idle" ? (
            <m.p
              key={status}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.18 }}
            >
              {status === "copied"
                ? "✓ Resumen copiado"
                : "No se pudo copiar automáticamente. Mantén pulsado el resumen para seleccionarlo."}
            </m.p>
          ) : null}
        </AnimatePresence>
      </div>
    </m.section>
  );
}
