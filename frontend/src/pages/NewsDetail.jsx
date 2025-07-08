import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axiosFrontend';

function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/news/${id}`)
      .then((res) => {
        setNews(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch news detail:', err);
        setError('找不到對應的新聞資料，請確認網址是否正確。');
      });
  }, [id]);

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 bg-gray-100 min-h-screen">
        <p className="mb-4">{error}</p>
        <Link
          to="/news"
          className="inline-block px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          返回最新消息
        </Link>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center py-10 bg-gray-100 min-h-screen">載入中...</div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow px-6 py-10 text-gray-800">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 text-center mb-6">
          {news.title}
        </h1>
        <img
          src={news.imageUrl}
          alt={news.title}
          onError={(e) => (e.target.src = '/images/default.jpg')}
          className="w-full h-auto rounded-lg shadow mb-6"
          loading="lazy"
        />

        <div className="space-y-4 text-base leading-relaxed">
          {Array.isArray(news.content) &&
            news.content.map((paragraph, idx) => <p key={idx}>{paragraph}</p>)}
        </div>

        <div className="mt-6 space-y-2 text-sm">
          <p>發佈時間：{news.date}</p>
          <p>聯絡信箱：info@icespring.com.tw</p>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/news"
            className="inline-block px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            返回最新消息
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NewsDetail;

