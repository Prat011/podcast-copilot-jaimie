import React, {useState} from 'react';
import { SearchIcon } from 'lucide-react';

const VideoSection: React.FC = () => {
  const [videoId, setVideoId] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const extractedId = extractVideoId(searchInput);
    if (extractedId) {
      setVideoId(extractedId);
    } else {
      alert("Invalid YouTube URL. Please enter a valid YouTube video URL.");
    }
  };

  return (
    <div className="w-2/3 p-6">
      <div className="bg-white rounded-2xl shadow-lg h-full p-6 flex flex-col">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700">Podcast Video</h2>
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter YouTube Video URL"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-grow px-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
          <button 
            type="submit" 
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 flex items-center"
          >
            <SearchIcon className="w-5 h-5 mr-2" />
            Load Video
          </button>
        </form>
        <div className="flex-grow bg-gray-100 rounded-xl overflow-hidden">
          {videoId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded-xl"
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No video loaded
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
