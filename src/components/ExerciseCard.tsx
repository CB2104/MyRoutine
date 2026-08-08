import type { ExerciseDefinition, ExerciseLog } from "../types/workout";

type ExerciseCardProps = {
  exercise: ExerciseDefinition;
  index: number;
  log: ExerciseLog;
  onChange: (update: Partial<ExerciseLog>) => void;
  onOpenMedia: (exercise: ExerciseDefinition) => void;
};

function numberOrNull(value: string): number | null {
  if (value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function rangeFeedback(
  value: number | null,
  exercise: ExerciseDefinition,
) {
  if (value === null) return null;
  if (value < exercise.minReps) return "↓ Bajo el rango";
  if (value > exercise.maxReps) return "↑ Sobre el rango";
  return null;
}

export function ExerciseCard({
  exercise,
  index,
  log,
  onChange,
  onOpenMedia,
}: ExerciseCardProps) {
  function updateRep(repIndex: number, value: string) {
    const reps = [...log.reps];
    reps[repIndex] = numberOrNull(value);
    onChange({ reps });
  }

  const unitLabel = exercise.unit === "seconds" ? "segundos" : "reps";

  return (
    <article className="exercise-card" data-completed={log.completed}>
      <div className="exercise-card__header">
        <button
          className="exercise-media"
          type="button"
          onClick={() => onOpenMedia(exercise)}
          aria-label={`Ver técnica de ${exercise.name}`}
        >
          <img
            src={exercise.gifUrl}
            alt={`Demostración de ${exercise.name}`}
            loading="lazy"
          />
          <span aria-hidden="true">VER GIF</span>
        </button>
        <div className="exercise-heading">
          <p className="exercise-number">Ejercicio {String(index + 1).padStart(2, "0")}</p>
          <h3>{exercise.name}</h3>
          <p className="prescription">
            {exercise.sets} × {exercise.minReps}–{exercise.maxReps}
            {exercise.unit === "seconds" ? " s" : ""}
            {exercise.prescriptionNote ? ` · ${exercise.prescriptionNote}` : ""}
          </p>
          <p className="exercise-target">{exercise.target}</p>
        </div>
      </div>

      <div className="exercise-fields">
        <label className="field weight-field">
          <span>{exercise.unit === "seconds" ? "Carga extra" : "Peso"}</span>
          <span className="input-with-unit">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={log.weight ?? ""}
              onChange={(event) =>
                onChange({ weight: numberOrNull(event.currentTarget.value) })
              }
              aria-label={`${exercise.unit === "seconds" ? "Carga extra" : "Peso"} de ${exercise.name} en kilogramos`}
              placeholder="0"
            />
            <span>kg</span>
          </span>
        </label>

        <fieldset className="reps-fieldset">
          <legend>Series · {unitLabel}</legend>
          <div className="set-inputs">
            {Array.from({ length: exercise.sets }, (_, repIndex) => {
              const feedback = rangeFeedback(log.reps[repIndex] ?? null, exercise);
              return (
                <label className="set-field" key={`${exercise.id}-set-${repIndex + 1}`}>
                  <span>S{repIndex + 1}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    value={log.reps[repIndex] ?? ""}
                    onChange={(event) => updateRep(repIndex, event.currentTarget.value)}
                    aria-describedby={feedback ? `${exercise.id}-feedback-${repIndex}` : undefined}
                    aria-label={`${unitLabel} de la serie ${repIndex + 1} de ${exercise.name}`}
                    placeholder="—"
                  />
                  {feedback ? (
                    <small id={`${exercise.id}-feedback-${repIndex}`}>
                      {feedback}
                    </small>
                  ) : null}
                </label>
              );
            })}
          </div>
        </fieldset>

        <label className="field rir-field">
          <span>RIR</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            max="10"
            step="1"
            value={log.rir ?? ""}
            onChange={(event) =>
              onChange({ rir: numberOrNull(event.currentTarget.value) })
            }
            aria-label={`RIR de ${exercise.name}`}
            placeholder="—"
          />
        </label>

        <label className="field notes-field">
          <span>Nota rápida</span>
          <input
            type="text"
            maxLength={280}
            value={log.notes}
            onChange={(event) => onChange({ notes: event.currentTarget.value })}
            aria-label={`Notas de ${exercise.name}`}
            placeholder="Técnica, molestias, próxima carga…"
          />
        </label>
      </div>

      <button
        className="complete-button"
        data-completed={log.completed}
        type="button"
        aria-pressed={log.completed}
        onClick={() => onChange({ completed: !log.completed })}
      >
        <span aria-hidden="true">{log.completed ? "✓" : "○"}</span>
        {log.completed ? "Completado" : "Marcar como completado"}
      </button>
    </article>
  );
}
