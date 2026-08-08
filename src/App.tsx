import { useState } from "react";
import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";
import { DailySummary } from "./components/DailySummary";
import { DayTabs } from "./components/DayTabs";
import { ExerciseCard } from "./components/ExerciseCard";
import { ExerciseModal } from "./components/ExerciseModal";
import { RestTimer } from "./components/RestTimer";
import { WorkoutProgress } from "./components/WorkoutProgress";
import { routine, findWorkoutDay } from "./data/routine";
import { useWorkoutStorage } from "./hooks/useWorkoutStorage";
import { createEmptyExerciseLog } from "./lib/storage";
import { formatWorkoutSummary } from "./lib/workout-summary";
import { getIsoWeekId, getWorkoutDayForToday } from "./lib/week";
import type {
  ExerciseDefinition,
  WorkoutDayId,
} from "./types/workout";

const TOTAL_EXERCISES = routine.reduce(
  (total, day) => total + day.exercises.length,
  0,
);

const dayTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, staggerChildren: 0.055 },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.16 } },
};

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.24 } },
};

function App() {
  const weekId = getIsoWeekId();
  const {
    storage,
    getLog,
    updateExerciseLog,
    setActiveDay,
    resetCurrentWeek,
  } = useWorkoutStorage(weekId);
  const [modalExercise, setModalExercise] =
    useState<ExerciseDefinition | null>(null);
  const todayDayId = getWorkoutDayForToday();
  const activeDayId: WorkoutDayId =
    storage.activeDay ?? todayDayId ?? routine[0].id;
  const activeDay = findWorkoutDay(activeDayId);

  const completedByDay = (() => {
    const counts: Record<WorkoutDayId, number> = {
      "lower-a": 0,
      "upper-a": 0,
      "lower-b": 0,
      "upper-b": 0,
      special: 0,
    };

    for (const day of routine) {
      counts[day.id] = day.exercises.filter(
        (exercise) => getLog(day.id, exercise.id)?.completed === true,
      ).length;
    }
    return counts;
  })();

  const completedTotal = Object.values(completedByDay).reduce(
    (total, value) => total + value,
    0,
  );
  const activeCompleted = completedByDay[activeDay.id];
  const summary = formatWorkoutSummary(activeDay, (exercise) =>
    getLog(activeDay.id, exercise.id) ?? createEmptyExerciseLog(exercise),
  );

  function handleReset() {
    const shouldReset = window.confirm(
      `¿Borrar todos los registros de ${weekId}? Las semanas anteriores no se modificarán.`,
    );
    if (shouldReset) resetCurrentWeek();
  }

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
      <div className="app-frame">
      <m.header
        className="masthead"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
      >
        <div className="masthead__rule">
          <span>Developer Chronicle</span>
          <span>{weekId}</span>
        </div>
        <div className="masthead__title-row">
          <div>
            <p className="edition">Training edition · Vol. 01</p>
            <m.h1
              initial={{ letterSpacing: "-0.08em", opacity: 0 }}
              animate={{ letterSpacing: "-0.045em", opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              My Routine
            </m.h1>
          </div>
          <div className="masthead__score" aria-label={`${completedTotal} de ${TOTAL_EXERCISES} ejercicios completados`}>
            <AnimatePresence mode="popLayout" initial={false}>
              <m.strong
                key={completedTotal}
                initial={{ opacity: 0, y: -8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                transition={{ duration: 0.16 }}
              >
                {completedTotal}
              </m.strong>
            </AnimatePresence>
            <span>/ {TOTAL_EXERCISES}</span>
          </div>
        </div>
        <DayTabs
          days={routine}
          activeDay={activeDay.id}
          completedByDay={completedByDay}
          onSelect={setActiveDay}
        />
      </m.header>

      <main className="app-shell">
        {!todayDayId ? (
          <p className="rest-day-notice">
            Hoy es día de descanso. Puedes consultar o completar cualquier sesión.
          </p>
        ) : null}

        <AnimatePresence mode="wait" initial={false}>
        <m.div
          className="day-transition"
          key={activeDay.id}
          variants={dayTransition}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
        <m.section
          className="day-intro"
          aria-labelledby="active-day-title"
          variants={sectionReveal}
        >
          <div>
            <p className="eyebrow">{activeDay.weekday} · Sesión {routine.findIndex(({ id }) => id === activeDay.id) + 1}/5</p>
            <h2 id="active-day-title">{activeDay.title}</h2>
            <p className="day-focus">{activeDay.focus}</p>
          </div>
          <div className="day-score">
            <strong>{activeCompleted}</strong>
            <span>de {activeDay.exercises.length}</span>
          </div>
          <p className="day-note">{activeDay.note}</p>
        </m.section>

        <m.section
          className="exercise-list"
          aria-label={`Ejercicios de ${activeDay.title}`}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.055 } },
          }}
        >
          {activeDay.exercises.map((exercise, index) => {
            const log =
              getLog(activeDay.id, exercise.id) ??
              createEmptyExerciseLog(exercise);

            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                log={log}
                onOpenMedia={setModalExercise}
                onChange={(update) =>
                  updateExerciseLog(activeDay.id, exercise.id, update)
                }
              />
            );
          })}
        </m.section>

        <DailySummary summary={summary} />
        </m.div>
        </AnimatePresence>

        <WorkoutProgress
          days={routine}
          completedByDay={completedByDay}
          completedTotal={completedTotal}
          exerciseTotal={TOTAL_EXERCISES}
        />

        <section className="data-controls" aria-labelledby="data-controls-title">
          <div>
            <p className="eyebrow">Datos locales</p>
            <h2 id="data-controls-title">Esta semana está guardada</h2>
          </div>
          <p>
            Los cambios se guardan automáticamente en este dispositivo. No cierres en
            modo privado si quieres conservarlos.
          </p>
          <button className="text-button" type="button" onClick={handleReset}>
            Reiniciar solo {weekId}
          </button>
        </section>
      </main>

      <footer className="site-footer">
        <p>THE CESAR TIMES · TRAINING EDITION</p>
        <p>
          Referencias: {" "}
          <a
            href="https://github.com/hasaneyldrm/exercises-dataset"
            target="_blank"
            rel="noreferrer"
          >
            exercises-dataset
          </a>
        </p>
        <p>
          © Gym visual — {" "}
          <a href="https://gymvisual.com/" target="_blank" rel="noreferrer">
            gymvisual.com
          </a>
        </p>
      </footer>

      <RestTimer />
      <ExerciseModal
        exercise={modalExercise}
        onClose={() => setModalExercise(null)}
      />
      </div>
      </LazyMotion>
    </MotionConfig>
  );
}

export default App;
