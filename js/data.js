/*
 * НЕ ЖАЛЬ — контент коміксу.
 * Єдине джерело правди для рантайму. Кожне наукове твердження прив'язане до DOI.
 * Завантажується звичайним <script> (не module), тому працює і з file://, і з сервера.
 * check.mjs парсить цей же файл через регулярні поля.
 */
window.NEZHAL = (function () {
  // --- ДЖЕРЕЛА (метадані звірені; DOI резолвляться через Crossref) ---
  const SOURCES = {
    seeley2010: { authors: 'Seeley T.D.', title: 'Honeybee Democracy', venue: 'Princeton University Press', year: 2010, ref: 'ISBN 978-0691147215', url: 'https://press.princeton.edu/books/hardcover/9780691147215/honeybee-democracy' },
    winston1987: { authors: 'Winston M.L.', title: 'The Biology of the Honey Bee', venue: 'Harvard University Press', year: 1987, ref: 'ISBN 978-0674074095', url: 'https://www.hup.harvard.edu/books/9780674074095' },
    frisch1973: { authors: 'von Frisch K.', title: 'Decoding the language of the bee (Nobel Lecture)', venue: 'Nobel Prize in Physiology or Medicine', year: 1973, ref: 'nobelprize.org', url: 'https://www.nobelprize.org/prizes/medicine/1973/frisch/facts/' },
    ramsey2019: { authors: 'Ramsey S.D. et al.', title: 'Varroa destructor feeds primarily on honey bee fat body tissue and not hemolymph', venue: 'PNAS 116(5):1792–1801', year: 2019, ref: 'DOI 10.1073/pnas.1818371116', url: 'https://doi.org/10.1073/pnas.1818371116' },
    visscher: { authors: 'Visscher P.K. et al.', title: 'Alarm pheromone perception in honey bees is decreased by smoke', venue: 'Journal of Insect Behavior', year: 1995, ref: 'DOI 10.1007/BF01990966', url: 'https://doi.org/10.1007/BF01990966' },
    colvision: { authors: 'Hempel de Ibarra N. et al.', title: 'Mechanisms, functions and ecology of colour vision in the honeybee', venue: 'J. Comp. Physiol. A', year: 2014, ref: 'PMC4035557', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4035557/' },
    polyethism: { authors: 'Johnson B.R.', title: 'Division of labor in honeybees: form, function, and proximate mechanisms', venue: 'Behav. Ecol. Sociobiol.', year: 2010, ref: 'PMC2810364', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2810364/' },
    wintercluster: { authors: 'Stabentheiner A. et al.', title: 'Endothermic heat production in honeybee winter clusters', venue: 'J. Exp. Biol.', year: 2003, ref: 'PMID 12477904', url: 'https://pubmed.ncbi.nlm.nih.gov/12477904/' },
    botulism: { authors: 'CDC / U.S. Poison Control; StatPearls', title: 'Infantile Botulism — do not feed honey to infants under 1 year', venue: 'CDC / NCBI Bookshelf NBK493178', year: 2024, ref: 'Офіційна настанова', url: 'https://www.poison.org/articles/dont-feed-honey-to-infants' },
    honeyshelf: { authors: 'Winston M.L.; food chemistry of honey', title: 'Low water activity, acidic pH and glucose-oxidase H₂O₂ preserve honey', venue: 'The Biology of the Honey Bee', year: 1987, ref: 'ISBN 978-0674074095', url: 'https://www.hup.harvard.edu/books/9780674074095' },
    allergy: { authors: 'Asha’ari Z.A. et al.', title: 'Ingestion of honey improves the symptoms of allergic rhinitis: RCT', venue: 'Annals of Saudi Medicine 33(5):469–475', year: 2013, ref: 'DOI 10.5144/0256-4947.2013.469', url: 'https://doi.org/10.5144/0256-4947.2013.469' },
    ceranaball: { authors: 'Ono M., Okada I., Sasaki M.', title: 'Heat production by balling in the Japanese honeybee (Apis cerana japonica) as defence against the hornet', venue: 'Experientia 43:1034–1035', year: 1987, ref: 'DOI 10.1007/BF01952231', url: 'https://doi.org/10.1007/BF01952231' },
    managed: { authors: 'Mallinger R.E. et al.', title: 'Do managed bees have negative effects on wild bees? A systematic review', venue: 'PLoS ONE 12(12):e0189268', year: 2017, ref: 'DOI 10.1371/journal.pone.0189268', url: 'https://doi.org/10.1371/journal.pone.0189268' },
    stingers: { authors: 'Wu J. et al.', title: 'Barbs facilitate the helical penetration of honeybee (Apis mellifera) stingers', venue: 'PLoS ONE 9(8):e103823', year: 2014, ref: 'DOI 10.1371/journal.pone.0103823', url: 'https://doi.org/10.1371/journal.pone.0103823' },
    dwv: { authors: 'Francis R.M., Nielsen S.L., Kryger P.', title: 'Varroa–virus interaction in collapsing honey bee colonies', venue: 'PLoS ONE 8(3):e57540', year: 2013, ref: 'DOI 10.1371/journal.pone.0057540', url: 'https://doi.org/10.1371/journal.pone.0057540' },
    dance2023: { authors: 'Dong S. et al.', title: 'Social signal learning of the waggle dance in honey bees', venue: 'Science 379:1015–1018', year: 2023, ref: 'DOI 10.1126/science.ade1702', url: 'https://doi.org/10.1126/science.ade1702' }
  };

  // conf: сила доказів. high / medium / disputed. nuance:true => подавати як «не все так просто»
  // warning:true => безпекове застереження (червона картка)
  const T = (uk, en) => ({ uk, en });

  const CAST = [
    {
      id: 'queen', art: 'queen', codename: T('БОСИНЯ', 'THE BOSS'), role: T('Матка', 'The Queen'),
      stat: T('1 на сім’ю · 2–5 років · до 2000 яєць/добу', '1 per colony · 2–5 yrs · up to 2000 eggs/day'),
      dossier: T(
        'Єдина фертильна самка — «яєчник сім’ї». Не роздає наказів: її влада — це феромон QMP, хімічний звіт про стан колонії, а не команди. Спаровується раз у житті з 10–20 трутнями й зберігає ~5 млн сперматозоїдів на роки наперед.',
        'The only fertile female — the colony’s “ovary”. She gives no orders: her power is QMP pheromone, a chemical status report, not commands. Mates once in life with 10–20 drones and stores ~5M sperm for years.'),
      busts: T('«Королева керує вуликом»', '“The queen rules the hive”'),
      src: 'seeley2010'
    },
    {
      id: 'drones', art: 'drone', codename: T('ХЛОПЦІ', 'THE LADS'), role: T('Трутні', 'Drones'),
      stat: T('16 хромосом · без жала · кілька тижнів', '16 chromosomes · no sting · a few weeks'),
      dossier: T(
        'Народжені з незапліднених яєць (гаплоїдні). Величезні очі, жодного жала, не носять нектару. Уся місія — шлюбний політ, після якого гинуть. Але й вони гріють гніздо масою тіла. Восени бригада їх виганяє.',
        'Born from unfertilised eggs (haploid). Huge eyes, no sting, no foraging. Their whole mission is the mating flight — then they die. Yet they warm the nest with their body mass. In autumn the crew evicts them.'),
      busts: T('«Трутні — ледарі-нахлібники»', '“Drones are lazy freeloaders”'),
      src: 'winston1987'
    },
    {
      id: 'workers', art: 'worker', codename: T('БРИГАДА', 'THE CREW'), role: T('Робочі бджоли', 'Workers'),
      stat: T('20–60 тис. · стерильні самки · 5–6 тижнів улітку', '20–60k · sterile females · 5–6 weeks in summer'),
      dossier: T(
        'Одна бджола змінює фах із віком (часовий поліетизм): прибиральниця → нянька → будівельниця → вентиляторниця → вартова → фуражирка → трунарка. Коли бджола переходить до польотів, у її мозку перемикається близько 39 % генів.',
        'One bee changes trade with age (temporal polyethism): cleaner → nurse → builder → fanner → guard → forager → undertaker. Switching to foraging flips expression of ~39% of brain genes.'),
      busts: T('«Кожна робить одне діло все життя»', '“Each bee does one job for life”'),
      src: 'polyethism'
    },
    {
      id: 'scouts', art: 'scout', codename: T('СКАУТИ', 'THE SCOUTS'), role: T('Розвідниці', 'Scout bees'),
      stat: T('сотні на рій · кворум ~15–20', 'hundreds per swarm · quorum ~15–20'),
      dossier: T(
        'Коли сім’я роїться, розвідниці шукають нове житло й «голосують» танцем. Що краще місце — то довше танець. Досягли кворуму на одному дуплі — рій знімається й летить туди. Танці суперниць глушить «стоп-сигнал» — удар головою.',
        'When the colony swarms, scouts search for a new home and “vote” by dancing. The better the site, the longer the dance. Once a quorum backs one cavity, the swarm lifts off. Rival dances are silenced by a head-butt “stop signal”.'),
      busts: T('«Матка вирішує, куди летіти»', '“The queen decides where to go”'),
      src: 'seeley2010'
    },
    {
      id: 'varroa', art: 'varroa', codename: T('КРОВОСОС-РЕКЕТИР', 'THE RACKETEER'), role: T('Кліщ Varroa destructor', 'Varroa destructor mite'), enemy: true,
      stat: T('головний ворог · переносить DWV', 'the main enemy · vectors DWV'),
      dossier: T(
        'Не «п’є кров»: наука виправила себе у 2019-му — Varroa їсть жирове тіло бджоли, орган на кшталт печінки. І це не просто паразит: він заносить вірус деформації крил (DWV). За високої закліщеності восени колонія не доживає до весни.',
        'Doesn’t “drink blood”: science corrected itself in 2019 — Varroa eats the bee’s fat body, a liver-like organ. And it’s not just a parasite: it injects Deformed Wing Virus (DWV). Under a heavy autumn mite load, the colony won’t make it to spring.'),
      busts: T('«Varroa просто смокче кров»', '“Varroa just sucks blood”'),
      src: 'ramsey2019'
    }
  ];

  const CHAPTERS = [
    {
      id: 'ch1', num: 'I', kind: 'cast', fig: 'castes',
      title: T('ЗНАЙОМСТВО З ФІРМОЮ', 'MEET THE FIRM'),
      lead: T('П’ятеро в кадрі. Роль кожного визначає біологія, а не характер.',
              'Five in frame. Each role is decided by biology, not personality.')
    },
    {
      id: 'ch2', num: 'II', kind: 'myths',
      title: T('ШИФР: ЯК ПЕРЕДАЮТЬ КООРДИНАТИ', 'THE CIPHER: HOW WORD GETS AROUND'),
      lead: T('Фуражирка знайшла харч. Тепер треба передати координати — без слів, без мапи.',
              'A forager found food. Now she must pass the coordinates — no words, no map.'),
      myths: [
        {
          street: T('Бджоли просто летять за запахом, навмання.', 'Bees just follow a scent at random.'),
          science: T('Танець-виляння — це справжня «мова координат»: кут прямого пробігу з виляннями кодує напрям відносно сонця, а його тривалість — відстань. Карл фон Фріш розшифрував це й отримав Нобелівську премію 1973 року.',
                     'The waggle dance is a real “coordinate language”: the angle of the run encodes direction relative to the sun, its duration encodes distance. Karl von Frisch decoded it and won the 1973 Nobel Prize.'),
          fig: 'waggle', conf: 'high', src: 'frisch1973'
        },
        {
          street: T('Бджолу не треба вчити танцювати — це в генах.', 'Bees don’t need to learn the dance — it’s in the genes.'),
          science: T('Не все так просто. Основа вроджена, але у 2023-му показали: без нагоди в юності повчитися в досвідчених танцівниць бджоли танцюють з помилками — є елемент соціального навчання й навіть локальні «діалекти».',
                     'Not so simple. The basics are innate, but a 2023 study showed: without a chance to learn from experienced dancers when young, bees dance with lasting errors — there’s social learning, even local “dialects”.'),
          fig: 'dialects', conf: 'high', nuance: true, src: 'dance2023'
        },
        {
          street: T('Бджоли бачать світ так само, як ми.', 'Bees see the world the way we do.'),
          science: T('Ні. Зір бджоли зсунуто в ультрафіолет: вона трихромат (УФ, синій, зелений) і повністю сліпа до червоного. Зате бачить УФ-«посадкові смуги» на пелюстках, невидимі нам, — квітка буквально показує їй, де нектар.',
                     'No. A bee’s vision is shifted into the UV: trichromatic on UV/blue/green and fully blind to red. But it sees UV “landing strips” on petals, invisible to us — the flower literally points to the nectar.'),
          fig: 'uv', conf: 'high', src: 'colvision'
        }
      ]
    },
    {
      id: 'ch3', num: 'III', kind: 'myths',
      title: T('СПРАВА ПРО МЕД', 'THE HONEY JOB'),
      lead: T('Найдорожчий актив фірми. І найбільше народних легенд навколо нього.',
              'The firm’s most valuable asset. And the one with the most folklore around it.'),
      myths: [
        {
          street: T('Бджоли роблять мед для людей.', 'Bees make honey for people.'),
          science: T('Мед — це банк вуглеводів на зиму й на безквіткові тижні. Сім’я виробляє його винятково для власного виживання. Людина забирає лише надлишок, який бджоли не встигли з’їсти.',
                     'Honey is a carbohydrate bank for winter and flowerless weeks. The colony makes it purely to survive. Humans only take the surplus the bees didn’t get to.'),
          fig: 'honeyBank', conf: 'high', src: 'winston1987'
        },
        {
          street: T('Мед не псується ніколи й за будь-яких умов.', 'Honey never spoils, under any conditions.'),
          science: T('Так, але з умовою. У сухій щільно закритій тарі мед зберігається тисячоліттями: низька вологість, кислотність і пероксид водню вбивають мікроби. Та якщо тара відкрита й мед набирає вологу понад ~19 %, він забродить, як звичайний продукт.',
                     'True — with a caveat. Sealed and dry, honey lasts millennia: low moisture, acidity and hydrogen peroxide kill microbes. But left open, once it absorbs moisture above ~19%, it ferments like any other food.'),
          fig: 'honeyPreserve', conf: 'medium', nuance: true, src: 'honeyshelf'
        },
        {
          street: T('Мед корисний усім, навіть немовлятам.', 'Honey is good for everyone, even babies.'),
          science: T('НЕБЕЗПЕЧНО. Мед може містити спори Clostridium botulinum. У дитини до 1 року кишківник ще не захищений — спори проростають і виділяють нейротоксин (ботулізм немовлят, може бути смертельним). CDC і педіатри: жодного меду дітям до року.',
                     'DANGEROUS. Honey can carry Clostridium botulinum spores. In a child under 1, the gut isn’t protected yet — spores germinate and release a neurotoxin (infant botulism, potentially fatal). CDC and paediatricians: no honey under age 1.'),
          fig: 'botulism', conf: 'high', warning: true, src: 'botulism'
        },
        {
          street: T('Місцевий мед лікує сезонну алергію.', 'Local honey cures seasonal allergies.'),
          science: T('Не все так просто — докази слабкі й суперечливі. Одні рандомізовані дослідження (RCT) показали полегшення симптомів, інші — жодної переваги над плацебо. А біологічно теорія хитка: винуватець полінозу — пилок вітрозапильних трав і дерев, а його в меді майже немає, бо бджоли носять інший — із комахозапильних рослин.',
                     'Not so simple — evidence is weak and mixed. Some RCTs showed symptom relief, others found no benefit over placebo. And the theory is biologically shaky: hay fever is driven by wind-borne grass and tree pollen, barely present in honey — bees mostly carry a different, insect-borne pollen.'),
          fig: 'allergy', conf: 'disputed', nuance: true, src: 'allergy'
        }
      ]
    },
    {
      id: 'ch4', num: 'IV', kind: 'myths',
      title: T('ВОРОГ У ДОМІ: VARROA', 'ENEMY WITHIN: VARROA'),
      lead: T('Не погода і не «псування». Головна причина загибелі сімей має ім’я.',
              'Not the weather, not “going bad”. The main cause of colony death has a name.'),
      myths: [
        {
          street: T('Бджоли «померзли» або «зіпсувалися».', 'Bees die “from the cold” or “went bad”.'),
          science: T('Головний убивця — кліщ Varroa разом із вірусом DWV, який він заносить. Без кліща DWV майже безсимптомний; з кліщем — деформовані крила й колапс. Сучасний консенсус — «4 П»: паразити, патогени, пестициди, погане живлення діють синергічно.',
                     'The main killer is the Varroa mite together with the DWV virus it injects. Without the mite DWV is nearly symptomless; with it — deformed wings and collapse. The modern consensus is the “4 Ps”: parasites, pathogens, pesticides, poor nutrition acting together.'),
          fig: 'varroaFeed', conf: 'high', src: 'dwv'
        },
        {
          street: T('Наша бджола сама «запарить» шершня в гарячому клубку.', 'Our bee will “cook” a hornet in a hot ball.'),
          science: T('Не все так просто. Цей ефектний прийом (~46 °C + CO₂) — уміння азійської Apis cerana, а не нашої європейської Apis mellifera. У нашої він значно слабший — саме тому вторгнення інвазійних шершнів у Європу таке небезпечне.',
                     'Not so simple. That spectacular move (~46°C + CO₂) belongs to the Asian Apis cerana, not our European Apis mellifera. Ours does it far more weakly — which is exactly why invading hornets are a real threat in Europe.'),
          fig: 'hotBall', conf: 'high', nuance: true, src: 'ceranaball'
        }
      ]
    },
    {
      id: 'ch5', num: 'V', kind: 'montage',
      title: T('ДІДИ-ПРАДІДИ', 'OLD WIVES’ TALES'),
      lead: T('Швидкий монтаж. Народна мудрість проти доказів — п’ять раундів без перерви.',
              'Rapid montage. Folk wisdom vs the evidence — at speed.'),
      myths: [
        {
          street: T('Бджола завжди гине, щойно вжалить.', 'A bee always dies the moment it stings.'),
          science: T('Лише в еластичній шкірі ссавців зазубрене жало застрягає й відривається. Проти комах воно часто не застрягає, і бджола виживає. А матка має гладеньке жало — жалить багато разів.',
                     'Only in elastic mammal skin does the barbed sting lodge and tear free. Against insects it often doesn’t stick, and the bee survives. The queen’s sting is smooth — she stings many times.'),
          fig: 'sting', conf: 'high', src: 'stingers'
        },
        {
          street: T('Дим лякає бджіл «пожежею», і вони тікають.', 'Smoke scares bees with “fire”, so they flee.'),
          science: T('Головне не паніка, а хімія: дим притуплює сприйняття тривожного феромону й нюх узагалі. Ефект минає за 10–20 хвилин. Версія про «наїдання медом про запас» — другорядна.',
                     'It’s chemistry, not panic: smoke dampens the alarm pheromone and smell in general. The effect reverses in 10–20 min. “Gorging on honey” is secondary.'),
          fig: 'smoke', conf: 'medium', nuance: true, src: 'visscher'
        },
        {
          street: T('Узимку бджоли впадають у сплячку.', 'Bees hibernate in winter.'),
          science: T('Ні. Вони збиваються в «зимовий клуб» і тремтять м’язами, підтримуючи в його ядрі приблизно 20–35 °C навіть у мороз, і всю зиму живляться запасами меду.',
                     'No. They form a “winter cluster” and shiver their muscles, holding the core at roughly 20–35°C even in frost, eating stored honey all winter.'),
          fig: 'winter', conf: 'high', src: 'wintercluster'
        },
        {
          street: T('Рятуєш медоносну бджолу — рятуєш природу.', 'Saving the honey bee saves nature.'),
          science: T('Не зовсім. Медоносна — свійська тварина, як корова. За надмірної щільності пасік вона конкурує з дикими й одиночними бджолами за квіти та переносить їм патогени. Порятунок запилення — це збереження диких бджіл, а не лише вуликів.',
                     'Not quite. The honey bee is livestock, like a cow. At high apiary density it competes with wild and solitary bees for flowers and spreads pathogens to them. Saving pollination means conserving wild bees, not just hives.'),
          fig: 'managedWild', conf: 'high', nuance: true, src: 'managed'
        },
        {
          street: T('«Треба розказати бджолам» про смерть чи весілля в родині.', 'You must “tell the bees” of a death or wedding.'),
          science: T('Гарний обряд — але суто культурний. Бджоли не розуміють людських подій. На сім’ю впливають феромони, вібрація, вологість і запах, а не родинні новини.',
                     'A lovely ritual — but purely cultural. Bees don’t grasp human events. A colony responds to pheromones, vibration, humidity and scent, not family news.'),
          conf: 'high', nuance: true, src: 'winston1987'
        }
      ]
    }
  ];

  // UI-рядки
  const UI = {
    tagline: T('Усе, що ти знаєш про бджіл, тобі розказав дід. А дід не читав PubMed.',
               'Everything you know about bees, your grandad told you. And grandad never read PubMed.'),
    subtitle: T('Кримінальна сага одного вулика — на доказах, а не на переказах.',
                'A crime saga of one hive — built on evidence, not hearsay.'),
    scroll: T('Гортай униз', 'Scroll down'),
    verdictTitle: T('КОРОТКО: ВУЛИЦЯ ПРОТИ НАУКИ', 'IN SHORT: THE STREET vs THE SCIENCE'),
    verdictLead: T('Нема часу на всю сагу? Ось справа в одну колонку. Тисни, щоб пірнути глибше.',
                   'No time for the whole saga? Here’s the case in one column. Tap to dive deeper.'),
    street: T('ЩО КАЖЕ ВУЛИЦЯ', 'WHAT THE STREET SAYS'),
    scienceLbl: T('ЩО КАЖЕ НАУКА', 'WHAT THE SCIENCE SAYS'),
    sourceChip: T('джерело', 'source'),
    nuanceTag: T('НЕ ВСЕ ТАК ПРОСТО', 'IT’S COMPLICATED'),
    warnTag: T('ЗАСТЕРЕЖЕННЯ', 'WARNING'),
    busts: T('спростовує', 'busts'),
    confHigh: T('доказовість: висока', 'evidence: high'),
    confMedium: T('доказовість: середня', 'evidence: medium'),
    confDisputed: T('доказовість: спірна', 'evidence: disputed'),
    sourcesTitle: T('ДЖЕРЕЛА', 'SOURCES'),
    sourcesLead: T('Наука ніколи не спить. Кожне твердження вище стоїть на цьому:',
                   'The science never sleeps. Every claim above stands on this:'),
    caseFile: T('СПРАВА №', 'CASE FILE №'),
    exhibit: T('Речовий доказ', 'Exhibit'),
    dossier: T('ДОСЬЄ', 'DOSSIER'),
    motionOn: T('Рух: увімк.', 'Motion: on'),
    motionOff: T('Рух: вимк.', 'Motion: off'),
    motionShort: T('Рух', 'Motion'),
    footerCta: T('Більше доказового бджільництва — @dont_sting у Threads і база «Вулик знань».',
                 'More evidence-based beekeeping — @dont_sting on Threads and the “Hive of Knowledge” base.'),
    credits: T('«НЕ ЖАЛЬ» — доказовий комікс про бджіл. Наука ніколи не спить.',
               '“NO STING” — an evidence-based comic about bees. The science never sleeps.')
  };

  return { SOURCES, CAST, CHAPTERS, UI };
})();
