import Link from 'next/link'

export const metadata = {
  title: 'Story | Kome Buang Kita Kutip',
  description: 'The story behind Kome Buang Kita Kutip - Community Waste Utility',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/" className="text-lg font-bold text-gray-800 hover:text-primary">
            Kome Buang Kita Kutip
          </Link>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Story</h1>
        <p className="text-gray-600 mb-4">
          Kome Buang Kita Kutip is a community waste utility that connects people who want to dispose of waste (Pembuang Sampah) with collectors (Pengutip Sampah).
        </p>
        <p className="text-gray-600 mb-4">
          Request a pickup, set your location and time, and a collector can accept and complete the job. Simple and local.
        </p>

        <h2 className="text-lg font-semibold text-gray-800 mb-3 mt-6">The story behind it</h2>
        <p className="text-gray-600 mb-4 text-justify">
          Ceritanya... Awok tingge di kampung. Kuale. Plastik sampoh di romoh tu tiap hari semedang penuh. Sehari paling kurang satu beg pelestik. Seminggu udoh penuh satu beg plastik hitam besor. Nama pun kampung, mana ada lori sampoh kutip. Deme bakor je takpun humban ke sungei.
        </p>
        <p className="text-gray-600 mb-4 text-justify">
          Tapi itu le, awok ada kesedaran. Sbb cikgu Sains sekolah rendah dulu kabo jgn buang sampoh ke sungei. Bakor pun jangan. Pencemaran alam kabonye. Open burning kot yak namanya.
        </p>
        <p className="text-gray-600 mb-4 text-justify">
          Berbalik kpd cerita tadi, ate awok le yg tiap minggu angkut sampoh bawak masuk rete. Angkut sampe ke tong sampoh besor nun tengah pekan sana. Masalahnya, nak ke pekan saja dah jauh. Rete bau sampoh usoh cerita le. Melekat baunya. Belum cerita plastik sampoh bocor berecor recor ke apa ke. Lagi teruk dari tumpoh ayor sotong… Itu le bawok sampoh, itu le bawok g roje, itu le bawok jalan. Ngam. Mmg bau bekas2 bau sampoh tu udoh jadi default bau rete tu.
        </p>
        <p className="text-gray-600 mb-4 text-justify">
          Masalah ni sama dgn masalah masa duduk kat rumah flat dulu. Orang kadang maleh turun angkut sampah pergi ke tong sampoh besor. Kadang ada yg nak buang kipas la, meja la, mesin basuh la, almari la, basika la. Masalahnya deme maleh nak ngangkut bawak turun. Nak kena tggu lift yg pelan bebeno. Yg penuh org time peak hour. Org rame2, kita bawak sampah busuk. Cantek. Turun, jalan ke tong sampah, naik balik saja dah mau 15 menet kadang. Masa beli mmg le ada org angkutkan katah. Bila nak buang mana ada org nk bwakkan. Tambah, lif ada berapa je. Itu pun belum tentu elok. Semedang rosok. Ate berbulan le barang deme nak buang tu tersade tepi koridor…..mmg sakit mata.
        </p>
        <p className="text-gray-600 mb-4 text-justify">
          Rasa nak je offer, pakcik, nak saya tolong buangkan? Upah 2 rengget. Ok dah. Maleh cerita panjang. Senang cerita gitu le. Maleh buang sampah? Upah je orang utk buangkan. Macam Grab tapi utk buang sampah. Mcm Lalamove tp utk buang sampah. Gitu. Takyah mehe2.
        </p>
        <p className="text-gray-600 mb-4 text-justify">
          Benda ni tak praktikal utk tmpt yg ada lori sampah kutip. Ini utk kampung2 yg lori sampah tak kutip, nak hantar ke tong sampah besar jauh yakmat, utk org duduk rumah tinggi yg maleh turun gi buang sampah. Yg rasa macam, baik aku bayar 2 rengget, masalah selesai. Kalo skali turun dapat tlg buang 10 beg, dah 20 rengget. dapat 2 matcha atau kopi. Ye dok?
        </p>

        <Link href="/" className="inline-block mt-4 text-primary font-semibold hover:underline">
          Back to app
        </Link>
      </main>
    </div>
  )
}
