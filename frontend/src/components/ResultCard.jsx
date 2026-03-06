export default function ResultCard({ result }) {

  if (!result) return null;

  return (
    <div className="bg-green-100 p-6 rounded-xl mt-6 text-center">

      <h2 className="text-lg font-bold mb-2">
        Compression Complete
      </h2>

      <p className="mb-3">{result.name}</p>

      <a
        href={result.url}
        download
        className="bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        Download Compressed File
      </a>

    </div>
  );
}