import React, { useEffect } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faPuzzlePiece,
} from "@fortawesome/free-solid-svg-icons";
import VisibilitySensor from "react-visibility-sensor-v2";
import { TECollapse } from "tw-elements-react";

export default React.memo(function Solution(props) {
  let { name, id, SVs, children, actions, callAction } =
    useDoenetRenderer(props);

  let onChangeVisibility = (isVisible) => {
    callAction({
      action: actions.recordVisibilityChange,
      args: { isVisible },
    });
  };

  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible: false },
      });
    };
  }, []);

  if (SVs.hidden) {
    return null;
  }

  let onHeaderClick = () => {
    callAction({
      action:
        SVs.open && SVs.canBeClosed
          ? actions.closeSolution
          : actions.revealSolution,
    });
  };

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <div id={id} className="py-2">
        <a name={id} />
        <button
          className={`${
            SVs.open &&
            `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)]`
          } w-full group relative bg-slate-100 border border-transparent rounded-md transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1`}
          onClick={onHeaderClick}
          onKeyDown={(e) => e.key === "Enter" && onHeaderClick}
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center">
              <span
                className={`${
                  SVs.open ? `rotate-[90deg] ` : `rotate-0 fill-[#212529]`
                } mr-3 flex items-center shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
              >
                <FontAwesomeIcon className="w-4 h-4" icon={faPuzzlePiece} />
              </span>
              Solution (click to {SVs.open ? "close" : "open"})
            </div>
            <span
              className={`${
                SVs.open ? `rotate-[-180deg] ` : `rotate-0 fill-[#212529]`
              } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none`}
            >
              <FontAwesomeIcon icon={faChevronDown} />
            </span>
          </div>
        </button>
        <TECollapse
          show={SVs.open}
          className="!mt-0 !rounded-b-none !shadow-none"
        >
          <div className="w-full px-5 py-4 rounded-none border border-l-0 border-r-0 border-t-0 border-neutral-200">
            {children}
          </div>
        </TECollapse>
      </div>
    </VisibilitySensor>
  );
});
