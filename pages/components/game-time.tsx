import React from "react";

interface GameTimeProps {
  seconds: number;
  milliseconds: number;
}

const GameTime = ({ seconds, milliseconds }: GameTimeProps) => {
  return (
    <span>
      {seconds}:{milliseconds}
    </span>
  );
};

export default GameTime;
