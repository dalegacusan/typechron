import React from "react";

interface GameTimeProps {
  seconds: number;
  milliseconds: number;
}

const GameTime = ({ seconds, milliseconds }: GameTimeProps) => {
  return `${seconds}:${milliseconds}s`;
};

export default GameTime;
