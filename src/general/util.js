const regioes = [
    { value: 'online', label: 'Online' },
    { value: 'acores', label: 'Açores' },
    { value: 'aveiro', label: 'Aveiro' },
    { value: 'beja', label: 'Beja' },
    { value: 'braga', label: 'Braga' },
    { value: 'braganca', label: 'Bragança' },
    { value: 'castelo_branco', label: 'Castelo Branco' },
    { value: 'coimbra', label: 'Coimbra' },
    { value: 'evora', label: 'Évora' },
    { value: 'faro', label: 'Faro' },
    { value: 'guarda', label: 'Guarda' },
    { value: 'leiria', label: 'Leiria' },
    { value: 'lisboa', label: 'Lisboa' },
    { value: 'madeira', label: 'Madeira' },
    { value: 'portalegre', label: 'Portalegre' },
    { value: 'porto', label: 'Porto' },
    { value: 'santarem', label: 'Santarém' },
    { value: 'setubal', label: 'Setúbal' },
    { value: 'viana_do_castelo', label: 'Viana do Castelo' },
    { value: 'vila_real', label: 'Vila Real' },
    { value: 'viseu', label: 'Viseu' }
]

const regioes_no_online = [
    // { value: 'online', label: 'Online' },
    { value: 'acores', label: 'Açores' },
    { value: 'aveiro', label: 'Aveiro' },
    { value: 'beja', label: 'Beja' },
    { value: 'braga', label: 'Braga' },
    { value: 'braganca', label: 'Bragança' },
    { value: 'castelo_branco', label: 'Castelo Branco' },
    { value: 'coimbra', label: 'Coimbra' },
    { value: 'evora', label: 'Évora' },
    { value: 'faro', label: 'Faro' },
    { value: 'guarda', label: 'Guarda' },
    { value: 'leiria', label: 'Leiria' },
    { value: 'lisboa', label: 'Lisboa' },
    { value: 'madeira', label: 'Madeira' },
    { value: 'portalegre', label: 'Portalegre' },
    { value: 'porto', label: 'Porto' },
    { value: 'santarem', label: 'Santarém' },
    { value: 'setubal', label: 'Setúbal' },
    { value: 'viana_do_castelo', label: 'Viana do Castelo' },
    { value: 'vila_real', label: 'Vila Real' },
    { value: 'viseu', label: 'Viseu' }
]
const regioesMap = {
    online: { value: 'online', label: 'Online' },
    acores: { value: 'acores', label: 'Açores' },
    aveiro: { value: 'aveiro', label: 'Aveiro' },
    beja: { value: 'beja', label: 'Beja' },
    braga: { value: 'braga', label: 'Braga' },
    braganca: { value: 'braganca', label: 'Bragança' },
    castelo_branco: { value: 'castelo_branco', label: 'Castelo Branco' },
    coimbra: { value: 'coimbra', label: 'Coimbra' },
    evora: { value: 'evora', label: 'Évora' },
    faro: { value: 'faro', label: 'Faro' },
    guarda: { value: 'guarda', label: 'Guarda' },
    leiria: { value: 'leiria', label: 'Leiria' },
    lisboa: { value: 'lisboa', label: 'Lisboa' },
    madeira: { value: 'madeira', label: 'Madeira' },
    portalegre: { value: 'portalegre', label: 'Portalegre' },
    porto: { value: 'porto', label: 'Porto' },
    santarem: { value: 'santarem', label: 'Santarém' },
    setubal: { value: 'setubal', label: 'Setúbal' },
    viana_do_castelo: { value: 'viana_do_castelo', label: 'Viana do Castelo' },
    vila_real: { value: 'vila_real', label: 'Vila Real' },
    viseu: { value: 'viseu', label: 'Viseu' }
}

const regioesOptions = {
    online: 'Online',
    acores : 'Açores',
    aveiro : 'Aveiro',
    beja : 'Beja',
    braga : 'Braga',
    braganca : 'Bragança',
    castelo_branco : 'Castelo Branco',
    coimbra : 'Coimbra',
    evora : 'Évora',
    faro : 'Faro',
    guarda : 'Guarda',
    leiria : 'Leiria',
    lisboa : 'Lisboa',
    madeira : 'Madeira',
    portalegre : 'Portalegre',
    porto : 'Porto',
    santarem : 'Santarém',
    setubal : 'Setúbal',
    viana_do_castelo : 'Viana do Castelo',
    vila_real : 'Vila Real',
    viseu : 'Viseu'
}

const profissoesPngs = {
    // arranjo_geral : require('../assets/professions/arranjo_geral_cor.png'),
    canalizador : require('../assets/professions/canalizador_cor.png'),
    carpinteiro : require('../assets/professions/carpinteiro_cor.png'),
    eletricista : require('../assets/professions/eletricista_cor.png'),
    build : require('../assets/professions/empreiteiro_cor.png'),
    mudancas : require('../assets/professions/mudancas_cor.png'),
    pintor : require('../assets/professions/pintor_cor.png'),
    piscinas : require('../assets/professions/piscinas_cor.png'),
    jardineiro : require('../assets/professions/jardineiro_cor.png'),
    animal: require('../assets/professions/paw-print.png'),
    auto: require('../assets/professions/car.png'),
    advogado: require('../assets/professions/line.png'),
    arquiteto: require('../assets/professions/blueprint.png'),
    profissoes_vestuario: require('../assets/professions/clothes.png'),
    advogado: require('../assets/professions/line.png'),
    ar_condicionado: require('../assets/professions/air-conditioner.png'),
    baby_sitter: require('../assets/professions/baby.png'),
    cooking: require('../assets/professions/frying-pan.png'),
    lamp: require('../assets/professions/table-lamp.png'),
    pencil: require('../assets/professions/pencil.png'),
    logo: require('../assets/professions/logo.png'),
    jogging: require('../assets/professions/jogging.png'),
    solar_panel: require('../assets/professions/solar-panel.png'),
    estofos: require('../assets/professions/armchair.png'),
    explicador: require('../assets/professions/abc.png'),
    finance: require('../assets/professions/calculator.png'),
    camera: require('../assets/professions/camera.png'),
    desktop: require('../assets/professions/desktop.png'),
    ring: require('../assets/professions/ring.png'),
    clean: require('../assets/professions/bucket.png'),
    driver: require('../assets/professions/driver.png'),
    music: require('../assets/professions/music.png'),
    megaphone: require('../assets/professions/megaphone.png'),
    beam: require('../assets/professions/beam.png'),
    translate: require('../assets/professions/translate.png'),
    map: require('../assets/professions/map.png'),
    more: require('../assets/professions/more.png'),
    saude: require('../assets/professions/saude.png'),
    fashion: require('../assets/professions/fashion.png'),
    healing: require('../assets/professions/healing.png'),
    beauty: require('../assets/professions/beauty.png'),
    shoe: require('../assets/professions/shoe.png'),
    suit: require('../assets/professions/suit.png'),
    reiki: require('../assets/professions/reiki.png'),
    security: require('../assets/professions/guard.png'),
    forklift: require('../assets/professions/forklift.png'),
    food: require('../assets/professions/food.png'),
    hotel: require('../assets/professions/hotel.png'),
    speaking: require('../assets/professions/speaking.png'),
}

const profissoesMap = {
    animais_lavagem_e_tosquia: { value: 'animais_lavagem_e_tosquia', label: 'Lavagem e Tosquia', img: profissoesPngs['animal']},
    animais_passeio: { value: 'animais_passeio', label: 'Passeio', img: profissoesPngs['animal']},
    animais_geral: { value: 'animais_geral', label: 'Geral (Animais)', img: profissoesPngs['animal']},
    financas_contabilista: { value: 'financas_contabilista', label: 'Contabilista', img: profissoesPngs['finance']},
    financas_credito_e_emprestimos: { value: 'financas_credito_e_emprestimos', label: 'Credito e Empréstimos', img: profissoesPngs['finance']},
    financas_geral: { value: 'financas_geral', label: 'Geral (Finanças)', img: profissoesPngs['finance']},
    construcao_azulejos: { value: 'construcao_azulejos', label: 'Azulejos', img: profissoesPngs['build']},
    construcao_demolicao: { value: 'construcao_demolicao', label: 'Demolição', img: profissoesPngs['build']},
    construcao_estucador: { value: 'construcao_estucador', label: 'Estucador', img: profissoesPngs['build']},
    construcao_reparacoes: { value: 'construcao_reparacoes', label: 'Reparações', img: profissoesPngs['build']},
    construcao_pintor: { value: 'construcao_pintor', label: 'Pintor', img: profissoesPngs['build']},
    construcao_remocao_de_entulho: { value: 'construcao_remocao_de_entulho', label: 'Remoção de Entulho', img: profissoesPngs['build']},
    construcao_geral: { value: 'construcao_geral', label: 'Geral (Construção)', img: profissoesPngs['build']},
    auto_bate_chapa: { value: 'auto_bate_chapa', label: 'Bate-Chapa', img: profissoesPngs['auto']},
    auto_estofador: { value: 'auto_estofador', label: 'Estofador', img: profissoesPngs['auto']},
    auto_mecanico: { value: 'auto_mecanico', label: 'Mecânico', img: profissoesPngs['auto']},
    auto_vidros: { value: 'auto_vidros', label: 'Vidros', img: profissoesPngs['auto']},
    auto_geral: { value: 'auto_geral', label: 'Geral (Auto)', img: profissoesPngs['auto']},
    vestuario_costura: { value: 'vestuario_costura', label: 'Costura', img: profissoesPngs['profissoes_vestuario']},
    vestuario_lavagem_e_engomacao: { value: 'vestuario_lavagem_e_engomacao', label: 'Lavagem e Engomação', img: profissoesPngs['profissoes_vestuario']},
    vestuario_geral: { value: 'vestuario_geral', label: 'Geral (Vestuário)', img: profissoesPngs['profissoes_vestuario']},
    limpeza_chamines: { value: 'limpeza_chamines', label: 'Chaminés', img: profissoesPngs['clean']},
    limpeza_domestica: { value: 'limpeza_domestica', label: 'Doméstica', img: profissoesPngs['clean']},
    limpeza_fachadas: { value: 'limpeza_fachadas', label: 'Fachadas', img: profissoesPngs['clean']},
    limpeza_geral: { value: 'limpeza_geral', label: 'Geral (Limpeza)', img: profissoesPngs['clean']},
    advogado: { value: 'advogado', label: 'Advogado',  img: profissoesPngs['advogado'], solo: true},
    arquiteto: { value: 'arquiteto', label: 'Arquiteto', img: profissoesPngs['arquiteto'], solo: true},
    ar_condicionados: { value: 'ar_condicionados', label: 'Ar-Condicionados', img: profissoesPngs['ar_condicionado'], solo: true },
    baby_sitter: { value: 'baby_sitter', label: 'Baby-sitter', img: profissoesPngs['baby_sitter'], solo: true },
    canalizador: { value: 'canalizador', label: 'Canalizador', img: profissoesPngs['canalizador'], solo: true },
    carpinteiro: { value: 'carpinteiro', label: 'Carpinteiro', img: profissoesPngs['carpinteiro'], solo: true },
    culinaria_e_catering: { value: 'culinaria_e_catering', label: 'Culinária e Catering', img: profissoesPngs['cooking'], solo: true },
    decoracao_e_interiores: { value: 'decoracao_e_interiores', label: 'Decoração e Interiores', img: profissoesPngs['lamp'], solo: true },
    desenho_e_ilustracao: { value: 'desenho_e_ilustracao', label: 'Desenho e Ilustração', img: profissoesPngs['pencil'], solo: true },
    desenho_tecnico: { value: 'desenho_tecnico', label: 'Desenho Técnico', img: profissoesPngs['pencil'], solo: true },
    designer_grafico: { value: 'designer_grafico', label: 'Designer Gráfico', img: profissoesPngs['logo'], solo: true },
    desporto: { value: 'desporto', label: 'Desporto', img: profissoesPngs['jogging'], solo: true },
    eletricista: { value: 'eletricista', label: 'Eletricista', img: profissoesPngs['eletricista'], solo: true },
    energias_verdes: { value: 'energias_verdes', label: 'Energias Verdes', img: profissoesPngs['solar_panel'], solo: true },
    estofador: { value: 'estofador', label: 'Estofador', img: profissoesPngs['estofos'], solo: true },
    explicador: { value: 'explicador', label: 'Explicador', img: profissoesPngs['explicador'], solo: true },
    fotografia: { value: 'fotografia', label: 'Fotografia', img: profissoesPngs['camera'], solo: true },
    informatica: { value: 'informatica', label: 'Informática', img: profissoesPngs['desktop'], solo: true },
    jardinagem: { value: 'jardinagem', label: 'Jardinagem', img: profissoesPngs['jardineiro'], solo: true },
    joalharia_e_trabalhos_manuais: { value: 'joalharia_e_trabalhos_manuais', label: 'Joalharia e Trabalhos Manuais', img: profissoesPngs['ring'], solo: true },
    motorista: { value: 'motorista', label: 'Motorista', img: profissoesPngs['driver'], solo: true },
    mudancas: { value: 'mudancas', label: 'Mudanças', img: profissoesPngs['mudancas'], solo: true },
    musica: { value: 'musica', label: 'Música', img: profissoesPngs['music'], solo: true },
    piscinas: { value: 'piscinas', label: 'Piscinas', img: profissoesPngs['piscinas'], solo: true },
    publicidade: { value: 'publicidade', label: 'Publicidade', img: profissoesPngs['megaphone'], solo: true },
    soldador_e_serralheiro: { value: 'soldador_e_serralheiro', label: 'Soldador e Serralheiro', img: profissoesPngs['beam'], solo: true },
    traducao: { value: 'traducao', label: 'Tradução', img: profissoesPngs['translate'], solo: true },
    turismo: { value: 'turismo', label: 'Turismo', img: profissoesPngs['map'], solo: true },
    outros: { value: 'outros', label: 'Outros', img: profissoesPngs['more'], solo: true },
    saude_acupuntura : { value: 'saude_acupuntura', label: 'Acupuntura', img: profissoesPngs['saude']},
    saude_fisioterapeuta : { value: 'saude_fisioterapeuta', label: 'Fisioterapeuta', img: profissoesPngs['saude']},
    saude_massagista : { value: 'saude_massagista', label: 'Massagista', img: profissoesPngs['saude']},
    saude_nutricionista : { value: 'saude_nutricionista', label: 'Nutricionista', img: profissoesPngs['saude']},
    saude_quiroprata : { value: 'saude_quiroprata', label: 'Quiroprata', img: profissoesPngs['saude']},
    saude_geral : { value: 'saude_geral', label: 'Geral (Saúde)', img: profissoesPngs['saude']},
    designer_de_moda : { value: 'designer_de_moda', label: 'Designer de Moda', img: profissoesPngs['fashion'], solo: true},
    healing : { value: 'healing', label: 'Healing', img: profissoesPngs['healing'], solo: true},
    beleza_cabeleireiro: { value: 'beleza_cabeleireiro', label: 'Cabeleireiro', img: profissoesPngs['beauty']},
    beleza_esteticista: { value: 'beleza_esteticista', label: 'Esteticista', img: profissoesPngs['beauty']},
    beleza_maquilhagem: { value: 'beleza_maquilhagem', label: 'Maquilhagem', img: profissoesPngs['beauty']},
    beleza_geral: { value: 'beleza_geral', label: 'Geral (Beleza)', img: profissoesPngs['beauty']},
    sapateiro_e_cabedal: { value: 'sapateiro_e_cabedal', label: 'Sapateiro e Cabedal', img: profissoesPngs['shoe'], solo: true},
    alfaiate: { value: 'alfaiate', label: 'Alfaiate', img: profissoesPngs['suit'], solo: true},
    ciencias_misticas: { value: 'ciencias_misticas', label: 'Ciências Místicas', img: profissoesPngs['reiki'], solo: true},
    seguranca: { value: 'seguranca', label: 'Segurança', img: profissoesPngs['security'], solo: true},
    operador_de_maquinas: { value: 'operador_de_maquinas', label: 'Operador de Máquinas', img: profissoesPngs['forklift'], solo: true},
    restauracao_cozinheiro: { value: 'restauracao_cozinheiro', label: 'Cozinheiro', img: profissoesPngs['food']},
    restauracao_empregado_mesa: { value: 'restauracao_empregrado_mesa', label: 'Empregrado Mesa', img: profissoesPngs['food']},
    restauracao_empregado_bar: { value: 'restauracao_empregado_bar', label: 'Empregado Bar', img: profissoesPngs['food']},
    restauracao_geral: { value: 'restauracao_geral', label: 'Geral (Restauração)', img: profissoesPngs['food']},
    hotelaria: { value: 'hotelaria', label: 'Hotelaria', img: profissoesPngs['hotel']},
    interprete: { value: 'interprete', label: 'Intérprete', img: profissoesPngs['speaking'], solo: true},
}

const profissoes_animais = [
    profissoesMap.animais_lavagem_e_tosquia,
    profissoesMap.animais_passeio,
    profissoesMap.animais_geral,
]

const profissoes_financas = [
    profissoesMap.financas_contabilista,
    profissoesMap.financas_credito_e_emprestimos,
    profissoesMap.financas_geral,
]

const profissoes_construcao = [
    profissoesMap.construcao_azulejos,
    profissoesMap.construcao_demolicao,
    profissoesMap.construcao_estucador,
    profissoesMap.construcao_reparacoes,
    profissoesMap.construcao_pintor,
    profissoesMap.construcao_remocao_de_entulho,
    profissoesMap.construcao_geral,
]

const profissoes_automoveis = [
    profissoesMap.auto_bate_chapa,
    profissoesMap.auto_estofador,
    profissoesMap.auto_mecanico,
    profissoesMap.auto_vidros,
    profissoesMap.auto_geral,
]

const profissoes_vestuario = [
    profissoesMap.vestuario_costura,
    profissoesMap.vestuario_lavagem_e_engomacao,
    profissoesMap.vestuario_geral,
]

const profissoes_limpeza = [
    profissoesMap.limpeza_chamines,
    profissoesMap.limpeza_domestica,
    profissoesMap.limpeza_fachadas,
    profissoesMap.limpeza_geral,
]

const profissoes_saude  = [
    profissoesMap.saude_acupuntura,
    profissoesMap.saude_fisioterapeuta,
    profissoesMap.saude_massagista,
    profissoesMap.saude_nutricionista,
    profissoesMap.saude_quiroprata,
    profissoesMap.saude_geral,
]

const profissoes_beleza  = [
    profissoesMap.beleza_cabeleireiro,
    profissoesMap.beleza_esteticista,
    profissoesMap.beleza_maquilhagem,
    profissoesMap.beleza_geral
]

const profissoes_restauracao = [
    profissoesMap.restauracao_cozinheiro,
    profissoesMap.restauracao_empregado_bar,
    profissoesMap.restauracao_empregado_mesa,
    profissoesMap.restauracao_geral
]

const profissoesGrouped = [
    {
        label: 'no-label',
        options: [profissoesMap.advogado],
    },
    {
        label: 'no-label',
        options: [profissoesMap.alfaiate],
    },
    {
        label: 'Animais',
        options: profissoes_animais,
        img: profissoesPngs['animal']
    },
    {
        label: 'no-label',
        options: [profissoesMap.arquiteto],
    },
    {
        label: 'Auto',
        options: profissoes_automoveis,
        img: profissoesPngs['auto']
    },
    {
        label: 'no-label',
        options: [profissoesMap.ar_condicionados],
    },
    {
        label: 'no-label',
        options: [profissoesMap.baby_sitter],
    },
    {
        label: 'Beleza',
        options: profissoes_beleza,
        img: profissoesPngs['beauty']
    },
    {
        label: 'no-label',
        options: [profissoesMap.canalizador],
    },
    {
        label: 'no-label',
        options: [profissoesMap.carpinteiro],
    },
    {
        label: 'no-label',
        options: [profissoesMap.ciencias_misticas],
    },
    {
        label: 'Construção',
        options: profissoes_construcao,
        img: profissoesPngs['build']
    },
    {
        label: 'no-label',
        options: [profissoesMap.culinaria_e_catering],
    },
    {
        label: 'no-label',
        options: [profissoesMap.decoracao_e_interiores],
    },
    {
        label: 'no-label',
        options: [profissoesMap.desenho_e_ilustracao],
    },
    {
        label: 'no-label',
        options: [profissoesMap.desenho_tecnico],
    },
    {
        label: 'no-label',
        options: [profissoesMap.designer_de_moda],
    },
    {
        label: 'no-label',
        options: [profissoesMap.designer_grafico],
    },
    {
        label: 'no-label',
        options: [profissoesMap.desporto],
    },
    {
        label: 'no-label',
        options: [profissoesMap.eletricista],
    },
    {
        label: 'no-label',
        options: [profissoesMap.energias_verdes],
    },
    {
        label: 'no-label',
        options: [profissoesMap.estofador],
    },
    {
        label: 'no-label',
        options: [profissoesMap.explicador],
    },
    {
        label: 'Finanças',
        options: profissoes_financas,
        img: profissoesPngs['finance']
    },
    {
        label: 'no-label',
        options: [profissoesMap.fotografia],
    },
    {
        label: 'no-label',
        options: [profissoesMap.healing],
    },
    {
        label: 'no-label',
        options: [profissoesMap.hotelaria],
    },
    {
        label: 'no-label',
        options: [profissoesMap.informatica],
    },
    {
        label: 'no-label',
        options: [profissoesMap.interprete],
    },
    {
        label: 'no-label',
        options: [profissoesMap.jardinagem],
    },
    {
        label: 'no-label',
        options: [profissoesMap.joalharia_e_trabalhos_manuais],
    },
    {
        label: 'Limpeza',
        options: profissoes_limpeza,
        img: profissoesPngs['clean']
    },
    {
        label: 'no-label',
        options: [profissoesMap.motorista],
    },
    {
        label: 'no-label',
        options: [profissoesMap.mudancas],
    },
    {
        label: 'no-label',
        options: [profissoesMap.musica],
    },
    {
        label: 'no-label',
        options: [profissoesMap.operador_de_maquinas],
    },
    {
        label: 'no-label',
        options: [profissoesMap.piscinas],
    },
    {
        label: 'no-label',
        options: [profissoesMap.publicidade],
    },
    {
        label: 'Restauração',
        options: profissoes_restauracao,
        img: profissoesPngs['food']
    },
    {
        label: 'no-label',
        options: [profissoesMap.sapateiro_e_cabedal]
    },
    {
        label: 'Saúde',
        options: profissoes_saude,
        img: profissoesPngs['saude']
    },
    {
        label: 'no-label',
        options: [profissoesMap.seguranca]
    },
    {
        label: 'no-label',
        options: [profissoesMap.soldador_e_serralheiro],
    },
    {
        label: 'no-label',
        options: [profissoesMap.traducao],
    },
    {
        label: 'no-label',
        options: [profissoesMap.turismo],
    },
    {
        label: 'Vestuário',
        options: profissoes_vestuario,
        img: profissoesPngs['profissoes_vestuario']
    },
    {
        label: 'no-label',
        options: [profissoesMap.outros],
    },
]

module.exports = {
    regioes,
    regioes_no_online,
    regioesOptions,
    regioesMap,
    profissoesGrouped,
    profissoesMap
}