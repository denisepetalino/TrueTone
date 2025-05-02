const profileData = {
  'Deep Winter': {
    description: 'This means you have intense contrast and cool undertones! Your features are bold and striking. Dark hair, vivid eyes, and luminous skin. Deep Winters shine in saturated, rich colours like plum, emerald, and deep navy. Icy accents and bright jewel tones will energise your look, while soft pastels or warm earth tones can dull your impact. You wear drama and elegance effortlessly!',
    palette: ['#000000', '#CC214D', '#0089E2', '#207203', '#404040', '#C50902', '#00A0B3', '#FAFBB0', '#A1A1A1', '#7626B0', '#A7FDE0', '#E46D26', '#D8D8DA', '#041781', '#01ECCC', '#6A481D', '#FB74F9', '#0026D3', '#01B470', '#6B3728'],
    tone: 0.8,
    depth: 0.2,
  },
  'Cool Winter': {
    description: 'This means you have icy undertones and a crisp overall appearance! Your skin may be pale with a bluish base and your eyes often hold a steel, cool depth. Cool Winters are among the iciest of the Winter group, requiring strictly blue-based hues. Colours like raspberry, cobalt, emerald and icy lavender will highlight your sharpness, while warm or earth tones can look muddy. Silver and true white will complement you beautifully! Cool Winters are clean, controlled and classic.',
    palette: ['#000000', '#AA9B8A', '#CA3467', '#656DFD', '#404040', '#FADCE6', '#993363', '#063AA5', '#747474', '#F189AA', '#FA2B57', '#61D4FC', '#979999', '#FB74FF', '#7928D4', '#65CF9B', '#DEE0E2', '#C933C9','#D0D9FA', '#FAFBAF'],
    tone: 0.85,
    depth: 0.5,
  },
  'Clear Winter': {
    description: 'This means you have high contrast and vivid clarity in your features! You likely have bright eyes, cool undertones, and a bold presence. Clear Winters sparkle in pure, saturated colours like electric blue, cherry red, emerald and icy pink. Muted tones or anything overly warm may flatten your look. You glow in crisp, icy contrast, think snow with a flash of neon!',
    palette: ['#000000', '#404040', '#A69D8E', '#FD74FE', '#061889', '#FBFCC1', '#CA266B', '#0627D3', '#D3D9FD', '#7B1325', '#5DD5FC', '#584E44', '#EFBFFD', '#C933C7', '#65D09C'],
    tone: 0.9,
    depth: 0.3,
  },
  'Light Spring': {
    description: 'This means you have delicate warmth and low contrast in your features! Light Springs often have light hair, soft warm eyes and fair skin with a peachy glow. You radiate in soft, fresh colours like peach, butter yellow, light aqua and coral pink. Dark or muted tones can feel heavy on you, so keep your palette light, bright and cheerful, like a spring garden in morning sun!',
    palette: ['#FFF8DC', '#F5DEB3', '#FAD6A5', '#FFE4E1', '#FFDDC1', '#FAFAD2', '#F7CAC9', '#BFD8EB', '#CDE7BE', '#FFE0AC', '#EED6C4', '#FFEBCD'],
    tone: 0.2,
    depth: 0.8,
  },
  'Warm Spring': {
    description: 'This means you’re glowing with sunny, golden warmth! Warm Springs often have peach-toned skin, warm green or hazel eyes, and golden or strawberry blonde hair. You look amazing in vibrant, warm hues like melon, sunflower, coral and mint. Avoid icy shades or anything too dark, your palette is all about radiance and energy!',
    palette: ['#FFD700', '#FFA500', '#F08080', '#E9967A', '#F4A460', '#FFDAB9', '#E1C699', '#D4AF37', '#E2725B', '#FDFD96', '#FFB347', '#DEB887'],
    tone: 0.2,
    depth: 0.6,
  },
  'Clear Spring': {
    description: 'This means your features are bright and crisp with a warm undertone! You likely have bright eyes, glowing skin and defined contrast in your look. Clear Springs sparkle in clean, warm colours like turquoise, coral, jade and bright yellow. Avoid muted or dusty tones, they can dull your brightness. Your vibe is joyful, energetic and full of life!',
    palette: ['#FFFF33', '#FFA07A', '#00FA9A', '#FF4500', '#FDFD96', '#00FFFF', '#FFC0CB', '#FF69B4', '#40E0D0', '#98FB98', '#E6E6FA', '#FF6347'],
    tone: 0.3,
    depth: 0.4,
  },
  'Soft Autumn': {
    description: 'This means your colouring is gentle, warm and low contrast. Soft Autumns often have hazel or green eyes, warm beige skin, and medium-toned hair. You look best in earthy, blended colours like sage, dusty rose, soft brown and taupe. Your palette is cozy, muted and romantic-like autumn mist and golden hour skies.',
    palette: ['#A39887', '#C3B091', '#BFA6A0', '#A49A87', '#C19A6B', '#BC987E', '#C4A69F', '#8E735B', '#AD8A64', '#BCA371', '#D2B48C', '#A17A74'],
    tone: 0.3,
    depth: 0.5,
  },
  'Warm Autumn': {
    description: 'This means you are enriched with golden undertones and a strong earthy presence! Warm Autumns typically have coppery or auburn hair, amber eyes, and skin that glows in golden browns. You shine in warm, rich colours like rust, olive, terracotta and deep mustard. Avoid icy or cool shades, they clash with your warmth. You radiate richness, strength and warmth.',
    palette: ['#A0522D', '#CD853F', '#B8860B', '#DAA520', '#556B2F', '#8B4513', '#CFA18D', '#D2691E', '#FFA07A', '#BC8F8F', '#F4A460', '#964B00'],
    tone: 0.2,
    depth: 0.7,
  },
  'Deep Autumn': {
    description: 'This means your look is rich, dark and dramatic with warm undertones. Deep Autumns often have dark brown hair, deep-set eyes and warm olive or bronze skin. You glow in bold, warm shades like espresso, forest green, brick and ink navy. Light or pastel colours may wash you out. You’re at your best in strong, earthy elegance.',
    palette: ['#3B2F2F', '#401A1A', '#5D3A00', '#46211A', '#3E2723', '#4E342E', '#6E2C00', '#3E1F0D', '#7D4427', '#5A381E', '#402218', '#2C1608'],
    tone: 0.25,
    depth: 0.2,
  },
  'Cool Summer': {
    description: 'This means you have soft contrast and cool, refined undertones. Cool Summers usually have light ash brown hair, grey-blue or cool green eyes and pink-based skin. Your best colours are powdery and elegant, think lavender, periwinkle, cool rose and icy grey. Avoid warmth or strong contrast. You shine in effortless, romantic calm.',
    palette: ['#92A8D1', '#B3CDE0', '#C5CBE1', '#BFD8D2', '#C0B9DD', '#9BB7D4', '#B0C4DE', '#D3D3E3', '#6C7B8B', '#A9A9E0', '#B2BABB', '#91A3B0'],
    tone: 0.7,
    depth: 0.5,
  },
  'Soft Summer': {
    description: 'This means you’re all about subtle harmony and muted elegance. Soft Summers have low contrast between hair, skin and eyes, with soft cool undertones. You look best in dusty, muted colours like sage, mauve, heather grey and powder blue. Brights or warm hues can be overpowering. Your beauty lies in softness and stillness.',
    palette: ['#A3B9C9', '#BCCAD6', '#C4B7CB', '#A8B0B6', '#BDC6D1', '#A6A6A6', '#BEBFC5', '#C3C6C8', '#C0BAAF', '#C5B9A5', '#99AABB', '#ADADAD'],
    tone: 0.6,
    depth: 0.6,
  },
  'Light Summer': {
    description: 'This means you have light, cool features and delicate contrast. Light Summers usually have blonde hair, grey-blue or green eyes, and pale pink-toned skin. Your best colours are soft, airy pastels like lilac, mint, periwinkle and soft rose. Avoid anything too dark or too warm. You shine in freshness and light.',
    palette: ['#E0BBE4', '#BFD8EB', '#CBAACB', '#B5EAD7', '#C7CEEA', '#F7CAC9', '#D5E1DF', '#E1EBEE', '#F0F8FF', '#D8BFD8', '#AFDBF5', '#F3E5F5'],
    tone: 0.6,
    depth: 0.8,
  }
};

export default profileData;