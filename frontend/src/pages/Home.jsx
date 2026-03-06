import { useState } from "react";
import UploadBox from "../components/UploadBox";
import ResultCard from "../components/ResultCard";

export default function Home() {

  const [result, setResult] = useState(null);

  return (
    <div className="flex flex-col items-center mt-20">

      <UploadBox setResult={setResult} />

      <ResultCard result={result} />

    </div>
  );
}