import { useState, useCallback, useRef } from 'react';

export function useForm<T>(control: T): [T, () => void] {
  const [, setTick] = useState(0);
  const form = useRef(control);
  const notify = useCallback(() => setTick(t => t + 1), [form]);
  return [form.current, notify];
}