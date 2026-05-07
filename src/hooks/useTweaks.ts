import { useCallback, useState } from 'react';

export function useTweaks<T extends Record<string, unknown>>(defaults: T) {
  const [values, setValues] = useState<T>(defaults);

  const setTweak = useCallback(
    (keyOrEdits: Partial<T> | keyof T, val?: unknown) => {
      const edits =
        typeof keyOrEdits === 'object' && keyOrEdits !== null
          ? (keyOrEdits as Partial<T>)
          : ({ [keyOrEdits as string]: val } as Partial<T>);
      setValues((prev) => ({ ...prev, ...edits }));
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
      window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
    },
    []
  );

  return [values, setTweak] as const;
}
