import React from "react";
import useDoenetRenderer from "../useDoenetRenderer";

export default React.memo(function Nbsp(props) {
  let { SVs } = useDoenetRenderer(props, false);

  if (SVs.hidden) {
    return null;
  }

  return <>&nbsp;</>;
});
