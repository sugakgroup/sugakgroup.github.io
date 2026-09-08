export const introductionEn = 'What properties might emerge from molecules beyond our imagination? Suga Group explores uncharted chemical space using molecular transformation rules and computational power. We search for molecules with new properties and functions entirely within the computer, from molecular generation through property evaluation. In the laboratory, we synthesize the molecules we discover and test their properties. For polymer materials that are difficult to explore through computation alone, we create structures and investigate their properties experimentally, working toward new materials.';
export const themesEn = [
  {
    id: 'chemical-space', number: '01', english: 'CHEMICAL SPACE', title: 'Chemical space construction and molecular exploration',
    copy: 'Beyond the reach of intuition.',
    summary: 'We design molecular transformation rules to build networks of connected molecules within chemical space. Using quantum chemical calculations and other methods to evaluate their properties, we explore these networks for π-conjugated molecules with new properties and functions.',
    introduction: 'Molecular exploration depends not only on how candidates are selected, but also on which molecules can be explored. We design molecular representations and structural transformation rules to construct networks in which transformations connect molecules. Which molecules can we move from, and which can we reach? By building these connections, we expand the chemical space available for exploration. We pursue the development of this exploration framework together with the discovery of molecules with new properties and functions within it.',
    sections: [
      { title: 'Building chemical spaces and exploration methods', paragraphs: ['We developed CARBOT, a molecular generation method that constructs a chemical space of π-conjugated hydrocarbons through structural transformations. Building on this work, we will extend molecular representations and transformation rules to broaden the diversity of structures available for exploration.', 'The transformations we allow and the connections we establish between molecules affect both which molecules can be reached and how exploration proceeds. We study the design of these connections to develop ways of reaching molecules that human intuition alone would not readily suggest. To explore the chemical spaces we construct, we will also use established approaches such as Bayesian optimization, Monte Carlo search, and genetic algorithms.'] },
      { title: 'Exploring the properties of π-conjugated molecules', paragraphs: ['We use quantum chemical calculations to investigate optical, electronic, and spin-related properties of π-conjugated organic molecules, including excited-state behavior. By comparing molecular structures and properties within the chemical spaces we construct, we search for molecules with desired properties.', 'We also focus on how much properties change as a result of structural transformations. We develop machine-learning frameworks to predict these differences—how a particular transformation changes the properties of a given molecule—and apply them to molecular exploration.', 'We evaluate candidates in terms of the desired properties, molecular stability, and structural simplicity. By comparing known molecules and unexplored candidates using the same criteria, we reconsider the strengths and limitations of familiar molecules while searching for new alternatives.'] },
    ],
  },
  {
    id: 'organic-synthesis', number: '02', english: 'ORGANIC SYNTHESIS', title: 'Synthesis and functional exploration of π-conjugated molecules',
    copy: 'Bringing molecular outliers to life.',
    summary: 'We search for π-conjugated molecules with distinctive properties that depart from the trends expected from their structures. Through synthesis and measurement, we identify the features of their molecular frameworks responsible for these properties, opening the way to new molecular functions.',
    introduction: 'We compare the structures and properties of diverse π-conjugated molecules to find those with distinctive properties that depart from the trends expected from their structures. Outliers in property distributions and correlations guide us toward the molecular frameworks that give rise to these properties.',
    sections: [{ paragraphs: ['We synthesize candidate molecules and measure their properties, both to verify their behavior and to understand the structural origins of their distinctive responses. Through exploration guided by molecular properties and experimental investigation, we aim to discover molecular frameworks that enable new functions.'] }],
  },
  {
    id: 'polymer-structure', number: '03', english: 'POLYMER SCIENCE', title: 'Polymer structure control and mechanical properties',
    copy: 'Shaping new responses, inside and out.',
    summary: 'We control macroscopic shapes through 3D printing and nanoscale internal structures through polymerization-induced microphase separation (PIMS). We investigate how each affects mechanical properties and aim to combine the two to create polymer materials with new mechanical responses.',
    introduction: 'How do shape and internal structure influence the mechanical properties of polymer materials? We focus on macroscopic shapes produced by 3D printing and nanoscale internal structures formed through polymerization-induced microphase separation (PIMS).',
    sections: [{ paragraphs: ['We control these structures individually and investigate experimentally how they relate to deformation and force transmission. By combining the design of external shape and internal structure, we aim to create polymer materials with new mechanical responses.', 'Future directions include lattice structures whose responses depend on the direction of applied force, as well as metamaterials whose distinctive mechanical properties arise from structural design.'] }],
  },
];

export const biographyEn = 'Kensuke Suga graduated from the Faculty of Science at Kyoto University and completed his master’s and doctoral studies at its Graduate School of Science. During his doctoral studies, he conducted research as a JSPS Research Fellow (DC1) and undertook a research stay at the University of New South Wales. He has been an Assistant Professor at the Graduate School of Science, The University of Osaka, since April 2025.';
export const careerEn = [
  'Assistant Professor, Department of Chemistry, Graduate School of Science, The University of Osaka',
  'Ph.D. in Science, Graduate School of Science, Kyoto University',
  'Research stay, School of Chemical Engineering, University of New South Wales',
  'JSPS Research Fellow (DC1)',
  'Master’s degree, Graduate School of Science, Kyoto University',
  'Graduated from the Faculty of Science, Kyoto University',
];
export const awardsEn: Record<string, { name: string; organization: string }> = {
  '2024-04': { name: 'CSJ Student Presentation Award, 104th Annual Meeting', organization: 'The Chemical Society of Japan' },
  '2022-10': { name: 'Journal of Materials Chemistry A Presentation Prize, 2022 Symposium on Photochemistry', organization: 'The Japanese Photochemistry Association' },
};
export const supportEn: Record<string, { organization: string; program: string; title: string }> = {
  '26K17907': { organization: 'JSPS', program: 'KAKENHI — Early-Career Scientists', title: 'Establishing a pore-enabled 3D printing platform through internal-space design' },
  '26H01357': { organization: 'JSPS', program: 'KAKENHI — Transformative Research Areas (A), Publicly Offered Research', title: 'Building a molecular exploration platform to understand π-molecular complexity through property differences' },
  '25K23592': { organization: 'JSPS', program: 'KAKENHI — Research Activity Start-up', title: 'Creating and understanding light-driven molecules through structure generation tailored to π-conjugated systems' },
  '22KJ1964': { organization: 'JSPS', program: 'KAKENHI — JSPS Fellows', title: 'Predicting phase transitions through machine learning to understand liquid-crystal molecular arrangements, with applications to photofunctional liquid crystals' },
  '2025-04': { organization: 'The University of Osaka', program: 'Next-generation researcher development / interdisciplinary research project', title: 'Next-generation molecular design through collaboration across search AI, quantum chemistry, and organic chemistry' },
  '2024-08': { organization: 'Kyoto University', program: 'Ginfū Fund', title: '3D printing of nanocomposites whose mechanical properties are governed by flow' },
  '2023-09': { organization: 'JSPS', program: 'Overseas Challenge Program for Young Researchers', title: 'Understanding the relationship between structure and stress distribution in precisely 3D-printed soft materials' },
};
export const newsCategoriesEn: Record<string, string> = { '論文掲載': 'Publication', '学会発表': 'Presentation', '学会参加': 'Conference', 'メンバー加入': 'New member', 'イベント': 'Event' };
