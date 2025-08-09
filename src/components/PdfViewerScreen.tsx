import React, { useEffect } from "react";

interface Props {
  pageKey: string;
  fallbackPath?: string;
  preloadedFileUrl?: string | null;
  onPage1Rendered?: () => void;
}

const PdfViewerScreen: React.FC<Props> = ({ fallbackPath, preloadedFileUrl, onPage1Rendered }) => {
  useEffect(() => {
    onPage1Rendered?.();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h2 className="mb-4">PDF Viewer (stub)</h2>
        <p>preloadedFileUrl: {preloadedFileUrl ? "yes" : "no"}</p>
        <p>fallbackPath: {fallbackPath}</p>
      </div>
    </div>
  );
};

export default PdfViewerScreen;
