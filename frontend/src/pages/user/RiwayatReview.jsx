import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4.5H14M4.5 8H11.5M7 11.5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function RiwayatReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      // Assuming a similar endpoint for fetching the user's reviews
      // If it doesn't exist yet, it might return a 404, handled gracefully.
      const response = await axiosClient.get("/reviews/me");
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-8">
      <section className="flex flex-col gap-6 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 leading-7">Riwayat Review</h2>
            <p className="text-sm text-gray-500 leading-5">Daftar ulasan yang telah Anda berikan</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
              <FilterIcon />
              Filter
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left text-xs font-bold text-gray-400 px-8 py-5">Review ID</th>
                  <th className="text-left text-xs font-bold text-gray-400 px-6 py-5">Salon</th>
                  <th className="text-left text-xs font-bold text-gray-400 px-6 py-5">Rating</th>
                  <th className="text-left text-xs font-bold text-gray-400 px-6 py-5">Komentar</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500 text-sm">Memuat data...</td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500 text-sm">Belum ada riwayat ulasan</td>
                  </tr>
                ) : (
                  reviews.map((row, idx) => (
                    <tr key={row.id} className={idx > 0 ? "border-t border-gray-50" : ""}>
                      <td className="px-8 py-6 text-sm font-bold text-gray-700 whitespace-nowrap">
                        Review #{row.id}
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-500 whitespace-nowrap">ID Salon: {row.salon_id}</td>
                      <td className="px-6 py-6 text-sm font-bold text-yellow-500 whitespace-nowrap">
                        {row.rating} / 5
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-600 truncate max-w-xs">
                        {row.comment}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
