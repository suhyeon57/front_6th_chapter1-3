/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  memo,
  type PropsWithChildren,
  useCallback,
  useContext,
  useReducer,
  useMemo,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { Toast } from "./Toast";
import { createActions, initialState, toastReducer, type ToastType } from "./toastReducer";
import { debounce } from "../../utils";

type ShowToast = (message: string, type: ToastType) => void;
type Hide = () => void;

//action context 설정
const ToastActionsContext = createContext<{
  show: ShowToast;
  hide: Hide;
}>({
  show: () => null,
  hide: () => null,
});

//state context 설정
const ToastStateContext = createContext<{
  message: string;
  type: ToastType;
}>({
  ...initialState,
});

const DEFAULT_DELAY = 3000;

//커스텀 훅 : 자주 사용하는 로직을 커스텀 훅으로 묶음(외부에서도 사용 가능)
export const useToastCommand = () => {
  const { show, hide } = useContext(ToastActionsContext);
  return { show, hide };
};

export const useToastState = () => {
  const { message, type } = useContext(ToastStateContext);
  return { message, type };
};

export const ToastProvider = memo(({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);
  const { show, hide } = useRef(createActions(dispatch)).current; //useRef를 사용하였기 때문에 리렌더링과 무관하게 고정된 값 유지
  const visible = state.message !== "";

  const hideAfter = debounce(hide, DEFAULT_DELAY);

  const showWithHide: ShowToast = useCallback((...args) => {
    show(...args);
    hideAfter();
  }, []); //의존성 배열을 빈 배열로 설정하여 최초 렌더링 시에만 실행되도록 함

  const context = useMemo(() => ({ show: showWithHide, hide }), [showWithHide, hide]); //showWithHide와 hide가 변하지 않으므로 변하지 않음

  return (
    <ToastActionsContext value={context}>
      <ToastStateContext value={state}>
        {children}
        {visible && createPortal(<Toast />, document.body)}
      </ToastStateContext>
    </ToastActionsContext>
  );
});
