import { useEffect, useRef } from "react";
import type { ExerciseDefinition } from "../types/workout";

type ExerciseModalProps = {
  exercise: ExerciseDefinition | null;
  onClose: () => void;
};

export function ExerciseModal({ exercise, onClose }: ExerciseModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (exercise && !dialog.open) dialog.showModal();
    if (!exercise && dialog.open) dialog.close();
  }, [exercise]);

  return (
    <dialog
      className="exercise-dialog"
      ref={dialogRef}
      aria-labelledby="exercise-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.currentTarget === event.target) event.currentTarget.close();
      }}
    >
      {exercise ? (
        <div className="dialog-content">
          <div className="dialog-heading">
            <div>
              <p className="eyebrow">Guía de técnica</p>
              <h2 id="exercise-dialog-title">{exercise.name}</h2>
            </div>
            <button
              className="icon-button"
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Cerrar guía del ejercicio"
            >
              ×
            </button>
          </div>
          <img
            className="dialog-gif"
            src={exercise.gifUrl}
            alt={`Demostración ampliada de ${exercise.name}`}
          />
          <div className="dialog-meta">
            <span>{exercise.target}</span>
            <span>{exercise.equipment}</span>
          </div>
          <ol className="instructions">
            {exercise.instructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ol>
          <p className="reference-name">
            Referencia del dataset: {exercise.referenceName}
          </p>
        </div>
      ) : null}
    </dialog>
  );
}
