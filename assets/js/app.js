/* Ceylon Crest — interaction layer. No frameworks, no external API calls. */
(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const hotelRooms = {
    garden: {name:'Garden Room',rate:24500,max:2,image:'assets/images/room-garden.webp',description:'A peaceful retreat with warm natural finishes, a restful king-size bed and views of the tropical garden.'},
    ocean: {name:'Ocean Room',rate:31500,max:2,image:'assets/images/room-ocean.webp',description:'Sun-filled interiors, an inviting king-size bed and an easy, breezy coastal atmosphere.'},
    family: {name:'Family Suite',rate:42000,max:4,image:'assets/images/room-suite.webp',description:'A generous, light-filled space designed to bring everyone together, with a separate place to unwind.'}
  };
  const currency = n => 'Rs. ' + Number(n).toLocaleString('en-LK');
  const fmtDate = d => new Date(d+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
  function localDate(d) { const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0');const da=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${da}`; }
  const today=new Date(); today.setHours(0,0,0,0);
  const todayISO=localDate(today);
  const plusDays=(str,n)=>{const d=new Date(str+'T12:00:00');d.setDate(d.getDate()+n);return localDate(d)};

  // Header & mobile navigation
  const header=$('#site-header');
  const setHeader=()=>header?.classList.toggle('scrolled',scrollY>35);
  window.addEventListener('scroll',setHeader,{passive:true});setHeader();
  const menuBtn=$('.menu-toggle'),mobileNav=$('#mobile-nav');
  const closeMenu=()=>{if(!mobileNav)return;mobileNav.hidden=true;header?.classList.remove('nav-open');menuBtn?.setAttribute('aria-expanded','false')};
  menuBtn?.addEventListener('click',()=>{const opening=mobileNav.hidden;mobileNav.hidden=!opening;menuBtn.setAttribute('aria-expanded',String(opening));header?.classList.toggle('nav-open',opening)});
  $$('#mobile-nav a,#mobile-nav button').forEach(x=>x.addEventListener('click',closeMenu));
  window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  const year=$('#year');if(year)year.textContent=String(new Date().getFullYear());
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.documentElement.classList.add('js-ready');
    const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}})},{rootMargin:'0px 0px -30px 0px',threshold:.06});
    $$('.reveal').forEach(x=>observer.observe(x));
  }
  function setDateMinimum(inEl,outEl){if(!inEl||!outEl)return;inEl.min=todayISO;if(!inEl.value)inEl.value=plusDays(todayISO,3);outEl.min=plusDays(inEl.value,1);if(!outEl.value||outEl.value<=inEl.value)outEl.value=plusDays(inEl.value,2);inEl.addEventListener('change',()=>{outEl.min=plusDays(inEl.value,1);if(outEl.value<=inEl.value)outEl.value=plusDays(inEl.value,1)})}
  setDateMinimum($('#quick-in'),$('#quick-out'));setDateMinimum($('#modal-in'),$('#modal-out'));

  // Booking enquiry preparation (client-side only)
  const bookingDialog=$('#booking-dialog'), bookingForm=$('#booking-form'), bookingResult=$('#booking-result');
  const modalRoom=$('#modal-room'),modalIn=$('#modal-in'),modalOut=$('#modal-out'),modalGuests=$('#modal-guests');
  let enquiryString='';
  function openBooking(roomId=null, params={}) {
    if(!bookingDialog)return;
    if(roomId && hotelRooms[roomId])modalRoom.value=roomId;
    if(params.checkin)modalIn.value=params.checkin;
    if(params.checkout)modalOut.value=params.checkout;
    if(params.guests)modalGuests.value=params.guests;
    if(modalIn.value){modalOut.min=plusDays(modalIn.value,1);if(modalOut.value<=modalIn.value)modalOut.value=plusDays(modalIn.value,1)}
    $('#booking-error').hidden=true;
    bookingForm.hidden=false;bookingResult.hidden=true;$('#copy-feedback').textContent='';
    bookingDialog.showModal();document.body.classList.add('modal-open');
  }
  function closeDialog(dialog){if(dialog?.open)dialog.close(); document.body.classList.remove('modal-open')}
  $$('.js-book-open').forEach(x=>x.addEventListener('click',()=>openBooking()));
  $$('.js-room-book').forEach(x=>x.addEventListener('click',()=>openBooking(x.dataset.room)));
  $$('.js-dialog-close').forEach(x=>x.addEventListener('click',()=>closeDialog(bookingDialog)));
  bookingDialog?.addEventListener('click',e=>{if(e.target===bookingDialog)closeDialog(bookingDialog)});
  bookingDialog?.addEventListener('close',()=>document.body.classList.remove('modal-open'));
  $('#quick-search')?.addEventListener('submit',e=>{e.preventDefault();const a=$('#quick-in').value,b=$('#quick-out').value,g=$('#quick-guests').value;if(!a||!b||b<=a){$('#quick-out').setCustomValidity('Check-out must be after check-in');$('#quick-out').reportValidity();$('#quick-out').setCustomValidity('');return}openBooking(null,{checkin:a,checkout:b,guests:g})});
  bookingForm?.addEventListener('submit',e=>{
    e.preventDefault();const inDate=modalIn.value,outDate=modalOut.value,guests=Number(modalGuests.value),room=hotelRooms[modalRoom.value],error=$('#booking-error');
    error.hidden=true;
    if(!inDate||!outDate||inDate<todayISO||outDate<=inDate){error.textContent='Please select valid dates, with check-out after check-in.';error.hidden=false;return}
    if(guests>room.max){error.textContent=`The ${room.name} can host up to ${room.max} guests. Please choose a different room or guest count.`;error.hidden=false;return}
    const nights=Math.round((new Date(outDate+'T12:00:00')-new Date(inDate+'T12:00:00'))/864e5);
    if(nights<=0||nights>60){error.textContent='Please choose a stay between 1 and 60 nights.';error.hidden=false;return}
    const name=$('#modal-name').value.trim();
    $('#result-title').textContent=`${nights} lovely night${nights===1?'':'s'} by the sea.`;
    $('#result-summary').replaceChildren();
    const lines=[['ROOM',room.name],['DATES',fmtDate(inDate)+' — '+fmtDate(outDate)],['GUESTS',`${guests} guest${guests===1?'':'s'}`],['NIGHTS',String(nights)]];
    for(const [label,value] of lines){const row=document.createElement('div');const strong=document.createElement('strong');strong.textContent=label+': ';const span=document.createElement('span');span.textContent=value;row.append(strong,span);$('#result-summary').append(row)}
    $('#result-total').textContent=`Estimated room total: ${currency(room.rate*nights)}`;
    enquiryString=`Ceylon Crest — Stay Enquiry\n${name?'Name: '+name+'\n':''}Room: ${room.name}\nCheck-in: ${fmtDate(inDate)}\nCheck-out: ${fmtDate(outDate)}\nGuests: ${guests}\nNights: ${nights}\nEstimated total: ${currency(room.rate*nights)}\n\nPlease confirm availability, final pricing and booking arrangements. This is not a confirmed reservation.`;
    bookingForm.hidden=true;bookingResult.hidden=false;
  });
  $('#edit-enquiry')?.addEventListener('click',()=>{bookingForm.hidden=false;bookingResult.hidden=true});
  $('#copy-enquiry')?.addEventListener('click',async()=>{const feedback=$('#copy-feedback');try{await navigator.clipboard.writeText(enquiryString);feedback.textContent='Enquiry copied. You can share it with the hotel.'}catch{const area=document.createElement('textarea');area.value=enquiryString;area.style.cssText='position:fixed;left:-10000px';document.body.append(area);area.select();let ok=false;try{ok=document.execCommand('copy')}catch{}area.remove();feedback.textContent=ok?'Enquiry copied.':'Copy unavailable. Please select and copy the summary above.'}});

  // Room details
  let detailRoom='garden';
  const roomDialog=$('#room-dialog');
  function showRoomDetails(key){if(!roomDialog||!hotelRooms[key])return;const r=hotelRooms[key];detailRoom=key;$('#room-dialog-image').src=r.image;$('#room-dialog-image').alt=r.name;$('#room-dialog-title').textContent=r.name;$('#room-dialog-desc').textContent=r.description;$('#room-dialog-price').textContent='Indicative rate from '+currency(r.rate)+' per night';roomDialog.showModal();document.body.classList.add('modal-open')}
  $$('.js-room-detail').forEach(x=>x.addEventListener('click',()=>showRoomDetails(x.dataset.room)));
  $$('.js-room-close').forEach(x=>x.addEventListener('click',()=>closeDialog(roomDialog)));
  roomDialog?.addEventListener('click',e=>{if(e.target===roomDialog)closeDialog(roomDialog)});
  roomDialog?.addEventListener('close',()=>document.body.classList.remove('modal-open'));
  $$('.js-detail-book').forEach(x=>x.addEventListener('click',()=>{closeDialog(roomDialog);openBooking(detailRoom)}));

  // Gallery modal
  const galleryDialog=$('#gallery-dialog');
  $$('.js-gallery').forEach(x=>x.addEventListener('click',()=>{if(!galleryDialog)return;$('#gallery-full').src=x.dataset.image;$('#gallery-full').alt=$('img',x)?.alt||'Hotel photo';$('#gallery-caption').textContent=x.dataset.caption||'';galleryDialog.showModal();document.body.classList.add('modal-open')}));
  $$('.js-lightbox-close').forEach(x=>x.addEventListener('click',()=>closeDialog(galleryDialog)));
  galleryDialog?.addEventListener('click',e=>{if(e.target===galleryDialog)closeDialog(galleryDialog)});
  galleryDialog?.addEventListener('close',()=>document.body.classList.remove('modal-open'));

  // On-page virtual concierge — rule-based local interaction; no network, staff or AI inference
  const chat=$('#chat-window'),fab=$('.chat-fab'),chatLog=$('#chat-transcript'),chatInput=$('#chat-input');
  const chatReplies={
    rooms:'There are three room types: Garden Room (2 guests), Ocean Room (2 guests) and Family Suite (4 guests). Indicative rates start at Rs. 24,500 per night. Use the Rooms page for details.',
    booking:'You can choose arrival and departure dates, the number of guests and your preferred room in our booking planner. The result is an enquiry preview — final availability and reservations must be confirmed with the property.',
    dining:'Our dining section shows the types of Sri Lankan meals and breakfast experiences associated with the property. Please confirm current menus and meal arrangements before arrival.',
    location:'Ceylon Crest is located on Sri Lanka’s southern coast. Exact directions and the property address need to be confirmed before travelling.',
    pool:'The site highlights a swimming pool and outdoor areas. Please ask the property to confirm which amenities are available during your stay.',
    hours:'Typical check-in is from 2:00 pm and check-out by 11:00 am. Please confirm exact timings with the property.',
    children:'Our Family Suite can accommodate up to 4 guests. For larger families or special requirements, please enquire with the property.',
    fallback:'I can answer general questions about rooms, rates, booking enquiries and facilities. For availability and personalised requests, please contact the hotel directly.'
  };
  function openChat(){if(!chat)return;chat.classList.add('open');chat.setAttribute('aria-hidden','false');fab?.setAttribute('aria-expanded','true');setTimeout(()=>chatInput?.focus(),150)}
  function closeChat(){chat?.classList.remove('open');chat?.setAttribute('aria-hidden','true');fab?.setAttribute('aria-expanded','false')}
  $$('.js-chat-open').forEach(x=>x.addEventListener('click',openChat));
  $$('.js-chat-toggle').forEach(x=>x.addEventListener('click',()=>chat?.classList.contains('open')?closeChat():openChat()));
  function addBubble(text,mine=false){const b=document.createElement('div');b.className='bubble '+(mine?'bubble-me':'bubble-bot');b.textContent=text;chatLog?.append(b);chatLog?.scrollTo({top:chatLog.scrollHeight,behavior:'smooth'});return b}
  function classify(t){const s=t.toLowerCase();if(/book|reserv|avail|stay|check.in|check.out|date/i.test(s))return'booking';if(/room|suite|bed|price|rate|cost|tariff/i.test(s))return'rooms';if(/food|eat|dining|breakfast|restaurant|meal/i.test(s))return'dining';if(/where|map|location|direction|address|near/i.test(s))return'location';if(/pool|spa|facility|amenity|wifi|parking/i.test(s))return'pool';if(/time|hour|arrival/i.test(s))return'hours';if(/kid|family|child/i.test(s))return'children';return'fallback'}
  function chatSend(message){const s=String(message).trim().slice(0,300);if(!s)return;addBubble(s,true);const category=classify(s);const typing=addBubble('Typing…');setTimeout(()=>{typing.textContent=chatReplies[category];if(category==='booking'){const action=document.createElement('button');action.type='button';action.textContent='Open booking planner ↗';action.className='chat-action';action.style.cssText='border:1px solid #9ab0a1;color:#173d34;background:#e9f2e9;padding:9px 11px;margin-top:9px;font-size:11px;font-weight:700;display:block;border-radius:3px';action.addEventListener('click',()=>{closeChat();openBooking()});typing.append(action)}chatLog?.scrollTo({top:chatLog.scrollHeight,behavior:'smooth'})},330)}
  $('#chat-form')?.addEventListener('submit',e=>{e.preventDefault();chatSend(chatInput.value);chatInput.value=''});
  $$('#chat-quick button').forEach(x=>x.addEventListener('click',()=>chatSend(x.textContent)));
})();
