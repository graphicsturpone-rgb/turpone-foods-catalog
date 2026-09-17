import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="site-main post-9 page type-page status-publish hentry" id="content">
      <div className="page-content">
        <div className="elementor elementor-9" data-elementor-id="9" data-elementor-post-type="page" data-elementor-type="wp-page">
          
          {/* Hero Section */}
          <div className="elementor-element elementor-element-0aa0206 e-flex e-con-boxed e-con e-parent relative w-full min-h-[600px] flex items-center bg-cover bg-center" style={{ backgroundImage: "url('/assets/images/web-image.webp')" }}>
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="e-con-inner relative z-10 w-full max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="elementor-element elementor-element-3c64227 e-con-full glass-effect e-flex e-con e-child flex flex-col items-start backdrop-blur-md bg-white/10 p-10 rounded-2xl border border-white/20 shadow-2xl text-white">
                <div className="elementor-element elementor-element-8b863b2 elementor-widget elementor-widget-image-box">
                  <div className="elementor-image-box-wrapper">
                    <div className="elementor-image-box-content">
                      <h1 className="elementor-image-box-title text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-md" data-cms-id="hero.title">Premium Martha Stewart Food Products</h1>
                      <p className="elementor-image-box-description text-xl md:text-2xl font-medium mb-6 drop-shadow" data-cms-id="hero.subtitle">Engineered for Growth.<br/>Scaled for Impact.</p>
                    </div>
                  </div>
                </div>
                <div className="elementor-element elementor-element-80d7242 elementor-widget elementor-widget-text-editor">
                  <div className="elementor-widget-container">
                    <p className="text-base md:text-lg mb-8 drop-shadow text-neutral-100">Turpone Foods is a multi-divisional corporation focused on bringing innovation, sustainability, and commercialization to food and food-related products, proudly serving as an exclusive brand partner for Martha Stewart's Food Products. We leverage a vast global network of manufacturing partners, retailers, and distributors, to bring your idea to market.</p>
                  </div>
                </div>
                <div className="elementor-element elementor-element-ab55902 e-con-full e-flex e-con e-child flex flex-col sm:flex-row gap-4 w-full">
                  <div className="elementor-element elementor-element-e38269b elementor-widget elementor-widget-button">
                    <div className="elementor-widget-container">
                      <div className="elementor-button-wrapper">
                        <Link href="/services" className="elementor-button elementor-size-sm elementor-animation-bob px-8 py-3 bg-white text-black text-center font-semibold rounded-full hover:bg-neutral-200 transition shadow-lg hover:scale-105 inline-block">
                          <span className="elementor-button-content-wrapper"><span className="elementor-button-text">Explore Turpone Foods</span></span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="elementor-element elementor-element-c845f84 elementor-widget elementor-widget-button">
                    <div className="elementor-widget-container">
                      <div className="elementor-button-wrapper">
                        <Link href="/about-us" className="elementor-button elementor-size-sm elementor-animation-bob px-8 py-3 bg-transparent border-2 border-white text-center text-white font-semibold rounded-full hover:bg-white/10 transition shadow-lg hover:scale-105 inline-block">
                          <span className="elementor-button-content-wrapper"><span className="elementor-button-text">Our Vision</span></span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block"></div>
            </div>
          </div>

          {/* Architecture of Scale Section */}
          <div className="elementor-element elementor-element-bdd79f8 e-flex e-con-boxed e-con e-parent py-24 bg-neutral-50 w-full">
            <div className="e-con-inner w-full max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="elementor-element elementor-element-406b6fe e-con-full e-flex e-con e-child flex flex-col text-left">
                <div className="elementor-element elementor-element-8794757 elementor-widget elementor-widget-image-box">
                  <div className="elementor-widget-container">
                    <div className="elementor-image-box-wrapper">
                      <div className="elementor-image-box-content">
                        <h3 className="elementor-image-box-title text-4xl font-bold tracking-tight text-neutral-900 mb-6">The Architecture of Scale</h3>
                        <p className="elementor-image-box-description text-lg text-neutral-600">We don't just invest; we integrate. Our methodology focuses on three pillars;<br/>Structured Growth, Operational Excellence, and Long-Term Focus.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-576dd45 e-con-full e-flex e-con e-child flex flex-col gap-8">
                {/* Pillar 1 */}
                <div className="elementor-element elementor-element-f922b06 elementor-widget elementor-widget-icon-box flex flex-row items-center text-left bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition">
                  <div className="elementor-widget-container flex flex-row items-center">
                    <div className="elementor-icon-box-icon w-16 h-16 bg-neutral-100 text-neutral-900 rounded-full flex items-center justify-center shrink-0 mr-6">
                      <span className="elementor-icon">
                        <svg aria-hidden="true" className="e-font-icon-svg e-fas-balance-scale w-8 h-8 fill-current" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 336h-.02c0-16.18 1.34-8.73-85.05-181.51-17.65-35.29-68.19-35.36-85.87 0C-2.06 328.75.02 320.33.02 336H0c0 44.18 57.31 80 128 80s128-35.82 128-80zM128 176l72 144H56l72-144zm511.98 160c0-16.18 1.34-8.73-85.05-181.51-17.65-35.29-68.19-35.36-85.87 0-87.12 174.26-85.04 165.84-85.04 181.51H384c0 44.18 57.31 80 128 80s128-35.82 128-80h-.02zM440 320l72-144 72 144H440zm88 128H352V153.25c23.51-10.29 41.16-31.48 46.39-57.25H528c8.84 0 16-7.16 16-16V48c0-8.84-7.16-16-16-16H383.64C369.04 12.68 346.09 0 320 0s-49.04 12.68-63.64 32H112c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h129.61c5.23 25.76 22.87 46.96 46.39 57.25V448H112c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h416c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z"></path></svg>
                      </span>
                    </div>
                    <div className="elementor-icon-box-content">
                      <h3 className="elementor-icon-box-title text-xl font-bold text-neutral-900 mb-2"><span>Structured Growth</span></h3>
                      <p className="elementor-icon-box-description text-neutral-600">Analysis of Financial Capabilities, Product Capacity and Market Potential.</p>
                    </div>
                  </div>
                </div>
                {/* Pillar 2 */}
                <div className="elementor-element elementor-element-b998b55 elementor-widget elementor-widget-icon-box flex flex-row items-center text-left bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition">
                  <div className="elementor-widget-container flex flex-row items-center">
                    <div className="elementor-icon-box-icon w-16 h-16 bg-neutral-100 text-neutral-900 rounded-full flex items-center justify-center shrink-0 mr-6">
                      <span className="elementor-icon">
                        <svg aria-hidden="true" className="e-font-icon-svg e-fas-bolt w-8 h-8 fill-current" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-1.7 275.2 9.5 288 24 288h118.7L96.6 482.5c-3.6 15.2 8 29.5 23.3 29.5 8.4 0 16.4-4.4 20.8-12l176-304c9.3-15.9-2.2-36-20.7-36z"></path></svg>
                      </span>
                    </div>
                    <div className="elementor-icon-box-content">
                      <h3 className="elementor-icon-box-title text-xl font-bold text-neutral-900 mb-2"><span>Operational Excellence</span></h3>
                      <p className="elementor-icon-box-description text-neutral-600">Seamless flow from manufacturing to delivery, supported by precise financial oversight, efficient logistics, and disciplined process management.</p>
                    </div>
                  </div>
                </div>
                {/* Pillar 3 */}
                <div className="elementor-element elementor-element-9fb3feb elementor-widget elementor-widget-icon-box flex flex-row items-center text-left bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition">
                  <div className="elementor-widget-container flex flex-row items-center">
                    <div className="elementor-icon-box-icon w-16 h-16 bg-neutral-100 text-neutral-900 rounded-full flex items-center justify-center shrink-0 mr-6">
                      <span className="elementor-icon">
                        <svg aria-hidden="true" className="e-font-icon-svg e-fas-bullseye w-8 h-8 fill-current" viewBox="0 0 496 512" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm0 432c-101.69 0-184-82.29-184-184 0-101.69 82.29-184 184-184 101.69 0 184 82.29 184 184 0 101.69-82.29 184-184 184zm0-312c-70.69 0-128 57.31-128 128s57.31 128 128 128 128-57.31 128-128-57.31-128-128-128zm0 192c-35.29 0-64-28.71-64-64s28.71-64 64-64 64 28.71 64 64-28.71 64-64 64z"></path></svg>
                      </span>
                    </div>
                    <div className="elementor-icon-box-content">
                      <h3 className="elementor-icon-box-title text-xl font-bold text-neutral-900 mb-2"><span>Long-Term Focus</span></h3>
                      <p className="elementor-icon-box-description text-neutral-600">A scalable, efficient operation that supports consistent growth and reliable delivery.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Martha Stewart Section */}
          <div className="elementor-element elementor-element-dcb418f e-flex e-con-boxed e-con e-parent relative w-full min-h-[500px] flex items-center bg-cover bg-center" style={{ backgroundImage: "url('/assets/images/Turpone-Pantry-Banner.webp')" }}>
            <div className="e-con-inner w-full max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="elementor-element elementor-element-b9a1400 e-con-full e-flex e-con e-child hidden md:block"></div>
              <div className="elementor-element elementor-element-da6ef77 e-con-full glass-effect e-flex e-con e-child flex flex-col items-center md:items-start text-center md:text-left text-white backdrop-blur-md bg-white/10 p-10 rounded-2xl border border-white/20 shadow-2xl">
                <div className="elementor-element elementor-element-6a3824b elementor-widget elementor-widget-image-box w-full">
                  <div className="elementor-widget-container">
                    <div className="elementor-image-box-wrapper">
                      <figure className="elementor-image-box-img mb-6">
                        <Image src="/assets/images/MSK_Logo.webp" alt="Martha Stewart Logo" width={200} height={200} className="elementor-animation-float w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-xl animate-[float_4s_ease-in-out_infinite]" />
                      </figure>
                      <div className="elementor-image-box-content">
                        <h3 className="elementor-image-box-title text-3xl md:text-4xl font-bold tracking-tight mb-4 drop-shadow">Martha Stewart</h3>
                        <p className="elementor-image-box-description text-lg mb-8 max-w-md drop-shadow text-neutral-100">Martha Stewart’s food philosophy focuses on elevated home cooking, emphasizing fresh, seasonal ingredients, meticulous preparation, and beautiful presentation.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="elementor-element elementor-element-56c6d20 elementor-widget elementor-widget-button w-full flex justify-center md:justify-start">
                  <div className="elementor-widget-container">
                    <div className="elementor-button-wrapper">
                      <Link href="/turpone-products" className="elementor-button elementor-size-sm elementor-animation-bob px-8 py-3 bg-white text-black text-center font-semibold rounded-full hover:bg-neutral-200 transition shadow-lg hover:scale-105 inline-block">
                        <span className="elementor-button-content-wrapper"><span className="elementor-button-text">Learn More</span></span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
