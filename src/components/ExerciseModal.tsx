import { useEffect, useRef } from "react";
import { m } from "motion/react";
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
        <m.div
          className="dialog-content"
          key={exercise.id}
          initial={{ opacity: 0, y: 14, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.26 }}
        >
          <div className="dialog-heading">
            <div>
              <p className="eyebrow">Guía de técnica</p>
              <h2 id="exercise-dialog-title">{exercise.name}</h2>
            </div>
            <m.button
              className="icon-button"
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Cerrar guía del ejercicio"
              whileTap={{ scale: 0.9, rotate: 4 }}
              whileHover={{ rotate: 4 }}
            >
              ×
            </m.button>
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
        </m.div>
      ) : null}
    </dialog>
  );
}
