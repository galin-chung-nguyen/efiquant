// CodeEditorWindow.js

import React, { useEffect, useState } from "react";

import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code, theme }: any) => {
  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width={`100%`}
        language={language || "javascript"}
        value={code}
        theme={theme}
        defaultValue="// some comment"
        onChange={(newValue) => onChange("code", newValue)}
      />
    </div>
  );
};
export default CodeEditorWindow;