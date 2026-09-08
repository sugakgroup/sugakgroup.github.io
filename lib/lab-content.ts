export const directions = [
  { number: '01', slug: 'academic', english: 'Academic', title: '端正な大学研究室', description: '研究・ニュース・業績が自然に目に入る、白とネイビーの落ち着いた構成。研究室としての信頼感を大切に。', focus: '読みやすさ・情報の探しやすさ', tone: '端正 / 明快 / アカデミック', preview: ['問いを深め、', '知を、ともにつくる。'] },
  { number: '02', slug: 'frontier', english: 'Research Hub', title: '研究が伝わるハブ', description: '研究テーマと成果を中心に、独自性と共同研究への接点を伝える構成。専門性を整理して見せます。', focus: '研究の独自性・共同研究', tone: '知的 / 現代的 / シャープ', preview: ['研究をつなぎ、', '次の発見へ。'] },
  { number: '03', slug: 'commons', english: 'Open Laboratory', title: '人が見える研究室', description: 'メンバーや日々の研究を入口に、グループの雰囲気が伝わる構成。学生が参加後を想像しやすい案です。', focus: 'メンバー・学生への伝わりやすさ', tone: '親しみ / 誠実 / 開放的', preview: ['一人の問いを、', 'みんなの発見に。'] },
] as const;
export type Direction = (typeof directions)[number]['slug'];
export const themes = [
  { id: '01', title: '基盤となる研究', subtitle: 'FOUNDATIONS', description: '私たちが取り組む中心的な問いと、その学術的な背景。', detail: '具体的な研究課題、先行研究に対する独自性、目指す到達点を掲載します。' },
  { id: '02', title: '方法とアプローチ', subtitle: 'METHODS', description: '問いに向き合うための手法と、研究グループの強み。', detail: '実験・理論・解析など、実際の研究手法と利用する設備を掲載します。' },
  { id: '03', title: '応用と共同研究', subtitle: 'COLLABORATION', description: '研究から広がる可能性と、学内外との協働の接点。', detail: '進行中のプロジェクト、共同研究先、研究成果の活用例を掲載します。' },
] as const;
