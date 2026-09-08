export const studies = [
  { id:'01', slug:'folio', name:'THE OTHER', title:'認識の向こうに、無数の可能性。', subtitle:'銀の宇宙を漂流する', description:'銀色の点が果てしなく続く暗い空間。大きな明朝体と静かな余白で、人間の尺度では測れない広がりを感じさせる。', signature:'銀 × 漆黒 / 漂流する視点 / 静かな畏怖', focus:'研究の思想・グループの存在感' },
  { id:'02', slug:'index', name:'SINGULARITY', title:'知が、臨界点を越える。', subtitle:'赤い特異点の圧力', description:'朱色の探索空間を背景に、画面を横切る強い文字。固定目次で研究情報へすぐに移動できる、最も鋭い案。', signature:'朱 × 墨 / 大胆な文字 / 断ち切る構図', focus:'分子探索・研究への推進力' },
  { id:'03', slug:'specimen', name:'XENOCHEMISTRY', title:'白い無限に、まだ知らない分子。', subtitle:'静寂の中の未知', description:'冷たい白い空間に、数えきれない可能性が浮かぶ。静かな展示ラベルと精密な図版が、未知への好奇心を引き出す。', signature:'冷白 × 深緑 / 白い化学空間 / 精密な余白', focus:'分子の構造・基礎化学・未知との遭遇' },
  { id:'04', slug:'ledger', name:'LATENT SPACE', title:'探索の先で、予期しない光に出会う。', subtitle:'化学空間の観測者', description:'暗緑の観測面に広がる、蛍光色の分子の可能性。研究者として途方もない空間を探索する、セレンディピティの案。', signature:'蛍光黄緑 × 暗緑 / 探索の窓 / 観測の密度', focus:'化学空間・計算化学・分子探索' },
  { id:'05', slug:'aperture', name:'EVENT HORIZON', title:'途方もない旅の先に、小さな光。', subtitle:'希望へ向かう旅', description:'青い宇宙のような化学空間を、遠方の小さな光へ進む。壮大さと孤独、発見への希望を最も映像的に表現する。', signature:'深青 × 金の光 / 広大な奥行き / 映画的な旅', focus:'研究の第一印象・共同研究・新しい接点' },
] as const;
export type StudySlug = typeof studies[number]['slug'];
