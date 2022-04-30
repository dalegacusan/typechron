import React from "react";
import { Text } from "@mantine/core";
import { ArrowBigDown, ArrowBigTop } from "tabler-icons-react";

interface WpmProps {
  wpm: string;
  isWpmIncreased: boolean | undefined;
}

const Wpm = (props: WpmProps) => {
  const { wpm, isWpmIncreased } = props;

  return (
    <>
      {isWpmIncreased ? <ArrowBigTop /> : <ArrowBigDown />}
      <Text>{wpm} wpm</Text>
    </>
  );
};

export default Wpm;
