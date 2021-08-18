import { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from "react-redux"
import { ReduxState, store } from "../store"
import { SET_ALERT } from '../store/actions/infos';

const Pos = styled.div<{darkMode: boolean}>`
  position: fixed;
  bottom: 10px;
  left: 10px;
  font-size: 1rem;
  height: 35px;
  background-color: #FFFD;
  border: 1px solid #000;
  padding: 0 10px;
  min-width: 50px;
  text-align: center;
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  user-select: none;
  filter: ${({ darkMode }) => darkMode ? 'invert(1)' : 'invert(0)'};
  cursor: pointer;
`;

export default function CursorPosition() {
  const cursorPos = useSelector((state: ReduxState) => state.cursorPos);
  const pos = useSelector((state: ReduxState) => state.position);
  const darkMode = useSelector((state: ReduxState) => state.darkMode);
  const [showCursorPos, setShowCursorPos] = useState(true);

  const copyPos = () => {
    if (navigator.clipboard) {
      const txt = `#${store?.getState().canvases.find((e) => e.id === store?.getState().currentCanvas)?.letter}(${Math.round(pos.x)},${Math.round(pos.y)},10)`;
      navigator.clipboard.writeText(txt);
      store?.dispatch({ type: SET_ALERT, payload: { show: true, text: 'clipboard', color: "#FFFD" }})
    }
  }

  const toShow = showCursorPos ? cursorPos : pos;

  return (
    <Pos
      darkMode={darkMode}
      onClick={copyPos}
      onMouseEnter={() => setShowCursorPos(false)}
      onMouseLeave={() => setShowCursorPos(true)}
    >
      ({Math.round(toShow.x)}, {Math.round(toShow.y)})
    </Pos>
  );
}