function PromotionVideoPage() {
  return (
    <main className="bg-white pt-8 sm:pt-10 lg:pt-12">
      <section className="w-full">
        <div className="relative overflow-hidden bg-[#111] shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
          <div className="relative aspect-video w-full sm:aspect-[16/8] lg:aspect-[16/6]">
            <iframe
              className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.7777777778vh] min-w-full -translate-x-1/2 -translate-y-1/2"
              src="https://www.youtube.com/embed/qp_rz-fYDVo?autoplay=1&mute=1&playsinline=1&loop=1&playlist=qp_rz-fYDVo&rel=0"
              title="ZEAL Creations promotion video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </main>
  )
}

export default PromotionVideoPage