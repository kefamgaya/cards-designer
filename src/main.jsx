import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { toJpeg, toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import {
  AlignCenter, AlignLeft, AlignRight, ArrowDownToLine, Check, ChevronDown, ChevronLeft, ChevronRight,
  Copy, Download, Image as ImageIcon, Flower2, Frame, GripVertical, Layers,
  HelpCircle, LoaderCircle, MousePointer2, Palette, Plus, RefreshCw, Scissors, Search,
  Redo2, Sparkles, Trash2, Type, Undo2, Upload, WandSparkles, X, ZoomIn, ZoomOut
} from 'lucide-react';
import './styles.css';

const templates = [
  { id: 'bahari', name: 'Golden Coast', mood: 'Classic', group: 'Wedding', bg: '#075968', accent: '#d8b84a', paper: '#f8f3e8', font: 'serif', layout: 'classic' },
  { id: 'waridi', name: 'Soft Rose', mood: 'Romantic', group: 'Wedding', bg: '#f4dadd', accent: '#954d5f', paper: '#fff8f5', font: 'script', layout: 'portrait' },
  { id: 'usiku', name: 'Royal Night', mood: 'Luxury', group: 'Wedding', bg: '#111c32', accent: '#ddb85c', paper: '#f6eddb', font: 'serif', layout: 'arch' },
  { id: 'mwitu', name: 'Green Garden', mood: 'Botanical', group: 'Wedding', bg: '#354d40', accent: '#d4b98d', paper: '#f7f1e7', font: 'serif', layout: 'botanical' },
  { id: 'pwani', name: 'Clean Coast', mood: 'Minimal', group: 'Wedding', bg: '#e9f2ef', accent: '#c67858', paper: '#243d3a', font: 'sans', layout: 'minimal' },
  { id: 'jua', name: 'Celebration Sun', mood: 'Joyful', group: 'Celebration', bg: '#f0a04b', accent: '#8f2737', paper: '#fff7e7', font: 'sans', layout: 'sun' },
  { id: 'zambarau', name: 'Purple Pearl', mood: 'Elegant', group: 'Wedding', bg: '#4d2b57', accent: '#dcc8b1', paper: '#fbf7f2', font: 'script', layout: 'pearl' },
  { id: 'terracotta', name: 'Terracotta Love', mood: 'Modern', group: 'Celebration', bg: '#9b4f3c', accent: '#f0c9a8', paper: '#fff7ef', font: 'serif', layout: 'editorial' },
  { id: 'anga', name: 'Sky of Blessings', mood: 'Faith', group: 'Celebration', bg: '#dbe7ee', accent: '#8c6a45', paper: '#2e4052', font: 'serif', layout: 'faith' },
  { id: 'kanga', name: 'Kanga Celebration', mood: 'Vibrant', group: 'Celebration', bg: '#efc53a', accent: '#0d6571', paper: '#fff7d8', font: 'sans', layout: 'kanga' },
  { id: 'ivory', name: 'Ivory Palace', mood: 'Royal', group: 'Wedding', bg: '#f2eadc', accent: '#9d7843', paper: '#332a25', font: 'serif', layout: 'classic' },
  { id: 'orchid', name: 'Midnight Orchid', mood: 'Glamour', group: 'Wedding', bg: '#24162e', accent: '#daa8c8', paper: '#fff4fa', font: 'script', layout: 'arch' },
  { id: 'kilimanjaro', name: 'Kilimanjaro Mist', mood: 'Calm', group: 'Celebration', bg: '#dfe9e8', accent: '#947354', paper: '#294548', font: 'sans', layout: 'minimal' },
  { id: 'kitenge', name: 'Kitenge Luxe', mood: 'Heritage', group: 'Celebration', bg: '#751b35', accent: '#efc45d', paper: '#fff4d4', font: 'serif', layout: 'kanga' }
];

const initial = {
  eventType: 'WEDDING INVITATION',
  couple: 'Name One & Name Two',
  hosts: 'Together with the Host Family',
  message: 'We joyfully invite you to celebrate our special day',
  date: '10 October 2026',
  time: '1:00 PM',
  venue: 'Ceremony Venue',
  reception: 'Reception to follow at Reception Venue',
  note: 'You are warmly welcome',
  contact: '+000 000 000 000',
  backMessage: 'Thank you for being part of our journey of love.',
  scripture: '“Two are better than one.” — Ecclesiastes 4:9',
  hashtag: '#NameOneAndNameTwo',
  recipientName: 'Guest Name',
};

const recipientTitles = ['Hon.', 'Prof.', 'Dr.', 'Rev.', 'Mr. & Mrs.', 'Mr.', 'Ms.'];

const decorativeItems = [
  { type: 'floral', symbol: '❀', label: 'Rose' },
  { type: 'leaf', symbol: '❧', label: 'Leaves' },
  { type: 'branch', symbol: '❦', label: 'Branch' },
  { type: 'heart', symbol: '♥', label: 'Heart' },
  { type: 'sparkle', symbol: '✦', label: 'Sparkle' },
  { type: 'rings', symbol: '◉', label: 'Rings' },
];

const fontChoices = [
  { id: 'modern', label: 'DM Sans' }, { id: 'sans', label: 'Manrope' },
  { id: 'poppins', label: 'Poppins' }, { id: 'montserrat', label: 'Montserrat' },
  { id: 'serif', label: 'Instrument Serif' }, { id: 'playfair', label: 'Playfair Display' },
  { id: 'cormorant', label: 'Cormorant Garamond' }, { id: 'lora', label: 'Lora' },
  { id: 'libre', label: 'Libre Baskerville' }, { id: 'bodoni', label: 'Bodoni Moda' },
  { id: 'cinzel', label: 'Cinzel' }, { id: 'script', label: 'Parisienne' },
  { id: 'greatvibes', label: 'Great Vibes' }, { id: 'allura', label: 'Allura' },
  { id: 'classic', label: 'Instrument Serif' },
];

const palettePresets = [
  ['#0b3d38','#caa85e','#f8f0dd'],
  ['#24162e','#d8b8a2','#fff6ef'],
  ['#6f263d','#e7c7a1','#fff7ee'],
  ['#13243b','#d9b45f','#f5ead5'],
  ['#e8ddd2','#9d5f50','#382b29'],
  ['#143f52','#8cc6c0','#fffaf0'],
];

const premiumFrames = [
  ['none','None'],['fine','Minimal'],['double','Classic'],['arch','Arch'],
  ['deco','Art Deco'],['botanical','Botanical'],['pearl','Pearl'],['royal','Royal'],
  ['corners','Corners'],['scallop','Scallop'],['geometric','Geo Luxe'],['ribbon','Ribbon'],
  ['lace','Lace'],['modern','Modern'],['vintage','Vintage'],['kanga','Kanga']
];

const photoShapes = [
  ['template', 'Template'], ['arch', 'Arch'], ['oval', 'Oval'],
  ['circle', 'Circle'], ['rounded', 'Rounded'], ['organic', 'Organic'],
  ['diamond', 'Diamond'], ['shield', 'Shield'], ['octagon', 'Octagon']
];

const textLabels = {
  eventType: 'Event type', hosts: 'Family / hosts', message: 'Message',
  couple: 'Names', date: 'Date', time: 'Time', venue: 'Venue',
  reception: 'Reception details', note: 'Closing message', contact: 'RSVP',
  backMessage: 'Back message', scripture: 'Quote / scripture', hashtag: 'Hashtag'
  ,recipientName: 'Guest name'
};
const defaultTextSizes = { eventType:24, hosts:37, message:25, couple:106, date:34, time:28, venue:28, reception:28, note:22, contact:17, backMessage:40, scripture:27, hashtag:25 };
const fontFamilies = {
  serif: '"Instrument Serif", serif', script: 'Parisienne, cursive', sans: 'Manrope, sans-serif',
  classic: '"Instrument Serif", serif', modern: 'DM Sans, sans-serif', poppins: 'Poppins, sans-serif',
  montserrat: 'Montserrat, sans-serif', playfair: '"Playfair Display", serif',
  cormorant: '"Cormorant Garamond", serif', lora: 'Lora, serif',
  libre: '"Libre Baskerville", serif', bodoni: '"Bodoni Moda", serif',
  cinzel: 'Cinzel, serif', greatvibes: '"Great Vibes", cursive', allura: 'Allura, cursive'
};

const tourSteps = [
  { selector: null, title: 'Welcome to Sherehe Studio', text: 'Create a polished front-and-back celebration card in a few simple steps. This short tour shows you where everything lives.', side: 'center' },
  { selector: '.templates-panel', title: 'Choose a template', text: 'Start with a design you like. You can change templates at any time without losing your event details.', side: 'right' },
  { selector: '.canvas-stage', title: 'Edit directly on the card', text: 'Click any text on the canvas and type. What you see here is what will be exported.', side: 'center' },
  { selector: '.format-ribbon', title: 'Format the selected text', text: 'Use the top toolbar to change each text item’s font, size, style, alignment, and color.', side: 'bottom' },
  { selector: '.history-tools', title: 'Undo, redo, or delete', text: 'Reverse a change, restore it, or delete the item currently selected on the canvas.', side: 'bottom' },
  { selector: '.photo-section', title: 'Add and shape your photo', text: 'Upload a photo, remove its background, choose a shape, or switch the photo frame off.', side: 'left' },
  { selector: '.custom-text-tools', title: 'Add your own text', text: 'Create extra text blocks, type directly on the card, and drag them wherever you want.', side: 'left' },
  { selector: '.editor-panel', title: 'Add finishing touches', text: 'Use this panel for flowers, decorations, photo controls, and optional card frames.', side: 'left' },
  { selector: '.export-wrap', title: 'Download your finished card', text: 'Export the front and back as PNG, JPG, PDF, or a ZIP containing every format.', side: 'left' }
];

function ProductTour({ step, onNext, onBack, onClose, onStep }) {
  const [target, setTarget] = useState(null);
  const cardRef = useRef(null);
  const item = tourSteps[step];
  useEffect(() => {
    if (!item.selector) { setTarget(null); return; }
    const element = document.querySelector(item.selector);
    if (!element) { setTarget(null); return; }
    const update = () => {
      const rect = element.getBoundingClientRect();
      setTarget({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
    };
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    update();
    const settle = window.setTimeout(update, 280);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => { window.clearTimeout(settle); window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); };
  }, [item.selector]);
  useEffect(() => {
    cardRef.current?.focus();
    const keyboard = event => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNext();
      if (event.key === 'ArrowLeft' && step > 0) onBack();
    };
    window.addEventListener('keydown', keyboard);
    return () => window.removeEventListener('keydown', keyboard);
  }, [step, onNext, onBack, onClose]);
  const cardStyle = (() => {
    if (!target) return { left: '50%', top: '50%', transform: 'translate(-50%,-50%)' };
    const width = 350, height = 275, gap = 18, edge = 18;
    const clampX = value => Math.max(edge, Math.min(value, window.innerWidth - width - edge));
    const clampY = value => Math.max(edge, Math.min(value, window.innerHeight - height - edge));
    if (item.side === 'right') return { left: clampX(target.left + target.width + gap), top: clampY(target.top + 45) };
    if (item.side === 'left') return { left: clampX(target.left - width - gap), top: clampY(target.top + 45) };
    if (item.side === 'bottom') return { left: clampX(target.left + target.width / 2 - width / 2), top: clampY(target.top + target.height + gap) };
    return { left: clampX(target.left + target.width / 2 - width / 2), top: clampY(target.top + 28) };
  })();
  return <div className={`tour-layer tour-side-${item.side}`} role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-description">
    {target && <div className="tour-highlight" style={{ left: target.left - 6, top: target.top - 6, width: target.width + 12, height: target.height + 12 }}/>} 
    <div className="tour-card" ref={cardRef} style={cardStyle} tabIndex="-1">
      <div className="tour-card-top"><span>{step === 0 ? 'WELCOME' : 'QUICK TOUR'}</span><button onClick={onClose} aria-label="Close tour"><X size={17}/></button></div>
      <div className="tour-progress" aria-label={`Tour progress: step ${step + 1} of ${tourSteps.length}`}>{tourSteps.map((tourItem, index) => <button key={tourItem.title} className={index <= step ? 'active' : ''} aria-label={`Go to step ${index + 1}: ${tourItem.title}`} aria-current={index === step ? 'step' : undefined} onClick={() => onStep(index)}/>)}</div>
      <small>Step {step + 1} of {tourSteps.length}</small>
      <h2 id="tour-title">{item.title}</h2><p id="tour-description">{item.text}</p>
      <div className="tour-actions">{step > 0 ? <button className="tour-back" onClick={onBack}><ChevronLeft size={15}/> Back</button> : <button className="tour-skip" onClick={onClose}>Skip</button>}<span className="tour-key-hint">Use ← → keys</span><button className="tour-next" onClick={onNext}>{step === tourSteps.length - 1 ? 'Start designing' : step === 0 ? 'Show me around' : 'Next'}{step < tourSteps.length - 1 && <ChevronRight size={15}/>}</button></div>
    </div>
  </div>;
}

function StudioDropdown({ value, options, onChange, ariaLabel, compact = false }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(option => option.value === value) || options[0];
  return <div className={`studio-select ${compact ? 'compact' : ''} ${open ? 'open' : ''}`} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button type="button" className="studio-select-trigger" aria-label={ariaLabel} aria-expanded={open} onClick={() => setOpen(current => !current)}>
      <span style={selected.font ? {fontFamily: fontFamilies[selected.font]} : undefined}>{selected.label}</span><ChevronDown size={13}/>
    </button>
    {open && <div className="studio-select-menu">{options.map(option => <button type="button" key={option.value} className={option.value === value ? 'active' : ''} onClick={() => { onChange(option.value); setOpen(false); }}><span style={option.font ? {fontFamily: fontFamilies[option.font]} : undefined}>{option.label}</span>{option.value === value && <Check size={13}/>}</button>)}</div>}
  </div>;
}

const hexRgb = hex => {
  const clean = String(hex || '').replace('#', '');
  const value = clean.length === 3 ? clean.split('').map(x => x + x).join('') : clean;
  if (!/^[0-9a-f]{6}$/i.test(value)) return [7, 89, 104];
  return [0, 2, 4].map(i => parseInt(value.slice(i, i + 2), 16));
};
const luminance = hex => hexRgb(hex).map(v => { const c = v / 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }).reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0);
const contrastRatio = (a, b) => { const [bright, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (bright + .05) / (dark + .05); };

function CardArtwork({ template, data, photo, side = 'front', photoShape = 'template', photoFrame = true, showPhoto = true, showRecipient = true, editable = false, onUpdate, onSelectText, onContextMenu, textStyles = {}, ornaments = [], onMoveOrnament, onRemoveOrnament, onSelectOrnament, selectedOrnament, recipientStrikes = {}, onToggleRecipientTitle, customTexts = [], onUpdateCustomText, onMoveCustomText, onRemoveCustomText, frame = 'none', chosenFont, backgroundStyle, titleScale = 1, textAlign = '' }) {
  const hasPhoto = Boolean(photo) && showPhoto;
  const ink = luminance(template.bg) > .42 ? '#17211f' : '#fffaf2';
  const safeAccent = contrastRatio(template.accent, template.bg) >= 3 ? template.accent : ink;
  const edit = (key, multiline = false) => editable ? {
    contentEditable: true,
    suppressContentEditableWarning: true,
    'data-editable': key,
    onFocus: () => onSelectText?.(key),
    onPointerDown: e => { e.stopPropagation(); onSelectText?.(key); },
    onContextMenu: e => { e.preventDefault(); e.stopPropagation(); onSelectText?.(key); onContextMenu?.(e, { type: 'text', key }); },
    onBlur: e => onUpdate?.(key, e.currentTarget.innerText.trim()),
    onKeyDown: e => { if (!multiline && e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }
  } : {};
  const textStyle = key => {
    const style = textStyles[key] || {};
    return {
      ...(style.font ? { fontFamily: fontFamilies[style.font] } : {}),
      ...(style.size ? { fontSize: `${style.size}px` } : {}),
      ...(style.bold !== undefined ? { fontWeight: style.bold ? 700 : 400 } : {}),
      ...(style.italic !== undefined ? { fontStyle: style.italic ? 'italic' : 'normal' } : {}),
      ...(style.color ? { color: style.color } : {}),
      ...(style.align ? { textAlign: style.align, alignSelf: style.align === 'left' ? 'flex-start' : style.align === 'right' ? 'flex-end' : 'center' } : {})
    };
  };
  const dragStart = (e, item) => {
    if (!editable) return;
    e.preventDefault(); e.stopPropagation();
    const el = e.currentTarget;
    const rect = el.closest('.artwork').getBoundingClientRect();
    const scale = 1600 / rect.width;
    const startX = e.clientX, startY = e.clientY;
    el.setPointerCapture?.(e.pointerId);
    const move = ev => onMoveOrnament?.(item.id, item.x + (ev.clientX - startX) * scale, item.y + (ev.clientY - startY) * scale);
    const done = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', done); };
    el.addEventListener('pointermove', move); el.addEventListener('pointerup', done);
  };
  const dragCustomText = (e, item) => {
    if (!editable) return;
    e.preventDefault(); e.stopPropagation();
    const rect = e.currentTarget.closest('.artwork').getBoundingClientRect();
    const scale = 1600 / rect.width, startX = e.clientX, startY = e.clientY;
    const move = ev => onMoveCustomText?.(item.id, item.x + (ev.clientX - startX) * scale, item.y + (ev.clientY - startY) * scale);
    const done = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', done); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', done);
  };
  return (
    <div className={`artwork template-${template.id} photo-shape-${photoShape} ${photoFrame ? 'photo-frame-on' : 'photo-frame-off'} side-${side} layout-${template.layout} frame-${frame} ${editable ? 'is-editable' : ''} ${textAlign ? `text-${textAlign}` : ''}`} style={{ '--bg': template.bg, '--accent': template.accent, '--accent-safe': safeAccent, '--paper': template.paper, '--ink': ink, background: backgroundStyle || template.bg }} onPointerDown={e => { if (e.target === e.currentTarget) onSelectOrnament?.(null); }} onContextMenu={e => { e.preventDefault(); onContextMenu?.(e, { type: 'canvas' }); }}>
      <div className="texture" />
      <div className="grain" />
      <div className="frame-overlay" />
      <div className="orbit orbit-a" /><div className="orbit orbit-b" />
      <div className="petals petals-a"><i/><i/><i/><i/></div>
      <div className="petals petals-b"><i/><i/><i/><i/></div>
      <div className="monogram">{data.couple.split('&').map(s => s.trim()[0]).join(' · ')}</div>
      {side === 'front' && <div className={`${template.layout === 'portrait' ? 'photo-frame' : 'universal-photo'} hero-photo`}>{hasPhoto ? <img src={photo} alt="Couple" /> : <><ImageIcon size={54}/><b>Main photo</b><span>Upload the couple’s photo</span></>}</div>}
      {side === 'front' ? <><div className="card-copy">
        <p className="eyebrow" style={textStyle('eventType')} {...edit('eventType')}>{data.eventType}</p>
        <p className="hosts" style={textStyle('hosts')} {...edit('hosts')}>{data.hosts}</p>
        <p className="message" style={textStyle('message')} {...edit('message', true)}>{data.message}</p>
        {showRecipient && <div className="recipient-block">
          <div className="recipient-titles">{recipientTitles.map(title => <button key={title} type="button" className={recipientStrikes[title] ? 'struck' : ''} disabled={!editable} onClick={() => onToggleRecipientTitle?.(title)}>{title}</button>)}</div>
          <span className="recipient-name" style={textStyle('recipientName')} {...edit('recipientName')}>{data.recipientName}</span>
        </div>}
        <h1 className={chosenFont || template.font} style={{ fontSize: `${(chosenFont === 'script' || (!chosenFont && template.font === 'script') ? 126 : 106) * titleScale}px`, ...textStyle('couple') }} {...edit('couple')}>{data.couple}</h1>
        <div className="rule"><span>✦</span></div>
        <div className="details">
          <p className="date" style={textStyle('date')} {...edit('date')}>{data.date}</p>
          <p><span style={textStyle('time')} {...edit('time')}>{data.time}</span> · <span style={textStyle('venue')} {...edit('venue')}>{data.venue}</span></p>
          <p style={textStyle('reception')} {...edit('reception', true)}>{data.reception}</p>
        </div>
        <p className="note" style={textStyle('note')} {...edit('note')}>{data.note}</p>
      </div>
      <div className="contact">RSVP <span style={textStyle('contact')} {...edit('contact')}>{data.contact}</span></div></> : <div className="back-copy">
        <p className="back-kicker" style={textStyle('eventType')} {...edit('eventType')}>{data.eventType}</p>
        <h1 className={chosenFont || template.font} style={textStyle('couple')} {...edit('couple')}>{data.couple}</h1>
        <p className="back-message" style={textStyle('backMessage')} {...edit('backMessage', true)}>{data.backMessage}</p>
        <p className="hashtag" style={textStyle('hashtag')} {...edit('hashtag')}>{data.hashtag}</p>
        <p className="back-rsvp">RSVP <span style={textStyle('contact')} {...edit('contact')}>{data.contact}</span></p>
      </div>}
      {ornaments.map(item => <div
        key={item.id}
        className={`canvas-ornament ornament-${item.type} ${selectedOrnament === item.id ? 'ornament-selected' : ''}`}
        style={{ left: item.x, top: item.y, fontSize: item.size, transform: `translate(-50%,-50%) rotate(${item.rotation}deg)` }}
        onPointerDown={e => { onSelectOrnament?.(item.id); dragStart(e, item); }}
        onContextMenu={e => { e.preventDefault(); e.stopPropagation(); onSelectOrnament?.(item.id); onContextMenu?.(e, { type: 'ornament', id: item.id }); }}
        onDoubleClick={() => editable && onRemoveOrnament?.(item.id)}
        title={editable ? 'Drag to move · double-click to remove' : undefined}
      >{item.symbol}</div>)}
      {customTexts.filter(item => item.side === side).map(item => <div key={item.id} className="custom-text-block" style={{ left:item.x, top:item.y, ...textStyle(item.id) }} onPointerDown={() => onSelectText?.(item.id)}>
        {editable && <button className="custom-text-handle" title="Drag text" onPointerDown={e => dragCustomText(e,item)}><GripVertical size={16}/></button>}
        <span contentEditable={editable} suppressContentEditableWarning data-editable={editable ? item.id : undefined} onFocus={() => onSelectText?.(item.id)} onBlur={e => onUpdateCustomText?.(item.id,e.currentTarget.innerText.trim())}>{item.text}</span>
        {editable && <button className="custom-text-delete" title="Delete text" onClick={() => onRemoveCustomText?.(item.id)}><X size={13}/></button>}
      </div>)}
    </div>
  );
}

function TemplateThumb({ template, active, onClick }) {
  const tiny = { ...initial, couple: 'Name One & Name Two', hosts: 'Together with their families', message: 'invite you to celebrate their love', date: '12 · 12 · 2026', time: '3:00 PM', venue: 'Venue Name', reception: '', note: 'Our love, our joy' };
  return <button className={`template-card ${active ? 'active' : ''}`} onClick={onClick}>
    <div className="thumb"><CardArtwork template={template} data={tiny} showPhoto={false} showRecipient={false}/></div>
    <span><b>{template.name}</b><small>{template.mood}</small></span>
    {active && <i className="selected"><Check size={12}/></i>}
  </button>
}

function App() {
  const [templateId, setTemplateId] = useState('bahari');
  const [data, setData] = useState(initial);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [chosenFont, setChosenFont] = useState('');
  const [frame, setFrame] = useState('none');
  const [photoShape, setPhotoShape] = useState('template');
  const [photoFrame, setPhotoFrame] = useState(true);
  const [ornaments, setOrnaments] = useState([]);
  const [recipientStrikes, setRecipientStrikes] = useState({});
  const [customTexts, setCustomTexts] = useState([]);
  const [selectedOrnament, setSelectedOrnament] = useState(null);
  const [colors, setColors] = useState({ bg: '', accent: '', paper: '' });
  const [titleScale, setTitleScale] = useState(1);
  const [textAlign, setTextAlign] = useState('');
  const [selectedText, setSelectedText] = useState('couple');
  const [textStyles, setTextStyles] = useState({});
  const [zoom, setZoom] = useState(0.55);
  const [status, setStatus] = useState('');
  const [exportOpen, setExportOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [side, setSide] = useState('front');
  const [contextMenu, setContextMenu] = useState(null);
  const [clipboard, setClipboard] = useState(null);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [historyVersion, setHistoryVersion] = useState(0);
  const canvasRef = useRef(null);
  const frontExportRef = useRef(null);
  const backExportRef = useRef(null);
  const uploadRef = useRef(null);
  const historyRef = useRef([]);
  const futureRef = useRef([]);
  const lastSnapshotRef = useRef(null);
  const restoringRef = useRef(false);
  const baseTemplate = templates.find(t => t.id === templateId);
  const template = { ...baseTemplate, bg: colors.bg || baseTemplate.bg, accent: colors.accent || baseTemplate.accent, paper: colors.paper || baseTemplate.paper };
  const backgroundStyle = template.bg;
  const filtered = useMemo(() => templates.filter(t => (filter === 'All' || t.group === filter) && `${t.name} ${t.mood}`.toLowerCase().includes(query.toLowerCase())), [query, filter]);
  const selectedItem = ornaments.find(item => item.id === selectedOrnament);
  const selectedTextStyle = textStyles[selectedText] || {};
  const ribbonFont = selectedTextStyle.font || (selectedText === 'couple' ? template.font : ['hosts','date','time','venue','reception'].includes(selectedText) ? 'serif' : 'modern');
  const ribbonSize = selectedTextStyle.size || defaultTextSizes[selectedText] || 24;
  const ribbonColor = selectedTextStyle.color || (['eventType','couple','date','note'].includes(selectedText) ? template.accent : template.paper);
  const historySnapshot = useMemo(() => ({
    templateId, data, chosenFont, frame, photoShape, photoFrame, ornaments,
    recipientStrikes, customTexts, colors, titleScale, textAlign, textStyles
  }), [templateId, data, chosenFont, frame, photoShape, photoFrame, ornaments, recipientStrikes, customTexts, colors, titleScale, textAlign, textStyles]);
  useEffect(() => {
    const current = JSON.parse(JSON.stringify(historySnapshot));
    if (!lastSnapshotRef.current) { lastSnapshotRef.current = current; return; }
    if (restoringRef.current) { restoringRef.current = false; lastSnapshotRef.current = current; return; }
    historyRef.current = [...historyRef.current.slice(-59), lastSnapshotRef.current];
    futureRef.current = [];
    lastSnapshotRef.current = current;
    setHistoryVersion(value => value + 1);
  }, [historySnapshot]);
  useEffect(() => {
    try { if (!localStorage.getItem('sherehe-studio-tour-seen-v3')) setTourOpen(true); } catch { setTourOpen(true); }
  }, []);
  const startTour = () => { setTourStep(0); setTourOpen(true); };
  const closeTour = () => {
    setTourOpen(false); setTourStep(0);
    try { localStorage.setItem('sherehe-studio-tour-seen-v3', '1'); } catch {}
  };
  const reset = () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setData(initial); setTemplateId('bahari'); setPhotoFile(null); setPhotoUrl('');
    setQuery(''); setFilter('All'); setChosenFont(''); setFrame('none'); setPhotoShape('template'); setPhotoFrame(true); setOrnaments([]); setRecipientStrikes({}); setCustomTexts([]); setSelectedOrnament(null);
    setColors({ bg: '', accent: '', paper: '' }); setTitleScale(1); setTextAlign(''); setSelectedText('couple'); setTextStyles({}); setSide('front'); setContextMenu(null); setStatus('Your new card is ready ✓');
    setTimeout(() => setStatus(''), 2500);
  };

  const update = (key, value) => setData(d => ({ ...d, [key]: value }));
  const applySnapshot = snapshot => {
    setTemplateId(snapshot.templateId); setData(snapshot.data); setChosenFont(snapshot.chosenFont);
    setFrame(snapshot.frame); setPhotoShape(snapshot.photoShape); setPhotoFrame(snapshot.photoFrame);
    setOrnaments(snapshot.ornaments); setRecipientStrikes(snapshot.recipientStrikes);
    setCustomTexts(snapshot.customTexts); setColors(snapshot.colors); setTitleScale(snapshot.titleScale);
    setTextAlign(snapshot.textAlign); setTextStyles(snapshot.textStyles);
    setSelectedOrnament(null); setSelectedText('couple'); setContextMenu(null);
  };
  const undo = () => {
    const previous = historyRef.current.pop(); if (!previous) return;
    futureRef.current = [...futureRef.current, lastSnapshotRef.current];
    restoringRef.current = true; lastSnapshotRef.current = previous; applySnapshot(previous);
    setHistoryVersion(value => value + 1); setStatus('Change undone'); setTimeout(() => setStatus(''), 1200);
  };
  const redo = () => {
    const next = futureRef.current.pop(); if (!next) return;
    historyRef.current = [...historyRef.current, lastSnapshotRef.current];
    restoringRef.current = true; lastSnapshotRef.current = next; applySnapshot(next);
    setHistoryVersion(value => value + 1); setStatus('Change restored'); setTimeout(() => setStatus(''), 1200);
  };
  const toggleRecipientTitle = title => setRecipientStrikes(current => ({...current,[title]:!current[title]}));
  const addCustomText = () => {
    const id = `custom-${Date.now()}`;
    setCustomTexts(items => [...items,{id,text:'Your custom text',x:800,y:560,side}]);
    setSelectedText(id);
  };
  const updateCustomText = (id,text) => setCustomTexts(items => items.map(item => item.id === id ? {...item,text} : item));
  const moveCustomText = (id,x,y) => setCustomTexts(items => items.map(item => item.id === id ? {...item,x:Math.max(80,Math.min(1520,x)),y:Math.max(40,Math.min(1085,y))} : item));
  const removeCustomText = id => { setCustomTexts(items => items.filter(item => item.id !== id)); setTextStyles(styles => { const next={...styles}; delete next[id]; return next; }); setSelectedText('couple'); };
  const updateTextStyle = patch => setTextStyles(styles => ({ ...styles, [selectedText]: { ...(styles[selectedText] || {}), ...patch } }));
  const resetTextStyle = () => setTextStyles(styles => { const next = {...styles}; delete next[selectedText]; return next; });
  const addOrnament = item => {
    const id = `${item.type}-${Date.now()}-${ornaments.length}`;
    setOrnaments(current => [...current, {
      ...item, id, x: 270 + (current.length % 4) * 350, y: 230 + (current.length % 3) * 310,
      size: item.type === 'rings' ? 92 : 82, rotation: (current.length % 2 ? 12 : -10)
    }]);
    setSelectedOrnament(id);
  };
  const moveOrnament = (id, x, y) => setOrnaments(items => items.map(item => item.id === id ? { ...item, x: Math.max(35, Math.min(1565, x)), y: Math.max(35, Math.min(1090, y)) } : item));
  const updateOrnament = (id, patch) => setOrnaments(items => items.map(item => item.id === id ? { ...item, ...patch } : item));
  const removeOrnament = id => { setOrnaments(items => items.filter(item => item.id !== id)); setSelectedOrnament(null); };
  const selectText = id => { setSelectedText(id); setSelectedOrnament(null); };
  const deleteSelected = () => {
    if (selectedOrnament) removeOrnament(selectedOrnament);
    else if (selectedText.startsWith('custom-')) removeCustomText(selectedText);
    else if (Object.prototype.hasOwnProperty.call(data, selectedText)) update(selectedText, '');
    else return;
    setContextMenu(null); setStatus('Selected item deleted'); setTimeout(() => setStatus(''), 1400);
  };
  const duplicateOrnament = id => {
    const source = ornaments.find(item => item.id === id); if (!source) return;
    const copy = { ...source, id: `${source.type}-${Date.now()}`, x: Math.min(1565, source.x + 80), y: Math.min(1090, source.y + 80) };
    setOrnaments(items => [...items, copy]); setSelectedOrnament(copy.id);
  };
  const openContextMenu = (event, target) => {
    setContextMenu({ ...target, x: Math.min(event.clientX, window.innerWidth - 220), y: Math.min(event.clientY, window.innerHeight - 250) });
  };
  const copySelection = (cut = false) => {
    if (!contextMenu) return;
    if (contextMenu.type === 'text') {
      const value = data[contextMenu.key] || '';
      setClipboard({ type: 'text', value });
      navigator.clipboard?.writeText(value).catch(() => {});
      if (cut) update(contextMenu.key, '');
    } else if (contextMenu.type === 'ornament') {
      const item = ornaments.find(o => o.id === contextMenu.id);
      if (item) setClipboard({ type: 'ornament', value: item });
      if (cut) removeOrnament(contextMenu.id);
    }
    setContextMenu(null); setStatus(cut ? 'Cut ✓' : 'Copied ✓'); setTimeout(() => setStatus(''), 1400);
  };
  const pasteSelection = async () => {
    if (!contextMenu) return;
    if (contextMenu.type === 'text') {
      let value = clipboard?.type === 'text' ? clipboard.value : '';
      if (!value) { try { value = await navigator.clipboard?.readText(); } catch {} }
      if (value) update(contextMenu.key || selectedText, value);
    } else if (clipboard?.type === 'ornament') {
      const source = clipboard.value;
      const item = { ...source, id: `${source.type}-${Date.now()}`, x: Math.min(1565, source.x + 70), y: Math.min(1090, source.y + 70) };
      setOrnaments(items => [...items, item]); setSelectedOrnament(item.id);
    }
    setContextMenu(null);
  };
  const reorderOrnament = (id, front) => setOrnaments(items => {
    const item = items.find(o => o.id === id); if (!item) return items;
    const rest = items.filter(o => o.id !== id); return front ? [...rest, item] : [item, ...rest];
  });
  const chooseTemplate = id => {
    setTemplateId(id); setColors({ bg: '', accent: '', paper: '' });
    setChosenFont(''); setTitleScale(1); setTextAlign(''); setSelectedText('couple'); setTextStyles({});
  };
  const handlePhoto = (file) => {
    if (!file) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoFile(file); setPhotoUrl(URL.createObjectURL(file));
  };
  const removeBg = async () => {
    if (!photoFile) return uploadRef.current?.click();
    try {
      setRemoving(true); setProgress(4); setStatus('Loading the AI model for the first time…');
      const { removeBackground } = await import('@bg0/browser');
      const result = await removeBackground(photoFile, {
        quality: 'quality',
        onProgress: ({ progress: nextProgress }) => setProgress(Math.round(nextProgress <= 1 ? nextProgress * 100 : nextProgress))
      });
      const blob = result.blob;
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      setPhotoUrl(URL.createObjectURL(blob));
      setPhotoFile(new File([blob], 'picha-bila-background.png', { type: 'image/png' }));
      setStatus('Background removed ✓');
    } catch (e) {
      console.error(e); setStatus('Background removal failed. Try Chrome with a stable connection.');
    } finally { setRemoving(false); setTimeout(() => setStatus(''), 4500); }
  };

  const render = async (type, pageSide = side) => {
    const node = pageSide === 'front' ? frontExportRef.current : backExportRef.current;
    setStatus(`Preparing ${type.toUpperCase()}…`);
    const opts = { width: 1600, height: 1125, pixelRatio: 1, cacheBust: true };
    try {
      if (type === 'png') return await toPng(node, opts);
      return await toJpeg(node, { ...opts, quality: .96, backgroundColor: template.bg });
    } finally {}
  };
  const downloadUrl = (url, name) => { const a = document.createElement('a'); a.href = url; a.download = name; a.click(); };
  const exportOne = async (type) => {
    try {
      setExportOpen(false);
      if (type === 'pdf') {
        const front = await render('png', 'front');
        const back = await render('png', 'back');
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1600, 1125], hotfixes: ['px_scaling'] });
        pdf.addImage(front, 'PNG', 0, 0, 1600, 1125); pdf.addPage([1600,1125], 'landscape'); pdf.addImage(back, 'PNG', 0, 0, 1600, 1125); pdf.save('card-front-and-back.pdf');
      } else downloadUrl(await render(type, side), `card-${side}.${type === 'jpeg' ? 'jpg' : 'png'}`);
      setStatus(`${type.toUpperCase()} is ready ✓`);
    } catch (e) { console.error(e); setStatus('Export failed. Please try again.'); }
    setTimeout(() => setStatus(''), 3200);
  };
  const exportZip = async () => {
    try {
      setExportOpen(false); setStatus('Preparing a ZIP with all files…');
      const frontPng = await render('png', 'front'); const backPng = await render('png', 'back');
      const frontJpg = await render('jpeg', 'front'); const backJpg = await render('jpeg', 'back');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1600, 1125], hotfixes: ['px_scaling'] });
      pdf.addImage(frontPng, 'PNG', 0, 0, 1600, 1125); pdf.addPage([1600,1125], 'landscape'); pdf.addImage(backPng, 'PNG', 0, 0, 1600, 1125);
      const zip = new JSZip();
      zip.file('card-front.png', frontPng.split(',')[1], { base64: true }); zip.file('card-back.png', backPng.split(',')[1], { base64: true });
      zip.file('card-front.jpg', frontJpg.split(',')[1], { base64: true }); zip.file('card-back.jpg', backJpg.split(',')[1], { base64: true });
      zip.file('card-front-and-back.pdf', pdf.output('arraybuffer'));
      const blob = await zip.generateAsync({ type: 'blob' });
      downloadUrl(URL.createObjectURL(blob), 'celebration-card.zip'); setStatus('ZIP is ready ✓');
    } catch(e) { console.error(e); setStatus('ZIP export failed. Please try again.'); }
    setTimeout(() => setStatus(''), 3200);
  };

  return <div className="app-shell" onPointerDown={() => setContextMenu(null)}>
    <header>
      <a className="brand" href="#"><span className="brand-mark">S</span><span>Sherehe <em>Studio</em></span></a>
      <div className="header-center"><span className="saved"><Check size={14}/> Saved</span><span className="divider"/> New celebration card</div>
      <div className="header-actions">
        <button className="ghost tour-launch" onClick={startTour}><HelpCircle size={16}/> Tour</button>
        <button className="ghost" onClick={reset}><RefreshCw size={16}/> Start over</button>
        <div className="export-wrap">
          <button className="export" onClick={() => setExportOpen(v => !v)}><Download size={17}/> Download <ChevronDown size={15}/></button>
          {exportOpen && <div className="export-menu">
            <p>Choose a file type</p>
            <button onClick={() => exportOne('png')}><span>PNG</span><small>High quality · transparent</small></button>
            <button onClick={() => exportOne('jpeg')}><span>JPG</span><small>Easy to share on WhatsApp</small></button>
            <button onClick={() => exportOne('pdf')}><span>PDF</span><small>Ready for printing</small></button>
            <button onClick={exportZip}><span>ZIP</span><small>PNG + JPG + PDF together</small></button>
          </div>}
        </div>
      </div>
    </header>

    <div className="format-ribbon">
      <div className="ribbon-context"><span>FORMAT TEXT</span><b>{textLabels[selectedText] || 'Custom text'}</b><small>Click any text on the card</small></div>
      <div className="ribbon-divider"/>
      <div className="ribbon-group font-ribbon"><label className="font-picker-label">Font<StudioDropdown ariaLabel="Choose a font" value={ribbonFont} options={fontChoices.map(({id,label}) => ({value:id,label,font:id}))} onChange={font => updateTextStyle({font})}/></label><label className="size-input">Size<input type="number" min="10" max="180" value={ribbonSize} onChange={e => updateTextStyle({size:Number(e.target.value)})}/></label></div>
      <div className="ribbon-group ribbon-buttons"><span>Style</span><div><button className={selectedTextStyle.bold?'active':''} onClick={() => updateTextStyle({bold:!selectedTextStyle.bold})}><b>B</b></button><button className={selectedTextStyle.italic?'active':''} onClick={() => updateTextStyle({italic:!selectedTextStyle.italic})}><i>I</i></button><label className="ribbon-color" title="Text color"><input type="color" value={ribbonColor} onChange={e => updateTextStyle({color:e.target.value})}/><span style={{background:ribbonColor}}/></label></div></div>
      <div className="ribbon-group ribbon-buttons"><span>Align</span><div><button className={selectedTextStyle.align==='left'?'active':''} onClick={() => updateTextStyle({align:'left'})}><AlignLeft size={16}/></button><button className={selectedTextStyle.align==='center'?'active':''} onClick={() => updateTextStyle({align:'center'})}><AlignCenter size={16}/></button><button className={selectedTextStyle.align==='right'?'active':''} onClick={() => updateTextStyle({align:'right'})}><AlignRight size={16}/></button></div></div>
      <button className="ribbon-reset" onClick={resetTextStyle}><RefreshCw size={14}/> Reset text</button>
      <div className="ribbon-divider"/>
      <div className="ribbon-group history-tools"><span>Actions</span><div><button onClick={undo} disabled={!historyRef.current.length} title="Undo"><Undo2 size={15}/></button><button onClick={redo} disabled={!futureRef.current.length} title="Redo"><Redo2 size={15}/></button><button className="delete-selected" onClick={deleteSelected} title="Delete selected item"><Trash2 size={15}/><b>Delete</b></button></div></div>
      <div className="ribbon-divider"/>
      <div className="ribbon-group design-ribbon"><span>Background · solid color</span><div><em className="flat-color-label">SOLID</em><label title="Background color"><input type="color" value={template.bg} onChange={e => setColors(c => ({...c,bg:e.target.value}))}/><i style={{background:template.bg}}/></label><label title="Accent color"><input type="color" value={template.accent} onChange={e => setColors(c => ({...c,accent:e.target.value}))}/><i style={{background:template.accent}}/></label></div></div>
    </div>

    <main>
      <aside className="templates-panel">
        <div className="panel-title"><div><Sparkles size={17}/><b>Templates</b></div><span>{templates.length}</span></div>
        <label className="search"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search templates…"/></label>
        <div className="filter-row">{['All','Wedding','Celebration'].map(name => <button key={name} className={`chip ${filter === name ? 'active' : ''}`} onClick={() => setFilter(name)}>{name}</button>)}</div>
        <div className="template-list">{filtered.map(t => <TemplateThumb key={t.id} template={t} active={t.id === templateId} onClick={() => chooseTemplate(t.id)}/>)}</div>
      </aside>

      <section className="workspace">
        <div className="workspace-top"><div><span className="live-dot"/> Live preview <span className="workspace-hint">· {side === 'front' ? 'Main photo and event details' : 'A few details—or leave it blank'}</span></div><div className="side-switch"><button className={side === 'front' ? 'active' : ''} onClick={() => setSide('front')}>Front</button><button className={side === 'back' ? 'active' : ''} onClick={() => setSide('back')}>Back</button></div><span>1600 × 1125 px</span></div>
        <div className="canvas-stage">
          <div className="canvas-scaler" style={{ width: 1600 * zoom, height: 1125 * zoom }}>
            <div className="canvas" ref={canvasRef} style={{ transform: `scale(${zoom})` }}><CardArtwork template={template} data={data} photo={photoUrl} side={side} photoShape={photoShape} photoFrame={photoFrame} editable onUpdate={update} onSelectText={selectText} onContextMenu={openContextMenu} textStyles={textStyles} ornaments={ornaments} onMoveOrnament={moveOrnament} onRemoveOrnament={removeOrnament} onSelectOrnament={id => { setSelectedOrnament(id); setSelectedText(''); }} selectedOrnament={selectedOrnament} recipientStrikes={recipientStrikes} onToggleRecipientTitle={toggleRecipientTitle} customTexts={customTexts} onUpdateCustomText={updateCustomText} onMoveCustomText={moveCustomText} onRemoveCustomText={removeCustomText} frame={frame} chosenFont={chosenFont} backgroundStyle={backgroundStyle} titleScale={titleScale} textAlign={textAlign}/></div>
          </div>
        </div>
        <div className="zoom"><button onClick={() => setZoom(z => Math.max(.35, +(z-.05).toFixed(2)))}><ZoomOut size={16}/></button><span>{Math.round(zoom*100)}%</span><button onClick={() => setZoom(z => Math.min(.72, +(z+.05).toFixed(2)))}><ZoomIn size={16}/></button></div>
      </section>

      <aside className="editor-panel">
        <div className="editor-head"><div><WandSparkles size={18}/><div><b>Easy tools</b><small>Edit all text directly on the card</small></div></div></div>
        <div className="editor-scroll">
          <section className="edit-section quick-guide"><h3><MousePointer2 size={15}/> Edit directly</h3>
            <div className="canvas-tip"><MousePointer2 size={14}/><span>Click text to edit it. Right-click to cut, copy, paste, or delete.</span></div>
          </section>
          <section className="edit-section custom-text-tools"><h3><Type size={15}/> Custom text</h3>
            <p className="section-help">Add extra text, type on the card, then drag it using its handle.</p>
            <button className="add-text-button" onClick={addCustomText}><Plus size={15}/> Add text block</button>
            <div className="recipient-help"><b>Recipient line</b><span>Click titles on the card to cross out the ones that do not apply.</span></div>
          </section>
          <section className="edit-section photo-section"><h3><ImageIcon size={15}/> Main photo · front</h3>
            <input ref={uploadRef} hidden type="file" accept="image/*" onChange={e => handlePhoto(e.target.files?.[0])}/>
            {!photoUrl ? <button className="upload-box compact" onClick={() => uploadRef.current?.click()}><span><Upload size={19}/></span><b>Upload photo</b><small>PNG or JPG</small></button> : <div className="photo-control"><img src={photoUrl}/><div><b>{photoFile?.name}</b><button onClick={() => uploadRef.current?.click()}>Replace</button></div><button className="icon-btn" onClick={() => {setPhotoUrl('');setPhotoFile(null)}}><X size={16}/></button></div>}
            <button className="remove-bg" onClick={removeBg} disabled={removing}><span>{removing ? <LoaderCircle className="spin" size={17}/> : <Scissors size={17}/>} Remove background</span><small>{removing ? `${progress}%` : 'On-device AI'}</small></button>
            {removing && <div className="progress"><i style={{width: `${Math.max(progress, 8)}%`}}/></div>}
            <div className="photo-shape-picker"><div><b>Photo shape</b><small>Change it without leaving the template</small></div><div className="shape-strip">{photoShapes.map(([id,label]) => <button key={id} className={photoShape === id ? 'active' : ''} onClick={() => setPhotoShape(id)} title={label}><i className={`shape-icon shape-${id}`}/><span>{label}</span></button>)}</div></div>
            <button type="button" role="switch" className={`photo-frame-toggle ${photoFrame ? 'active' : ''}`} aria-checked={photoFrame} onClick={() => setPhotoFrame(value => !value)}><span><Frame size={15}/><span><b>Photo frame</b><small>{photoFrame ? 'On' : 'Off'}</small></span></span><i className="switch-track" aria-hidden="true"><i/></i></button>
          </section>
          <section className="edit-section"><h3><Flower2 size={15}/> Flowers & decorations</h3>
            <div className="ornament-grid">{decorativeItems.map(item => <button key={item.type} onClick={() => addOrnament(item)}><span>{item.symbol}</span><small>{item.label}</small></button>)}</div>
            {ornaments.length > 0 && <button className="clear-elements" onClick={() => {setOrnaments([]);setSelectedOrnament(null)}}>Remove all decorations ({ornaments.length})</button>}
          </section>
          {selectedItem && <section className="edit-section selected-inspector"><h3><Layers size={15}/> Selected element</h3>
            <div className="selected-chip"><span>{selectedItem.symbol}</span><div><b>{selectedItem.label}</b><small>Drag it on the canvas to move</small></div></div>
            <label className="range-control"><span>Size</span><input type="range" min="36" max="190" value={selectedItem.size} onChange={e => updateOrnament(selectedItem.id,{size:Number(e.target.value)})}/><b>{selectedItem.size}px</b></label>
            <label className="range-control"><span>Rotation</span><input type="range" min="-180" max="180" value={selectedItem.rotation} onChange={e => updateOrnament(selectedItem.id,{rotation:Number(e.target.value)})}/><b>{selectedItem.rotation}°</b></label>
            <div className="element-actions"><button onClick={() => duplicateOrnament(selectedItem.id)}><Copy size={14}/> Duplicate</button><button className="danger" onClick={() => removeOrnament(selectedItem.id)}><Trash2 size={14}/> Delete</button></div>
          </section>}
          <section className="edit-section"><h3><Frame size={15}/> Card frame · optional <span className="frame-count">{premiumFrames.length}</span></h3>
            <div className="frame-grid premium">{premiumFrames.map(([id,label]) => <button key={id} className={frame === id ? 'active' : ''} onClick={() => setFrame(id)}><i className={`frame-sample sample-${id}`}/><small>{label}</small></button>)}</div>
          </section>
        </div>
        <div className="editor-footer"><button onClick={() => setExportOpen(true)}><ArrowDownToLine size={18}/> Download your card</button><small>PNG · JPG · PDF · ZIP</small></div>
      </aside>
    </main>
    <div className="export-pages" aria-hidden="true"><div ref={frontExportRef}><CardArtwork template={template} data={data} photo={photoUrl} side="front" photoShape={photoShape} photoFrame={photoFrame} textStyles={textStyles} ornaments={ornaments} recipientStrikes={recipientStrikes} customTexts={customTexts} frame={frame} chosenFont={chosenFont} backgroundStyle={backgroundStyle} titleScale={titleScale} textAlign={textAlign}/></div><div ref={backExportRef}><CardArtwork template={template} data={data} photo={photoUrl} side="back" photoShape={photoShape} photoFrame={photoFrame} textStyles={textStyles} ornaments={ornaments} recipientStrikes={recipientStrikes} customTexts={customTexts} frame={frame} chosenFont={chosenFont} backgroundStyle={backgroundStyle} titleScale={titleScale} textAlign={textAlign}/></div></div>
    {contextMenu && <div className="context-menu" style={{left:contextMenu.x,top:contextMenu.y}} onPointerDown={e => e.stopPropagation()}>
      <p>{contextMenu.type === 'text' ? textLabels[contextMenu.key] : contextMenu.type === 'ornament' ? 'Element' : 'Card'}</p>
      {contextMenu.type !== 'canvas' && <><button onClick={() => copySelection(true)}><Scissors size={15}/> Cut <kbd>Ctrl+X</kbd></button><button onClick={() => copySelection(false)}><Copy size={15}/> Copy <kbd>Ctrl+C</kbd></button><button onClick={pasteSelection}><Layers size={15}/> Paste <kbd>Ctrl+V</kbd></button></>}
      {contextMenu.type === 'ornament' && <><i/><button onClick={() => {reorderOrnament(contextMenu.id,true);setContextMenu(null)}}><ArrowDownToLine size={15}/> Bring forward</button><button onClick={() => {reorderOrnament(contextMenu.id,false);setContextMenu(null)}}><Layers size={15}/> Send backward</button></>}
      {contextMenu.type === 'text' && <button onClick={() => {update(contextMenu.key,'');setContextMenu(null)}} className="danger"><Trash2 size={15}/> Delete text</button>}
      {contextMenu.type === 'ornament' && <button onClick={() => {removeOrnament(contextMenu.id);setContextMenu(null)}} className="danger"><Trash2 size={15}/> Delete element</button>}
      {contextMenu.type === 'canvas' && <><button onClick={() => {setSide('front');setContextMenu(null)}}>Card front</button><button onClick={() => {setSide('back');setContextMenu(null)}}>Card back</button></>}
    </div>}
    {status && <div className="toast">{removing && <LoaderCircle className="spin" size={16}/>} {status}</div>}
    {tourOpen && <ProductTour step={tourStep} onStep={setTourStep} onBack={() => setTourStep(value => Math.max(0, value - 1))} onNext={() => tourStep === tourSteps.length - 1 ? closeTour() : setTourStep(value => value + 1)} onClose={closeTour}/>} 
  </div>
}

createRoot(document.getElementById('root')).render(<App />);
