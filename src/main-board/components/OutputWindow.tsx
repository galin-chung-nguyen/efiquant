import React from "react";

const OutputWindow = ({ outputDetails }: any) => {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;

    return (
      <pre className="px-2 py-1 font-normal text-xs text-green-500">
        {(outputDetails.stdout) !== null
          ? `${(outputDetails.stdout)}`
          : null}
      </pre>
    );
  };

  const getError = () => {
    let statusId = outputDetails?.status?.id;
    if (statusId !== 3) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {(outputDetails?.stderr)}
        </pre>
      );
    }
    return (<></>)
  }
  return (
    <>
      <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
        Output
      </h1>
      <div className="w-full h-56 bg-white border-2 border-black rounded-md text-white font-normal text-sm overflow-y-auto">
        {outputDetails ? <>{getOutput()}</> : null}
        {outputDetails ? <>{getError()}</> : null}
      </div>
    </>
  );
};

export default OutputWindow;