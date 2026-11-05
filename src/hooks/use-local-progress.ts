"use client";

import { useCallback, useEffect, useState } from "react";
import {
  emptyProgress,
  loadProgress,
  markLessonComplete,
  recordSubmission,
  touchLastItem,
  type LocalProgress,
  type SubmissionStatus,
} from "@/lib/progress";

export function useLocalProgress() {
  const [progress, setProgress] = useState<LocalProgress>(emptyProgress);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setProgress(loadProgress());
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
  }, [refresh]);

  const completeLesson = useCallback((slug: string) => {
    setProgress(markLessonComplete(slug));
  }, []);

  const touch = useCallback((kind: "lesson" | "problem", slug: string) => {
    setProgress(touchLastItem(kind, slug));
  }, []);

  const submit = useCallback(
    (input: {
      slug: string;
      title: string;
      status: SubmissionStatus;
      runtimeMs: number;
      pembahasan?: string;
    }) => {
      setProgress(recordSubmission(input));
    },
    [],
  );

  return { progress, ready, completeLesson, touch, submit, refresh };
}
