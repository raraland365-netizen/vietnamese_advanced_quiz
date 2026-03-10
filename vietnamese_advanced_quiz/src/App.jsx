import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Trophy,
  Flame,
  RotateCcw,
  Play,
  Clock3,
  CheckCircle2,
  XCircle,
  Sparkles,
  Medal,
  Crown,
  UserPlus,
  Star
} from 'lucide-react';

const rawQuizData = [
  { id: 1, category: '카페', title: '주문 실수', prompt: 'Em gọi cà phê đá mà, sao lại ra cà phê nóng vậy ạ?', translation: '아이스커피를 주문했는데 뜨거운 커피가 나왔어요.', choices: ['Anh/chị có thể đổi phòng giúp em không?', 'Anh/chị kiểm tra lại giúp em được không ạ?', 'Anh/chị bớt chút được không?', 'Em đợi lâu quá rồi ạ.'], answer: 'Anh/chị kiểm tra lại giúp em được không ạ?', explanation: '주문이 잘못 나왔을 때는 “다시 확인해주실 수 있나요?”가 가장 자연스러워요.' },
  { id: 2, category: '호텔', title: '방 교체 요청', prompt: 'Em đặt phòng không hút thuốc, mà phòng này vẫn có mùi thuốc lá.', translation: '금연실을 예약했는데 담배 냄새가 나요.', choices: ['Anh/chị đổi phòng khác giúp em được không ạ?', 'Anh/chị kiểm tra lại đơn giúp em được không?', 'Anh/chị cho em gọi thêm món nhé.', 'Em muốn trả bằng tiền mặt.'], answer: 'Anh/chị đổi phòng khác giúp em được không ạ?', explanation: '호텔 상황에서는 “방을 바꿔주실 수 있나요?”가 정답이에요.' },
  { id: 3, category: '쇼핑', title: '가격 흥정', prompt: 'Giá này hơi cao quá ạ.', translation: '이 가격은 조금 비싸네요.', choices: ['Anh/chị kiểm tra lại giúp em được không?', 'Anh/chị bớt cho em chút được không ạ?', 'Anh/chị đổi phòng giúp em được không?', 'Em nghe chưa kịp.'], answer: 'Anh/chị bớt cho em chút được không ạ?', explanation: '가격이 비쌀 때는 “조금 깎아주실 수 있나요?”를 써요.' },
  { id: 4, category: '식당', title: '지연된 음식', prompt: 'Cho em hỏi món của em bao giờ có ạ?', translation: '제 음식 언제 나와요?', choices: ['Em muốn đổi món này.', 'Em đợi hơn 30 phút rồi ạ.', 'Anh/chị bớt cho em chút nhé.', 'Em chưa hiểu lắm.'], answer: 'Em đợi hơn 30 phút rồi ạ.', explanation: '이미 오래 기다렸다는 정보를 덧붙이면 더 자연스럽고 설득력 있어요.' },
  { id: 5, category: '택시', title: '거스름돈', prompt: 'Anh ơi, hình như anh chưa trả lại tiền thừa cho em.', translation: '기사님, 아직 거스름돈을 안 주신 것 같아요.', choices: ['Anh kiểm tra lại giúp em được không ạ?', 'Anh đổi phòng giúp em nhé.', 'Anh nói chậm lại được không?', 'Anh cho em xem thực đơn nhé.'], answer: 'Anh kiểm tra lại giúp em được không ạ?', explanation: '직접적으로 따지기보다 “확인해주실 수 있나요?”가 더 정중해요.' },
  { id: 6, category: '친구대화', title: '약속 지각', prompt: 'Bạn đang ở đâu rồi?', translation: '지금 어디쯤이야?', choices: ['Mình đói quá rồi.', 'Mình không đi nữa đâu.', 'Còn bao lâu nữa bạn tới?', 'Bạn nói nhanh quá.'], answer: 'Còn bao lâu nữa bạn tới?', explanation: '친구가 늦을 때는 현재 위치 + 도착 시간까지 함께 묻는 표현이 자연스러워요.' },
  { id: 7, category: '대화', title: '너무 빠른 말', prompt: 'Bạn nói chậm lại một chút được không?', translation: '조금 천천히 말해줄 수 있어?', choices: ['Mình nghe không kịp.', 'Mình chưa ăn gì cả.', 'Mình đổi ý rồi.', 'Mình đến sớm mà.'], answer: 'Mình nghe không kịp.', explanation: '이유를 바로 덧붙이면 상대가 더 쉽게 배려해줘요.' },
  { id: 8, category: '여행', title: '길 설명 재요청', prompt: 'Bạn chỉ đường dễ hiểu hơn chút được không?', translation: '조금 더 쉽게 길 설명해줄 수 있어?', choices: ['Mình hết tiền rồi.', 'Mình vẫn chưa hình dung ra.', 'Mình đặt phòng trước rồi.', 'Mình thấy ngon lắm.'], answer: 'Mình vẫn chưa hình dung ra.', explanation: '“아직 감이 안 와요”는 길 설명이 어렵다는 뜻으로 아주 자주 써요.' },
  { id: 9, category: '쇼핑앱', title: '배송 지연', prompt: 'Đơn hàng của em bị giao trễ mất rồi ạ.', translation: '주문이 배송 지연됐어요.', choices: ['Shop kiểm tra giúp em tình trạng đơn hàng được không ạ?', 'Shop đổi món khác giúp em nhé.', 'Shop bớt giá cho em chút nhé.', 'Shop nói chậm lại giúp em nhé.'], answer: 'Shop kiểm tra giúp em tình trạng đơn hàng được không ạ?', explanation: '온라인 문의에서는 주문 상태 확인 요청이 가장 먼저 와야 해요.' },
  { id: 10, category: '친구대화', title: '정중한 거절', prompt: 'Mình rất muốn giúp, nhưng dạo này mình hơi bận.', translation: '정말 도와주고 싶지만 요즘 좀 바빠.', choices: ['Bạn thông cảm giúp mình nhé.', 'Bạn đến đây ngay nhé.', 'Bạn trả lại tiền thừa nhé.', 'Bạn đổi món giúp mình nhé.'], answer: 'Bạn thông cảm giúp mình nhé.', explanation: '정중한 거절은 마지막에 이해를 구하는 표현을 붙이면 훨씬 부드러워져요.' },
  { id: 11, category: '식당', title: '누락된 메뉴', prompt: 'Hình như món này em chưa nhận được ạ.', translation: '이 메뉴는 아직 못 받은 것 같아요.', choices: ['Anh/chị kiểm tra lại giúp em với ạ.', 'Anh/chị đổi phòng giúp em nhé.', 'Anh/chị bớt giá cho em nhé.', 'Anh/chị gọi taxi giúp em nhé.'], answer: 'Anh/chị kiểm tra lại giúp em với ạ.', explanation: '식당에서 메뉴 누락은 “다시 확인 부탁드려요”가 기본이에요.' },
  { id: 12, category: '카페', title: '와이파이 요청', prompt: 'Cho em hỏi mật khẩu wifi là gì ạ?', translation: '와이파이 비밀번호가 뭐예요?', choices: ['Em muốn đổi sang bàn khác.', 'Anh/chị cho em xin mật khẩu wifi với ạ.', 'Anh/chị trả lại tiền thừa nhé.', 'Em đợi món lâu quá.'], answer: 'Anh/chị cho em xin mật khẩu wifi với ạ.', explanation: '비밀번호를 물을 때는 “cho em xin...” 표현이 공손하고 자연스러워요.' },
  { id: 13, category: '호텔', title: '짐 맡기기', prompt: 'Em đến hơi sớm nên chưa check-in được.', translation: '제가 좀 일찍 와서 아직 체크인이 안 돼요.', choices: ['Em muốn thanh toán luôn ạ.', 'Em gửi hành lý ở đây trước được không ạ?', 'Em muốn đổi món này ạ.', 'Em chưa nghe kịp ạ.'], answer: 'Em gửi hành lý ở đây trước được không ạ?', explanation: '체크인 전 짐 보관 요청은 여행에서 매우 자주 쓰는 표현이에요.' },
  { id: 14, category: '식당', title: '너무 짠 음식', prompt: 'Món này hơi mặn với em ạ.', translation: '이 음식은 저한테 조금 짜요.', choices: ['Anh/chị có thể cho thêm đá không?', 'Lần sau làm nhạt hơn một chút được không ạ?', 'Anh/chị đổi phòng khác giúp em nhé.', 'Anh/chị cho em hỏi đường nhé.'], answer: 'Lần sau làm nhạt hơn một chút được không ạ?', explanation: '음식 간이 셀 때는 “조금 덜 짜게”처럼 부드럽게 요청하면 좋아요.' },
  { id: 15, category: '쇼핑', title: '사이즈 변경', prompt: 'Mẫu này đẹp đấy ạ, nhưng hơi chật với em.', translation: '이 디자인은 예쁜데 저한테 조금 꽉 껴요.', choices: ['Anh/chị còn size lớn hơn không ạ?', 'Anh/chị còn phòng trống không ạ?', 'Anh/chị còn tiền lẻ không ạ?', 'Anh/chị còn bàn không ạ?'], answer: 'Anh/chị còn size lớn hơn không ạ?', explanation: '옷이나 신발 쇼핑에서는 “더 큰 사이즈 있어요?”가 핵심 표현이에요.' },
  { id: 16, category: '택시', title: '여기서 내려주세요', prompt: 'Anh ơi, cho em xuống ở đây được rồi ạ.', translation: '기사님, 여기서 내려주시면 돼요.', choices: ['Anh dừng ở đây giúp em nhé.', 'Anh đổi món giúp em nhé.', 'Anh chỉ đường giúp em nhé.', 'Anh giảm giá giúp em nhé.'], answer: 'Anh dừng ở đây giúp em nhé.', explanation: '택시에서 내릴 때는 짧고 분명한 표현이 좋아요.' },
  { id: 17, category: '친구대화', title: '사적인 질문 선 긋기', prompt: 'Câu đó hơi riêng tư với mình á.', translation: '그건 나한테 좀 사적인 질문이야.', choices: ['Mình xin phép không trả lời nhé.', 'Mình xin thêm đá nhé.', 'Mình xin đổi phòng nhé.', 'Mình xin trả góp nhé.'], answer: 'Mình xin phép không trả lời nhé.', explanation: '부드럽게 선을 긋고 싶을 때 아주 유용한 표현이에요.' },
  { id: 18, category: '여행', title: '사진 부탁', prompt: 'Bạn ơi, phiền bạn chút được không?', translation: '실례지만 잠깐 부탁드려도 될까요?', choices: ['Bạn chỉ đường giúp mình nhé.', 'Bạn nói nhỏ thôi nhé.', 'Bạn chụp giúp mình một tấm được không?', 'Bạn trả lại tiền thừa nhé.'], answer: 'Bạn chụp giúp mình một tấm được không?', explanation: '여행 중 사진 부탁은 정말 많이 쓰는 회화예요.' },
  { id: 19, category: '식당', title: '계산 요청', prompt: 'Cho em tính tiền nhé ạ.', translation: '계산할게요.', choices: ['Anh/chị mang thêm nước giúp em nhé.', 'Anh/chị cho em xin hóa đơn luôn ạ.', 'Anh/chị đổi phòng giúp em nhé.', 'Anh/chị nói lại giúp em nhé.'], answer: 'Anh/chị cho em xin hóa đơn luôn ạ.', explanation: '계산과 함께 영수증까지 부탁하는 흐름이에요.' },
  { id: 20, category: '약속', title: '주소 재확인', prompt: 'Mai mình gặp nhau ở đâu nhỉ?', translation: '우리 내일 어디서 만나지?', choices: ['Bạn gửi lại địa chỉ cho mình được không?', 'Bạn đổi món giúp mình được không?', 'Bạn trả lại tiền cho mình được không?', 'Bạn bớt giá cho mình được không?'], answer: 'Bạn gửi lại địa chỉ cho mình được không?', explanation: '약속 장소 재확인은 “주소 다시 보내줄래?”가 가장 실용적이에요.' }
];

const shuffleArray = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const QUIZ_COUNT = 10;
const GAME_TIME = 15;
const MAX_LIVES = 3;
const RANKING_KEY = 'vietnamese_quiz_rankings';
const cn = (...classes) => classes.filter(Boolean).join(' ');

function Card({ className = '', children }) {
  return <div className={cn('rounded-3xl bg-white', className)}>{children}</div>;
}
function CardContent({ className = '', children }) {
  return <div className={className}>{children}</div>;
}
function Button({ className = '', children, variant = 'default', size = 'default', disabled = false, type = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
    outline: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50',
  };
  const sizes = { default: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-base' };
  return <button type={type} disabled={disabled} className={cn(base, variants[variant], sizes[size], className)} {...props}>{children}</button>;
}
function Badge({ className = '', variant = 'secondary', children }) {
  const variants = { secondary: 'bg-slate-100 text-slate-800', outline: 'border border-slate-200 bg-white text-slate-700' };
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', variants[variant], className)}>{children}</span>;
}
function Progress({ value = 0, className = '' }) {
  return <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}><div className="h-full rounded-full bg-slate-900 transition-all duration-300" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

function ResultCharacter({ mood = 'happy', size = 'md', floating = false }) {
  const isSad = mood === 'sad';
  const sizeClass = size === 'sm' ? 'h-24 w-20' : 'h-52 w-44';
  const innerClass = size === 'sm' ? 'h-20 w-20 scale-[0.5]' : 'h-40 w-40';
  return (
    <motion.div initial={{ opacity: 0, scale: 0.92, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.35 }} className={cn('relative', floating ? 'mx-0 mb-0' : 'mx-auto mb-5', sizeClass)}>
      <motion.div className={cn('absolute inset-x-0 mx-auto origin-top', size === 'sm' ? 'top-0' : 'top-2', innerClass)} animate={isSad ? { rotate: [0, -2, 2, -2, 0], y: [0, -2, 0] } : { y: [0, -6, 0], rotate: [0, -1, 1, 0] }} transition={{ duration: isSad ? 1.1 : 1.8, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="absolute left-1/2 top-0 h-24 w-40 -translate-x-1/2 rounded-b-[26px] rounded-t-[90px] border-[5px] border-slate-900 bg-gradient-to-b from-amber-300 via-orange-400 to-orange-500 shadow-md" />
        <div className="absolute left-[18px] top-[18px] h-10 w-7 -rotate-12 rounded-full bg-white/70" />
        <div className="absolute left-[108px] top-[14px] h-6 w-10 rotate-[20deg] rounded-full bg-white/85" />
        <div className="absolute left-[144px] top-[32px] h-3.5 w-3.5 rounded-full bg-white/90" />
        <div className="absolute left-4 top-[86px] h-5 w-10 rounded-full border-[4px] border-slate-900 border-t-0 bg-orange-500" />
        <div className="absolute right-4 top-[86px] h-5 w-10 rounded-full border-[4px] border-slate-900 border-t-0 bg-orange-500" />
        <div className="absolute left-[4px] top-[82px] h-8 w-8 rounded-full bg-red-500 ring-4 ring-slate-900" />
        <div className="absolute right-[4px] top-[82px] h-8 w-8 rounded-full bg-red-500 ring-4 ring-slate-900" />
        <div className="absolute left-1/2 top-[72px] h-[74px] w-[118px] -translate-x-1/2 rounded-b-[58px] rounded-t-[18px] border-[5px] border-slate-900 bg-slate-900" />
        <div className="absolute left-1/2 top-[88px] h-[62px] w-[88px] -translate-x-1/2 rounded-[28px] bg-[#f7e6d9]" />
        <div className="absolute left-[42px] top-[98px] h-12 w-7 rounded-b-full rounded-t-[12px] bg-slate-900" />
        <div className="absolute right-[42px] top-[98px] h-12 w-7 rounded-b-full rounded-t-[12px] bg-slate-900" />
        <div className="absolute left-[34px] top-[136px] h-10 w-10 rounded-full bg-slate-900" />
        <div className="absolute right-[34px] top-[136px] h-10 w-10 rounded-full bg-slate-900" />
        <div className="absolute left-[48px] top-[111px] h-3 w-5 rounded-full border-b-[4px] border-slate-900" />
        <div className="absolute right-[48px] top-[111px] h-3 w-5 rounded-full border-b-[4px] border-slate-900" />
        <div className="absolute left-[44px] top-[126px] h-3 w-5 rounded-full bg-pink-300/80" />
        <div className="absolute right-[44px] top-[126px] h-3 w-5 rounded-full bg-pink-300/80" />
        <div className={cn('absolute left-1/2 top-[130px] -translate-x-1/2 border-slate-900', isSad ? 'h-4 w-8 rounded-t-full border-t-[4px]' : 'h-4 w-8 rounded-b-full border-b-[4px]')} />
        <div className="absolute left-1/2 top-[150px] h-[58px] w-[48px] -translate-x-1/2 rounded-b-[8px] rounded-t-[10px] border-[5px] border-slate-900 bg-red-500" />
        <div className="absolute left-[56px] top-[160px] h-10 w-3 rounded-full border-[4px] border-slate-900 bg-[#f7e6d9]" />
        <div className="absolute right-[56px] top-[160px] h-10 w-3 rounded-full border-[4px] border-slate-900 bg-[#f7e6d9]" />
        <div className="absolute left-[75px] top-[145px] h-5 w-5 rounded-full border-[4px] border-slate-900 bg-red-500" />
        <div className="absolute right-[75px] top-[145px] h-5 w-5 rounded-full border-[4px] border-slate-900 bg-red-500" />
        <div className="absolute left-[82px] top-[194px] h-7 w-2 rounded-full border-[3px] border-slate-900 bg-white" />
        <div className="absolute right-[82px] top-[194px] h-7 w-2 rounded-full border-[3px] border-slate-900 bg-white" />
        <div className="absolute left-[75px] top-[217px] h-2 w-8 rounded-full bg-slate-900/80 blur-[1px]" />
        <div className="absolute right-[75px] top-[217px] h-2 w-8 rounded-full bg-slate-900/80 blur-[1px]" />
        {isSad ? (
          <>
            <motion.div className="absolute left-[62px] top-[114px] h-7 w-2.5 rounded-full bg-sky-400/90" animate={{ y: [0, 12, 0], opacity: [0.8, 1, 0.7] }} transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="absolute right-[62px] top-[114px] h-7 w-2.5 rounded-full bg-sky-400/90" animate={{ y: [2, 13, 2], opacity: [0.75, 1, 0.7] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }} />
          </>
        ) : (
          <>
            <motion.div className="absolute -left-1 top-6 text-2xl" animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>✨</motion.div>
            <motion.div className="absolute -right-1 top-10 text-2xl" animate={{ scale: [1, 1.2, 1], rotate: [0, 8, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}>🎉</motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function getRank(score) {
  if (score >= 180) return { label: '베트남어 회화 마스터', message: '상황 판단과 표현 선택이 아주 정확해요.' };
  if (score >= 130) return { label: '실전 여행 고수', message: '여행·일상 회화에서 꽤 자연스럽게 대응할 수 있어요.' };
  if (score >= 80) return { label: '회화 감각 상승 중', message: '핵심 표현은 잘 잡고 있어요. 조금만 더 다듬으면 돼요.' };
  return { label: '연습 모드', message: '괜찮아요. 반복해서 풀수록 훨씬 빨라져요.' };
}

function AppMascot({ mood = 'happy' }) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-emerald-50">
          <ResultCharacter mood={mood} size="sm" floating />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Quiz Mascot</p>
          <p className="text-sm font-bold text-slate-900">Linh와 함께 퀴즈 도전!</p>
          <p className="text-xs text-slate-500">정답을 고르고 점수를 높여보세요.</p>
        </div>
      </div>
      <div className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">{mood === 'sad' ? '응원 중' : '파이팅'}</div>
    </div>
  );
}

function RankingCard({ rankings }) {
  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-slate-900"><Medal className="h-5 w-5 text-amber-500" /><h3 className="text-lg font-bold">랭킹 보드</h3></div>
      {rankings.length === 0 ? <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">아직 등록된 랭킹이 없어요.</div> : (
        <div className="space-y-3">
          {rankings.slice(0, 10).map((item, idx) => (
            <div key={`${item.name}-${item.score}-${idx}`} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold', idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-slate-200 text-slate-700' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-white text-slate-600')}>
                  {idx === 0 ? <Crown className="h-4 w-4" /> : idx + 1}
                </div>
                <div><p className="font-semibold text-slate-900">{item.name}</p><p className="text-xs text-slate-500">{item.correctCount}/{item.totalCount} 정답 · {item.accuracy}% 정확도</p></div>
              </div>
              <div className="text-right"><p className="text-lg font-bold text-slate-900">{item.score}</p><p className="text-xs text-slate-500">{item.rankLabel}</p></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('start');
  const [quizData, setQuizData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongLog, setWrongLog] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [rankingSaved, setRankingSaved] = useState(false);
  const currentQuestion = quizData[currentIndex];

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(RANKING_KEY);
      if (saved) setRankings(JSON.parse(saved));
    } catch (error) {
      console.error('Failed to load rankings', error);
    }
  }, []);

  const progressValue = useMemo(() => !quizData.length ? 0 : (currentIndex / quizData.length) * 100, [currentIndex, quizData.length]);

  useEffect(() => {
    if (screen !== 'playing' || showResult) return undefined;
    if (timeLeft <= 0) {
      handleChoice('__timeout__');
      return undefined;
    }
    const timer = window.setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [timeLeft, screen, showResult]);

  const rank = getRank(score);
  const didClear = lives > 0 && currentIndex >= quizData.length - 1;
  const resultMood = didClear ? 'happy' : 'sad';

  const saveRankings = (nextRankings) => {
    setRankings(nextRankings);
    window.localStorage.setItem(RANKING_KEY, JSON.stringify(nextRankings));
  };

  const submitRanking = () => {
    const trimmedName = playerName.trim();
    if (!trimmedName || rankingSaved) return;
    const newEntry = { name: trimmedName, score, correctCount, totalCount: quizData.length, accuracy: quizData.length ? Math.round((correctCount / quizData.length) * 100) : 0, rankLabel: rank.label, createdAt: Date.now() };
    const nextRankings = [...rankings, newEntry].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
      return a.createdAt - b.createdAt;
    }).slice(0, 20);
    saveRankings(nextRankings);
    setRankingSaved(true);
  };

  const prepareGame = () => {
    const prepared = shuffleArray(rawQuizData).slice(0, QUIZ_COUNT).map((q) => ({ ...q, choices: shuffleArray(q.choices) }));
    setQuizData(prepared);
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setLives(MAX_LIVES);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(GAME_TIME);
    setCorrectCount(0);
    setWrongLog([]);
    setPlayerName('');
    setRankingSaved(false);
    setScreen('playing');
  };

  const handleChoice = (choice) => {
    if (!currentQuestion || showResult) return;
    const isCorrect = choice === currentQuestion.answer;
    setSelected(choice);
    setShowResult(true);
    if (isCorrect) {
      const gained = 10 + Math.max(0, streak * 2) + Math.max(0, timeLeft - 5);
      setScore((prev) => prev + gained);
      setStreak((prev) => {
        const next = prev + 1;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
      setCorrectCount((prev) => prev + 1);
    } else {
      setLives((prev) => prev - 1);
      setStreak(0);
      setWrongLog((prev) => [...prev, { prompt: currentQuestion.prompt, translation: currentQuestion.translation, correct: currentQuestion.answer, selected: choice === '__timeout__' ? '시간 초과' : choice }]);
    }
  };

  const handleNext = () => {
    const isLastQuestion = currentIndex >= quizData.length - 1;
    const gameOverByLives = lives <= 0;
    if (isLastQuestion || gameOverByLives) {
      setScreen('result');
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
    setShowResult(false);
    setTimeLeft(GAME_TIME);
  };

  const getChoiceStyle = (choice) => {
    if (!showResult) return 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300';
    if (choice === currentQuestion.answer) return 'border-emerald-500 bg-emerald-50';
    if (choice === selected && selected !== currentQuestion.answer) return 'border-rose-500 bg-rose-50';
    return 'border-slate-200 bg-slate-50 opacity-70';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-emerald-100 p-3 md:p-8">
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-[2.2rem] border-8 border-slate-900 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
          <div className="bg-slate-900 px-6 pb-3 pt-2">
            <div className="mx-auto mb-2 h-1.5 w-24 rounded-full bg-white/20" />
            <div className="flex items-center justify-between text-white">
              <div><p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Vietnamese Quiz</p><p className="text-sm font-semibold">Xin chào App</p></div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">10 Questions</div>
            </div>
          </div>
          <div className="min-h-[780px] bg-gradient-to-b from-white via-orange-50/40 to-emerald-50/50 p-4 md:p-5">
            <AppMascot mood={screen === 'result' ? resultMood : lives <= 1 && screen === 'playing' ? 'sad' : 'happy'} />
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-5 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-orange-100"><Sparkles className="h-4 w-4" /><span className="text-sm font-medium text-slate-700">베트남어 상황별 상급 회화 퀴즈</span></div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">말문이 막히는 순간, 정답을 골라보세요</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base">식당, 택시, 호텔, 쇼핑, 친구대화까지. 랜덤 10문제로 실전 감각을 가볍게 연습할 수 있어요.</p>
            </motion.div>

            {screen === 'start' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="overflow-hidden border-0 bg-white/90 shadow-xl shadow-orange-100">
                  <CardContent className="p-6 md:p-8">
                    <div className="grid gap-3">
                      <div className="rounded-2xl bg-orange-50 p-4"><div className="mb-2 flex items-center gap-2 font-semibold text-slate-800"><Clock3 className="h-4 w-4" /> 15초 제한</div><p className="text-sm text-slate-600">빠르게 판단하는 실전 감각을 키워요.</p></div>
                      <div className="rounded-2xl bg-rose-50 p-4"><div className="mb-2 flex items-center gap-2 font-semibold text-slate-800"><Heart className="h-4 w-4" /> 목숨 3개</div><p className="text-sm text-slate-600">3번 틀리면 게임 종료. 긴장감 있게 플레이해요.</p></div>
                      <div className="rounded-2xl bg-emerald-50 p-4"><div className="mb-2 flex items-center gap-2 font-semibold text-slate-800"><Flame className="h-4 w-4" /> 연속 정답 보너스</div><p className="text-sm text-slate-600">연속으로 맞힐수록 점수가 더 커져요.</p></div>
                    </div>
                    <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-800">플레이 방법</p>
                      <ul className="mt-2 space-y-2 text-sm text-slate-600">
                        <li>• 베트남어 상황 문장을 읽고 가장 자연스러운 다음 답변을 고르세요.</li>
                        <li>• 총 10문제가 랜덤으로 출제되고, 틀리면 목숨이 줄어요.</li>
                        <li>• 마지막에 맞힌 개수와 오답 노트를 확인할 수 있어요.</li>
                      </ul>
                    </div>
                    <RankingCard rankings={rankings} />
                    <div className="mt-8 flex justify-center"><Button onClick={prepareGame} size="lg" className="rounded-2xl px-8 py-6 text-base shadow-lg"><Play className="mr-2 h-5 w-5" /> 게임 시작</Button></div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {screen === 'playing' && currentQuestion && (
              <AnimatePresence mode="wait">
                <motion.div key={currentQuestion.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <Card className="border-0 shadow-sm"><CardContent className="p-4"><div className="text-xs text-slate-500">점수</div><div className="text-2xl font-bold text-slate-900">{score}</div></CardContent></Card>
                    <Card className="border-0 shadow-sm"><CardContent className="p-4"><div className="text-xs text-slate-500">연속 정답</div><div className="flex items-center gap-2 text-2xl font-bold text-slate-900"><Flame className="h-5 w-5" /> {streak}</div></CardContent></Card>
                    <Card className="border-0 shadow-sm"><CardContent className="p-4"><div className="text-xs text-slate-500">남은 시간</div><div className="flex items-center gap-2 text-2xl font-bold text-slate-900"><Clock3 className="h-5 w-5" /> {timeLeft}</div></CardContent></Card>
                    <Card className="border-0 shadow-sm"><CardContent className="p-4"><div className="text-xs text-slate-500">목숨</div><div className="flex items-center gap-1">{Array.from({ length: MAX_LIVES }).map((_, idx) => <Heart key={`life-${idx}`} className={cn('h-5 w-5', idx < lives ? 'fill-current text-rose-500' : 'text-slate-200')} />)}</div></CardContent></Card>
                  </div>
                  <Card className="overflow-hidden rounded-[1.75rem] border-0 shadow-xl shadow-slate-100">
                    <CardContent className="p-6 md:p-8">
                      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2"><Badge variant="secondary" className="rounded-full px-3 py-1">{currentQuestion.category}</Badge><Badge variant="outline" className="rounded-full px-3 py-1">Q {currentIndex + 1} / {quizData.length}</Badge></div>
                        <div className="w-full md:w-56"><Progress value={progressValue} className="h-2" /></div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-5"><p className="text-sm font-medium text-slate-500">상황</p><h2 className="mt-2 text-xl font-bold leading-8 text-slate-900 md:text-2xl">{currentQuestion.prompt}</h2><p className="mt-3 text-sm text-slate-600">{currentQuestion.translation}</p></div>
                      <div className="mt-6 grid gap-3">
                        {currentQuestion.choices.map((choice, idx) => (
                          <button key={choice} type="button" onClick={() => handleChoice(choice)} disabled={showResult} className={cn('rounded-2xl border p-4 text-left transition', getChoiceStyle(choice))}>
                            <div className="flex items-start gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">{String.fromCharCode(65 + idx)}</div>
                              <div className="flex-1"><p className="text-sm font-medium leading-6 text-slate-800 md:text-base">{choice}</p></div>
                              {showResult && choice === currentQuestion.answer && <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600" />}
                              {showResult && choice === selected && selected !== currentQuestion.answer && <XCircle className="mt-1 h-5 w-5 text-rose-600" />}
                            </div>
                          </button>
                        ))}
                      </div>
                      {showResult && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                          <div className="flex items-center gap-2 text-lg font-bold text-slate-900">{selected === currentQuestion.answer ? <><CheckCircle2 className="h-5 w-5 text-emerald-600" /> 정답!</> : <><XCircle className="h-5 w-5 text-rose-600" /> 아쉽지만 오답</>}</div>
                          <p className="mt-3 text-sm text-slate-700"><span className="font-semibold">정답:</span> {currentQuestion.answer}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{currentQuestion.explanation}</p>
                          <div className="mt-4 flex justify-end"><Button onClick={handleNext} className="rounded-xl px-6">{currentIndex === quizData.length - 1 || lives <= 0 ? '결과 보기' : '다음 문제'}</Button></div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            )}

            {screen === 'result' && (
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="rounded-[1.75rem] border-0 shadow-xl shadow-amber-100">
                  <CardContent className="p-6 md:p-8">
                    <div className="text-center">
                      <ResultCharacter mood={resultMood} />
                      <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-amber-700"><Trophy className="h-5 w-5" /><span className="text-sm font-semibold">{resultMood === 'happy' ? '성공 클리어!' : '아쉽게 게임 오버'}</span></div>
                      <h2 className="text-3xl font-bold text-slate-900">{resultMood === 'happy' ? '정말 잘했어요!' : '다음엔 더 잘할 수 있어요!'}</h2>
                      <p className="mt-2 text-slate-600">{rank.message}</p>
                      <div className="mt-4 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">{rank.label}</div>
                    </div>
                    <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-center">
                      <div className="text-sm font-medium text-emerald-700">이번 게임 결과</div>
                      <div className="mt-2 text-2xl font-bold text-slate-900">총 {quizData.length}문제 중 <span className="text-emerald-700">{correctCount}문제</span> 맞혔어요</div>
                      <div className="mt-2 text-sm text-slate-600">오답 {quizData.length - correctCount}문제 · 정확도 {quizData.length ? Math.round((correctCount / quizData.length) * 100) : 0}%</div>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-4">
                      <div className="rounded-2xl bg-slate-50 p-4 text-center"><div className="text-sm text-slate-500">최종 점수</div><div className="mt-1 text-3xl font-bold text-slate-900">{score}</div></div>
                      <div className="rounded-2xl bg-slate-50 p-4 text-center"><div className="text-sm text-slate-500">정답 수</div><div className="mt-1 text-3xl font-bold text-slate-900">{correctCount}</div></div>
                      <div className="rounded-2xl bg-slate-50 p-4 text-center"><div className="text-sm text-slate-500">최고 연속 정답</div><div className="mt-1 text-3xl font-bold text-slate-900">{bestStreak}</div></div>
                      <div className="rounded-2xl bg-slate-50 p-4 text-center"><div className="text-sm text-slate-500">정확도</div><div className="mt-1 text-3xl font-bold text-slate-900">{quizData.length ? Math.round((correctCount / quizData.length) * 100) : 0}%</div></div>
                    </div>
                    {wrongLog.length > 0 && (
                      <div className="mt-8">
                        <h3 className="mb-3 text-lg font-bold text-slate-900">오답 노트</h3>
                        <div className="space-y-3">
                          {wrongLog.slice(0, 6).map((item, idx) => <div key={`wrong-${idx}`} className="rounded-2xl border border-slate-200 p-4"><p className="font-semibold text-slate-900">{item.prompt}</p><p className="mt-1 text-sm text-slate-500">{item.translation}</p><p className="mt-2 text-sm text-rose-600">내 답: {item.selected}</p><p className="mt-1 text-sm text-emerald-700">정답: {item.correct}</p></div>)}
                        </div>
                      </div>
                    )}
                    <div className="mt-8 rounded-3xl border border-orange-100 bg-orange-50/70 p-4">
                      <div className="mb-3 flex items-center gap-2 text-slate-900"><UserPlus className="h-5 w-5 text-orange-500" /><h3 className="font-bold">랭킹 등록</h3></div>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} maxLength={12} placeholder="이름 또는 닉네임 입력" className="h-12 flex-1 rounded-2xl border border-orange-200 bg-white px-4 text-sm outline-none placeholder:text-slate-400" />
                        <Button onClick={submitRanking} disabled={!playerName.trim() || rankingSaved} className="h-12 rounded-2xl px-5"><Star className="mr-2 h-4 w-4" />{rankingSaved ? '등록 완료' : '랭킹 등록'}</Button>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">점수, 정답 수, 정확도를 기준으로 상위 랭킹에 저장돼요.</p>
                    </div>
                    <RankingCard rankings={rankings} />
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                      <Button onClick={prepareGame} size="lg" className="rounded-2xl px-8"><RotateCcw className="mr-2 h-4 w-4" /> 다시 하기</Button>
                      <Button onClick={() => setScreen('start')} variant="outline" size="lg" className="rounded-2xl px-8">처음 화면</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
