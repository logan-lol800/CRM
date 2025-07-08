import img1 from '../assets/banner.jpg';

export default function About() {
  return (
    <div className="min-h-screen">
      <div className="w-[90%] max-w-screen-xl mx-auto py-6 text-gray-700">
        {/* 第一區塊：品牌使命 */}
        <section className="mb-16">
          <div className="flex items-center justify-between">
            {/* 左邊主標題 */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray">
              良野冰品
            </h2>
            {/* 右邊副標 */}
            <span className="text-lg sm:text-xl md:text-2xl font-medium">
              夏天的唯一選擇
            </span>
          </div>
          <img
            src={img1}
            alt="品牌使命圖片"
            className="w-full h-auto rounded-lg shadow-md mb-6 object-cover max-h-[400px] mx-auto"
          />
          <p className="text-base sm:text-lg leading-relaxed text-gray-700 text-justify">
            <strong>良野義式冰品</strong>誕生於對氣候變遷與資源浪費的深刻關懷。我們堅信：改變飲食習慣，是邁向永續未來的第一步。
            因此，我們以義式冰淇淋為載體，輕鬆友善地將純素（Vegan）飲食帶入大眾日常。不僅為素食者與乳糖不耐者提供美味新選擇，
            也邀請每一位顧客，以一份冰品支持環境永續與健康理念。我們的終極目標，是打造營養與口感皆不遜於動物性產品的植物系冰品，
            讓每一次享用都成為對地球友善的行動。
          </p>
        </section>

        {/* 第二區塊：組織文化 */}
        <section>
          <h2 className="flex items-center justify-between text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center text-gray-700">
            關懷是我們的文化，理想是我們的溫度
          </h2>
          <img
            src={img1}
            alt="組織文化圖片"
            className="w-full h-auto rounded-lg shadow-md mb-6 object-cover max-h-[400px] mx-auto"
          />
          <p className="text-base sm:text-lg leading-relaxed text-gray-700 text-justify">
            在良野，我們相信企業存在的價值，不只是營利，更是共好。我們打造的是一個「以人為本、以願景為動力」的團隊文化。
            每一位夥伴都獲得高於法規的待遇與持續成長的機會，並透過文化沙龍、職能訓練，實踐「把工作當成一種創造未來的方式」。
            我們追求的不僅是產品的品質，更是讓每一位加入良野的人，都能為推動更美好的飲食世界感到驕傲。
          </p>
        </section>
      </div>
    </div>
  );
}