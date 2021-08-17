import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { ReduxState } from '../store';
import { SET_SELECTED_COLOR } from '../store/actions/painting';
import palette from '../../constants/palette';
import { getCanvasController } from '../controller/CanvasController';
import { BottomButton } from './Chat';
import { Grid } from 'react-feather';
import { useEffect, useState } from 'react';
import { SET_SHOW_PALETTE } from '../store/actions/parameters';

const Container = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10px;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  gap: 5px;
`;
const OpenButton = styled(BottomButton)`

`;
const Palette = styled.div<{ show: boolean }>`
  padding: 3px;
  background-color: #FFF;
  border: 1px solid #000;
  overflow: hidden;

  display: flex;
  flex-flow: column wrap;

  height: calc(30*25px);
  transition: 0.5s;

  @media (max-height: 800px) {
    height: calc(15 * 25px);
    width: calc(2 * 25px);
  }
  @media (max-height: 400px) {
    height: calc(6 * 25px);
    width: calc(5 * 25px);
  }
  ${({ show }) => !show && css`
    height: 0px !important;
  `};
`;
const PaletteButton = styled.div<{selected: boolean}>`
  width: 25px;
  height: 25px;
  cursor: pointer;
  transition: 0.2s;
  box-sizing: border-box;
  &:hover {
    transform: scale(1.1);
    box-shadow: 0px 0px 5px #444;
  }
  ${({ selected }) => selected && `
    transform: scale(1.1);
    box-shadow: 0px 0px 5px #444;
    border: 1px solid #FFF;
    z-index: 10;
  `}
`;

export default function PaletteList() {
  const dispatch = useDispatch();
  const selectedColor = useSelector((state: ReduxState) => state.selectedColor);
  const darkMode = useSelector((state: ReduxState) => state.darkMode);
  const showPalette = useSelector((state: ReduxState) => state.showPalette);
  const [display, setDisplay] = useState(true);

  useEffect(() => {
    if (!display && showPalette) {
      const t = setTimeout(() => {
        setDisplay(true)
      }, 0);
      return () => clearTimeout(t);
    }
    if (display && !showPalette) {
      setDisplay(false);
    }
  }, [showPalette]);
  useEffect(() => {
    if (!display && showPalette) {
      const t = setTimeout(() => {
        dispatch({ type: SET_SHOW_PALETTE, payload: false });
      }, 500);
      return () => clearTimeout(t);
    }
  }, [display]);

  return (
    <Container>
      <OpenButton darkMode={darkMode} onClick={() => { showPalette ? setDisplay(!display) : dispatch({ type: SET_SHOW_PALETTE, payload: !showPalette }) }}>
        <Grid/>
      </OpenButton>
      { showPalette && (
        <Palette show={display}>
          {palette.map((color, i) => (
            <PaletteButton
              key={i}
              selected={selectedColor === color}
              style={{
                backgroundColor: color,
                transform: selectedColor === color ? "scale(1.2)" : '',
              }}
              onClick={() => {
                dispatch({
                  type: SET_SELECTED_COLOR,
                  payload: color,
                });
                getCanvasController()?.canvas.focus();
              }}
            />
          ))}
        </Palette>
      )}
    </Container>
  );
}