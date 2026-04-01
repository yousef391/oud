"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { perfumes } from "@/data/perfumes";
import algeriaData from "@/data/algeria.json";
import Image from "next/image";
import AccordsChart from "./AccordsChart";

function getDeliveryPrice(wilayaId: number) {
  if (wilayaId === 16) return 400; // Alger
  if ([9, 35, 42].includes(wilayaId)) return 500; // Algiers nearby
  const southWilayas = [1, 8, 11, 30, 32, 33, 37, 39, 47, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58];
  if (southWilayas.includes(wilayaId) || wilayaId > 58) return 1200; // South
  return 800; // Rest of North/High Plains
}

const PerfumeShowcase: React.FC = () => {
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const perfume = perfumes[0];
  
  const communesForWilaya = selectedWilaya ? algeriaData.communes.filter(c => c.wilaya_id.toString() === selectedWilaya) : [];
  const deliveryPrice = selectedWilaya ? getDeliveryPrice(parseInt(selectedWilaya)) : 0;
  const productPrice = parseFloat(perfume.price.replace(/[^\d]/g, ""));
  const totalPrice = productPrice + deliveryPrice;

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const wilayaObj = algeriaData.wilayas.find(w => w.wilaya_id.toString() === selectedWilaya);

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          wilaya: wilayaObj ? `${wilayaObj.wilaya_id} - ${wilayaObj.wilaya_name_latin}` : selectedWilaya,
          commune: selectedCommune,
          item: perfume.name,
          color: "100ml EDP",
          size: "Unique", // Only one size
          price: perfume.price,
          delivery: deliveryPrice,
          total: `${totalPrice.toLocaleString()} DA`
        })
      });
      
      if (res.ok) {
        setOrderSuccess(true);
        
        type FBQ = (action: string, event: string, params?: Record<string, unknown>) => void;
        if (typeof window !== "undefined" && (window as unknown as { fbq?: FBQ }).fbq) {
          ((window as unknown as { fbq: FBQ }).fbq)('track', 'Purchase', {
            currency: 'DZD',
            value: totalPrice,
            content_name: perfume.name,
            content_category: perfume.productType,
            content_type: 'product',
          });
        }

        setTimeout(() => {
          setOrderSuccess(false);
        }, 3000);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <motion.div
      className="relative w-screen min-h-screen lg:min-h-screen overflow-x-hidden flex flex-col font-sans text-white pb-20 lg:pb-0"
      animate={{ backgroundColor: perfume.bg }}
      transition={{ duration: 0.6 }}
    >
      {/* ────── HEADER (Desktop Only) ────── */}
      <header className="hidden lg:flex relative z-30 justify-between items-center px-10 py-8 shrink-0 w-full">
        <div className="w-40" /> {/* Left Spacer to keep Delivery centered */}
        <div className="flex items-center bg-black/40 backdrop-blur-md rounded-full px-5 py-2.5 gap-3 border border-amber-900/30 shadow-xl shadow-black/50">
          <span className="text-2xl leading-none mt-[-2px]">🇩🇿</span>
          <span className="text-amber-100 font-black tracking-widest uppercase text-sm drop-shadow-md">
            Livraison 58 Wilayas
          </span>
          <span className="text-2xl leading-none mt-[-2px]">🇩🇿</span>
        </div>
        <div className="w-20" /> {/* Spacer */}
      </header>

      {/* ────── MOBILE LAYOUT ────── */}
      <div className="flex flex-col lg:hidden flex-1 px-4 pt-3 pb-6 gap-6 w-full">
        


        {/* Product Image Box with Floating Badges */}
        <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-black/20 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex-shrink-0 z-40">
          <AnimatePresence mode="wait">
            <motion.div
              key={perfume.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full h-full"
            >
              <Image unoptimized src={perfume.image} alt={perfume.name} fill className="object-cover pointer-events-none" priority />
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none z-50">
             <div className="bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1.5 flex items-center gap-1.5 shadow-md border border-amber-900/30">
                <span className="text-[12px] leading-none">🇩🇿</span>
                <span className="text-amber-100 font-bold tracking-wider uppercase text-[9px]">
                  Livraison 58 Wilayas
                </span>
             </div>
             <div className="bg-[#bf6c22]/90 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20 w-fit shadow-lg">
                <span className="text-white font-bold tracking-widest uppercase text-[9px]">
                  {perfume.tag}
                </span>
             </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col w-full gap-5">
           <div className="flex justify-between items-start z-30">
             <div className="flex flex-col">
               <h1 className="text-amber-100 text-[1.7rem] sm:text-4xl font-black uppercase leading-[1.05] tracking-tighter w-full max-w-[220px]">
                 {perfume.name}
               </h1>
               <div className="flex items-center gap-1 mt-1.5">
                 <span className="text-[#fbbf24] text-[13px] tracking-widest">★★★★★</span>
                 <span className="text-white/60 text-[11px] ml-1 font-medium">4.9 (250+ avis)</span>
               </div>
             </div>
             
             <span className="text-white text-[1.6rem] font-bold tracking-tight whitespace-nowrap pt-1">
               {perfume.price}
             </span>
           </div>

           {/* Arabic Description - Premium Look */}
           <div className="bg-black/30 border border-amber-900/20 rounded-[1.2rem] p-5 backdrop-blur-md shadow-inner">
             <p className="text-white/90 text-sm leading-relaxed text-right mb-4" dir="rtl">
               <strong>عطر Persian Oud – Collection Privée</strong> هو تجربة فاخرة تأخذك إلى قلب الصحراء بنفحات العود الغامضة والدافئة. تركيبة شرقية خشبية راقية تجمع بين العود الفاخر، البخور الناعم ولمسات العنبر والورد. يدوم طوال اليوم دون أن يكون مزعجًا.
             </p>
             <p className="text-white/70 text-xs italic text-right mb-4 border-r-2 border-amber-600 pr-3" dir="rtl">
               مطابق لرائحة Ombre Nomade Louis Vuitton الأصلية، بنفس الفخامة والعمق والتأثير، لكن بسعر مناسب للسوق الجزائري.
             </p>

             <div className="grid grid-cols-2 gap-3 mb-2" dir="rtl">
               <div className="bg-white/5 rounded-lg p-2.5 text-center">
                 <p className="text-amber-500 text-[10px] font-bold uppercase mb-1 drop-shadow-sm">العائلة</p>
                 <p className="text-white text-xs font-semibold">خشبي شرقي</p>
               </div>
               <div className="bg-white/5 rounded-lg p-2.5 text-center">
                 <p className="text-amber-500 text-[10px] font-bold uppercase mb-1 drop-shadow-sm">الثبات</p>
                 <p className="text-white text-xs font-semibold">12+ ساعة</p>
               </div>
               <div className="bg-white/5 rounded-lg p-2.5 text-center">
                 <p className="text-amber-500 text-[10px] font-bold uppercase mb-1 drop-shadow-sm">التركيز</p>
                 <p className="text-white text-xs font-semibold text-center" dir="ltr">Eau de Parfum</p>
               </div>
               <div className="bg-white/5 rounded-lg p-2.5 text-center">
                 <p className="text-amber-500 text-[10px] font-bold uppercase mb-1 drop-shadow-sm">الفوحان</p>
                 <p className="text-white text-xs font-semibold">قوي وأنيق</p>
               </div>
             </div>
           </div>

           <AccordsChart />

           {/* Direct Order Form */}
           <div className="mt-4">
             <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                  className="flex flex-col gap-3 bg-black/40 p-5 rounded-3xl backdrop-blur-xl border border-amber-900/40 shadow-2xl"
                  style={{ direction: "rtl" }}
                  onSubmit={handleOrderSubmit}
                >
                  <h3 className="text-amber-100 font-black uppercase tracking-tight text-lg mb-1 text-center">تأكيد الطلبية</h3>
                  <p className="text-white/60 text-xs text-center mb-3">الدفع عند الاستلام (Cash on Delivery)</p>
                  
                  <input required name="name" placeholder="الاسم الكامل" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50 transition-colors" />
                  <input required type="tel" name="phone" placeholder="رقم الهاتف" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50 transition-colors text-right" dir="ltr" />
                  <div className="flex flex-col gap-2">
                    <select 
                      required 
                      value={selectedWilaya} 
                      onChange={e => { setSelectedWilaya(e.target.value); setSelectedCommune(""); }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-amber-500/50 transition-colors appearance-none"
                    >
                      <option value="" disabled className="text-black">اختر الولاية</option>
                      {algeriaData.wilayas.map(w => (
                        <option key={w.wilaya_id} value={w.wilaya_id} className="text-black text-left" dir="ltr">
                          {w.wilaya_id} - {w.wilaya_name_latin}
                        </option>
                      ))}
                    </select>
                    <select 
                      required 
                      value={selectedCommune} 
                      onChange={e => setSelectedCommune(e.target.value)}
                      disabled={!selectedWilaya}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-amber-500/50 transition-colors appearance-none disabled:opacity-50"
                    >
                      <option value="" disabled className="text-black">البلدية</option>
                      {communesForWilaya.map(c => (
                        <option key={c.commune_id} value={c.commune_name_latin} className="text-black text-left" dir="ltr">
                          {c.commune_name_latin}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col gap-1 mt-1 font-sans">
                    <div className="flex justify-between text-white/70 text-xs">
                      <span>المجموع (100ml)</span>
                      <span dir="ltr">{perfume.price}</span>
                    </div>
                    <div className="flex justify-between text-white/70 text-xs">
                      <span>التوصيل</span>
                      <span className="text-amber-100 font-medium" dir="ltr">{selectedWilaya ? `${deliveryPrice} DA` : '---'}</span>
                    </div>
                    <div className="h-[1px] w-full bg-white/10 my-1"/>
                    <div className="flex justify-between text-amber-500 text-sm font-bold">
                      <span>السعر النهائي</span>
                      <span dir="ltr">{selectedWilaya ? `${totalPrice.toLocaleString()} DA` : '---'}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-1 font-sans" dir="ltr">
                    <button disabled={isSubmitting || orderSuccess} type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-800 text-white font-black text-sm uppercase tracking-wider hover:from-amber-500 hover:to-amber-700 transition-colors shadow-[0_10px_30px_rgba(217,119,6,0.4)] cursor-pointer disabled:opacity-75">
                      {isSubmitting ? "جاري الإرسال..." : orderSuccess ? "تم الطلب بنجاح ✓" : "تأكيد الطلب"}
                    </button>
                  </div>
                </motion.form>
           </div>
        </div>
      </div>

      {/* ────── DESKTOP LAYOUT (Extremely Simplified Version mapping Mobile) ────── */}
      {/* We are replicating the mobile view into a sleek center block for Desktop to keep it simple but premium */}
      <div className="hidden lg:flex flex-row relative pt-12 pb-24 px-10 z-10 items-start justify-center gap-20 max-w-[1400px] mx-auto w-full">
        
        {/* Left - Image */}
        <div className="relative w-[450px] h-[600px] flex-shrink-0 sticky top-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-amber-900/30 bg-black/20"
          >
            <Image unoptimized src={perfume.image} alt={perfume.name} fill className="object-cover" priority />
            <div className="absolute top-6 left-6 flex flex-col gap-3 pointer-events-none z-50">
               <div className="bg-[#bf6c22]/90 backdrop-blur-md rounded-full px-5 py-2.5 border border-white/20 shadow-lg">
                  <span className="text-white font-bold tracking-widest uppercase text-xs">
                    {perfume.tag}
                  </span>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Right - Content & Checkout */}
        <div className="flex flex-col flex-1 max-w-[550px] gap-6 pr-4 pb-10">
           <div className="flex flex-col">
             <h1 className="text-amber-100 text-5xl font-black uppercase leading-[1.05] tracking-tighter w-full pb-2">
               {perfume.name}
             </h1>
             <div className="flex items-center gap-2 mt-2">
               <span className="text-[#fbbf24] text-lg tracking-widest">★★★★★</span>
               <span className="text-white/60 text-sm ml-1">4.9 (250+ avis vérifiés)</span>
             </div>
           </div>

           <span className="text-white text-4xl font-bold tracking-tight pb-2 text-amber-500">
             {perfume.price}
           </span>

           <div className="bg-black/30 border border-amber-900/30 rounded-[1.5rem] p-6 backdrop-blur-md shadow-inner">
             <p className="text-white/90 text-sm leading-relaxed text-right mb-5" dir="rtl">
               <strong>عطر Persian Oud – Collection Privée</strong> هو تجربة فاخرة تأخذك إلى قلب الصحراء بنفحات العود الغامضة والدافئة. تركيبة شرقية خشبية راقية تجمع بين العود الفاخر، البخور الناعم ولمسات العنبر والورد.
             </p>
             <p className="text-white/70 text-[13px] italic text-right mb-5 border-r-2 border-amber-600 pr-4" dir="rtl">
               مطابق لرائحة Ombre Nomade Louis Vuitton الأصلية، بنفس الفخامة والعمق والتأثير، لكن بسعر مناسب للسوق الجزائري.
             </p>
             <div className="grid grid-cols-4 gap-3" dir="rtl">
               <div className="bg-white/5 rounded-xl p-3 text-center">
                 <p className="text-amber-500 text-[10px] font-bold uppercase mb-1 drop-shadow-sm">العائلة</p>
                 <p className="text-white text-xs font-semibold line-clamp-1">خشبي شرقي</p>
               </div>
               <div className="bg-white/5 rounded-xl p-3 text-center">
                 <p className="text-amber-500 text-[10px] font-bold uppercase mb-1 drop-shadow-sm">الثبات</p>
                 <p className="text-white text-xs font-semibold">12+ ساعة</p>
               </div>
               <div className="bg-white/5 rounded-xl p-3 text-center text-center">
                 <p className="text-amber-500 text-[10px] font-bold uppercase mb-1 drop-shadow-sm">التركيز</p>
                 <p className="text-white text-xs font-semibold truncate" dir="ltr">EDP</p>
               </div>
               <div className="bg-white/5 rounded-xl p-3 text-center">
                 <p className="text-amber-500 text-[10px] font-bold uppercase mb-1 drop-shadow-sm">الفوحان</p>
                 <p className="text-white text-xs font-semibold">قوي</p>
               </div>
             </div>
           </div>

           <AccordsChart />

           {/* Desktop Form */}
           <div className="mt-4 pb-4">
             <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                  className="flex flex-col gap-4 bg-black/60 p-6 rounded-[2rem] backdrop-blur-2xl border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                  style={{ direction: "rtl" }}
                  onSubmit={handleOrderSubmit}
                >
                  <h3 className="text-amber-100 font-black uppercase tracking-tight text-xl mb-1 text-center font-heading">تأكيد الطلبية - 100ml</h3>
                  
                  <input required name="name" placeholder="الاسم الكامل" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50 transition-colors" />
                  <input required type="tel" name="phone" placeholder="رقم الهاتف" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50 transition-colors text-right" dir="ltr" />
                  <div className="flex gap-3">
                    <select 
                      required 
                      value={selectedWilaya} 
                      onChange={e => { setSelectedWilaya(e.target.value); setSelectedCommune(""); }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white focus:outline-none focus:border-amber-500/50 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="text-black">اختر الولاية</option>
                      {algeriaData.wilayas.map(w => (
                        <option key={w.wilaya_id} value={w.wilaya_id} className="text-black text-left" dir="ltr">
                          {w.wilaya_id} - {w.wilaya_name_latin}
                        </option>
                      ))}
                    </select>
                    <select 
                      required 
                      value={selectedCommune} 
                      onChange={e => setSelectedCommune(e.target.value)}
                      disabled={!selectedWilaya}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white focus:outline-none focus:border-amber-500/50 transition-colors appearance-none disabled:opacity-50 cursor-pointer"
                    >
                      <option value="" disabled className="text-black">البلدية</option>
                      {communesForWilaya.map(c => (
                        <option key={c.commune_id} value={c.commune_name_latin} className="text-black text-left" dir="ltr">
                          {c.commune_name_latin}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="bg-black/50 border border-white/10 rounded-xl p-4 flex flex-col gap-2 mt-2 font-sans">
                    <div className="flex justify-between text-white/80 text-sm">
                      <span>المجموع</span>
                      <span dir="ltr">{perfume.price}</span>
                    </div>
                    <div className="flex justify-between text-white/80 text-sm">
                      <span>التوصيل</span>
                      <span className="text-amber-100 font-medium" dir="ltr">{selectedWilaya ? `${deliveryPrice} DA` : '---'}</span>
                    </div>
                    <div className="h-[1px] w-full bg-white/10 my-1"/>
                    <div className="flex justify-between text-amber-500 text-lg font-bold">
                      <span>السعر النهائي</span>
                      <span dir="ltr">{selectedWilaya ? `${totalPrice.toLocaleString()} DA` : '---'}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-3 font-sans" dir="ltr">
                    <button disabled={isSubmitting || orderSuccess} type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-800 text-white font-black text-base uppercase tracking-wider hover:from-amber-500 hover:to-amber-700 transition-colors shadow-[0_10px_30px_rgba(217,119,6,0.4)] cursor-pointer disabled:opacity-75">
                      {isSubmitting ? "جاري الإرسال..." : orderSuccess ? "تم الطلب بنجاح ✓" : "تأكيد الطلب"}
                    </button>
                  </div>
                </motion.form>
           </div>
        </div>
      </div>

    </motion.div>
  );
};

export default PerfumeShowcase;
