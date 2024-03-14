const regioes = [
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
const regioesOptions = {
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

const profissoesOptions = {
    arranjo_geral : 'Arranjo Geral',
    canalizador : 'Canalizador',
    carpinteiro : 'Carpinteiro',
    eletricista : 'Eletricista',
    empreiteiro : 'Empreiteiro',
    mudancas : 'Mudanças',
    pintor : 'Pintor',
    piscinas : 'Piscinas',
    jardineiro : 'Jardineiro',
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
}

const profissoes = [
    { value: 'canalizador', label: 'Canalizador', img: profissoesPngs['canalizador']},
    { value: 'carpinteiro', label: 'Carpinteiro', img: profissoesPngs['carpinteiro']},
    { value: 'eletricista', label: 'Eletricista', img: profissoesPngs['eletricista']},
    { value: 'empreiteiro', label: 'Empreiteiro', img: profissoesPngs['empreiteiro']},
    { value: 'jardineiro', label: 'Jardineiro', img: profissoesPngs['jardineiro']},
    { value: 'mudancas', label: 'Mudanças', img: profissoesPngs['mudancas']},
    { value: 'pintor', label: 'Pintor', img: profissoesPngs['pintor']},
    { value: 'piscinas', label: 'Piscinas', img: profissoesPngs['piscinas']},
]

const profissoes_animais = [
    { value: 'animais_lavagem_e_tosquia', label: 'Lavagem e Tosquia', img: profissoesPngs['animal']},
    { value: 'animais_passear', label: 'Passear', img: profissoesPngs['animal']},
    { value: 'animais_geral', label: 'Geral', img: profissoesPngs['animal']},
]

const profissoes_financas = [
    { value: 'financas_contabilista', label: 'Contabilista', img: profissoesPngs['finance']},
    { value: 'financas_credito_e_emprestimos', label: 'Credito e Empréstimos', img: profissoesPngs['finance']},
    { value: 'financas_geral', label: 'Geral', img: profissoesPngs['finance']},
]

const profissoes_construcao = [
    { value: 'construcao_azulejos', label: 'Azulejos', img: profissoesPngs['build']},
    { value: 'construcao_demolicao', label: 'Demolição', img: profissoesPngs['build']},
    { value: 'construcao_estucador', label: 'Estucador', img: profissoesPngs['build']},
    { value: 'construcao_pequenos_arranjos', label: 'Pequenos Arranjos', img: profissoesPngs['build']},
    { value: 'construcao_pintor', label: 'Pintor', img: profissoesPngs['build']},
    { value: 'construcao_remocao_de_entulho', label: 'Remoção de Entulho', img: profissoesPngs['build']},
    { value: 'construcao_geral', label: 'Geral', img: profissoesPngs['build']},
]

const profissoes_automoveis = [
    { value: 'auto_bate_chapa', label: 'Bate-Chapa', img: profissoesPngs['auto']},
    { value: 'auto_estofador', label: 'Estofador', img: profissoesPngs['auto']},
    { value: 'auto_mecanico', label: 'Mecânico', img: profissoesPngs['auto']},
    { value: 'auto_vidros', label: 'Vidros', img: profissoesPngs['auto']},
    { value: 'auto_geral', label: 'Geral', img: profissoesPngs['auto']},
]

const profissoes_vestuario = [
    { value: 'vestuario_costura', label: 'Costura', img: profissoesPngs['profissoes_vestuario']},
    { value: 'vestuario_lavagem_e_engomacao', label: 'Lavagem e Engomação', img: profissoesPngs['profissoes_vestuario']},
    { value: 'vestuario_sapateiro', label: 'Sapateiro', img: profissoesPngs['profissoes_vestuario']},
    { value: 'vestuario_geral', label: 'Geral', img: profissoesPngs['profissoes_vestuario']},
]

const profissoes_limpeza = [
    { value: 'limpeza_chamines', label: 'Chaminés', img: profissoesPngs['clean']},
    { value: 'limpeza_domestica', label: 'Doméstica', img: profissoesPngs['clean']},
    { value: 'limpeza_fachadas', label: 'Fachadas', img: profissoesPngs['clean']},
    { value: 'limpeza_geral', label: 'Geral', img: profissoesPngs['clean']},
]

const profissoesGrouped = [
    {
        label: 'no-label',
        options: [{ value: 'advogado', label: 'Advogado',  img: profissoesPngs['advogado'], solo: true}],
    },
    {
        label: 'Animais',
        options: profissoes_animais,
        img: profissoesPngs['animal']
    },
    {
        label: 'no-label',
        options: [{ value: 'arquiteto', label: 'Arquiteto', img: profissoesPngs['arquiteto'], solo: true}],
    },
    {
        label: 'Auto',
        options: profissoes_automoveis,
        img: profissoesPngs['auto']
    },
    {
        label: 'no-label',
        options: [{ value: 'ar_condicionados', label: 'Ar-Condicionados', img: profissoesPngs['ar_condicionado'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'babysitter', label: 'Baby-sitter', img: profissoesPngs['baby_sitter'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'canalizador', label: 'Canalizador', img: profissoesPngs['canalizador'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'carpinteiro', label: 'Carpinteiro', img: profissoesPngs['carpinteiro'], solo: true }],
    },
    {
        label: 'Construção',
        options: profissoes_construcao,
        img: profissoesPngs['build']
    },
    {
        label: 'no-label',
        options: [{ value: 'culinaria_e_catering', label: 'Culinaria e Catering', img: profissoesPngs['cooking'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'decoracao_e_interiores', label: 'Decoração e Interiores', img: profissoesPngs['lamp'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'desenho_e_ilustracao', label: 'Desenho e Ilustração', img: profissoesPngs['pencil'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'designer_grafico', label: 'Designer Gráfico', img: profissoesPngs['logo'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'desporto', label: 'Desporto', img: profissoesPngs['jogging'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'eletricista', label: 'Eletricista', img: profissoesPngs['eletricista'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'energias_verdes', label: 'Energias Verdes', img: profissoesPngs['solar_panel'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'estofador', label: 'Estofador', img: profissoesPngs['estofos'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'explicador', label: 'Explicador', img: profissoesPngs['explicador'], solo: true }],
    },
    {
        label: 'Finanças',
        options: profissoes_financas,
        img: profissoesPngs['finance']
    },
    {
        label: 'no-label',
        options: [{ value: 'fotografia', label: 'Fotografia', img: profissoesPngs['camera'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'informatica', label: 'Informática', img: profissoesPngs['desktop'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'jardinagem', label: 'Jardinagem', img: profissoesPngs['jardineiro'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'joelheria', label: 'Joelheria', img: profissoesPngs['ring'], solo: true }],
    },
    {
        label: 'Limpeza',
        options: profissoes_limpeza,
        img: profissoesPngs['clean']
    },
    {
        label: 'no-label',
        options: [{ value: 'motorista', label: 'Motorista', img: profissoesPngs['driver'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'mudancas', label: 'Mudanças', img: profissoesPngs['mudancas'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'musica', label: 'Música', img: profissoesPngs['music'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'piscinas', label: 'Piscinas', img: profissoesPngs['piscinas'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'publicidade', label: 'Publicidade', img: profissoesPngs['megaphone'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'soldador_e_serralheiro', label: 'Soldador e Serralheiro', img: profissoesPngs['beam'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'traducao', label: 'Tradução', img: profissoesPngs['translate'], solo: true }],
    },
    {
        label: 'no-label',
        options: [{ value: 'turismo', label: 'Turismo', img: profissoesPngs['map'], solo: true }],
    },
    {
        label: 'Vestuário',
        options: profissoes_vestuario,
        img: profissoesPngs['clothes']
    },
    {
        label: 'no-label',
        options: [{ value: 'outros', label: 'Outros', img: profissoesPngs['more'], solo: true }],
    },
]

module.exports = {
    regioes,
    profissoes,
    regioesOptions,
    profissoesOptions,
    profissoesPngs,
    profissoesGrouped
}