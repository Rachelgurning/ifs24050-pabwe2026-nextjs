import { useState, ChangeEvent } from "react";

type InputReturn = [
  string,
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  () => void
];

export const useInput = (defaultValue: string = ""): InputReturn => {
  const [value, setValue] = useState<string>(defaultValue);

  const onValueChangeHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(event.target.value);
  };

  const resetValue = () => {
    setValue("");
  };

  return [value, onValueChangeHandler, resetValue];
};