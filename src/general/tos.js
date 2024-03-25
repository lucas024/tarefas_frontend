import React from 'react'
import styles from './tos.module.css'
import logo_text from '../assets/logo_png_white_background.png'

const Tos = () => {
    return (
        <div className={styles.tos}>
            <p className={styles.tos_title}>Termos e Condições de Utilização</p>
            <p className={styles.tos_title_helper}>POR FAVOR LEIA ATENTAMENTE ESTES TERMOS E CONDIÇÕES DE SERVIÇO ANTES DE UTILIZAR ESTE WEBSITE OU ESTA APLICAÇÃO E CONTRATAR OS NOSSOS SERVIÇOS</p>
            <p className={styles.tos_title_info}>(Última atualização em 20 de março de 2024)</p>

            <ol className={styles.tos_main_ol}>
                <li className={styles.tos_main_li}>Definições</li>
                <ol className={styles.tos_ol}>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_li_title}>Dia</span>
                        <span> - </span>
                        <span className={styles.tos_desc}>significa 24 horas consecutivas.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_li_title}>Visitante</span>
                        <span> - </span>
                        <span className={styles.tos_desc}>pessoa, singular ou coletiva, que aceda ao Website ou à Aplicação, sem possuir uma conta ou iniciar a sessão/login na mesma.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_li_title}>TAREFAS/Serviço/Website</span>
                        <span> - </span>
                        <span className={styles.tos_desc}>plataforma online gerida por esta entidade que serve o serviço aos Utilizadores/Visitantes, disponível no domínio pt-tarefas.pt e na aplicação móvel TAREFAS.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_li_title}>Tarefa/Anúncio/Publicação</span>
                        <span> - </span>
                        <span className={styles.tos_desc}>uma proposta de requisição de um serviço colocado/disponibilizado pelo utilizador no website/aplicação.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_li_title}>Conta</span>
                        <span> - </span>
                        <span className={styles.tos_desc}>conjunto de dados relacionados com um Utilizador específico, incluindo informações sobre a sua atividade no Website, incluindo informações fornecidas pelo utilizador no Website.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_li_title}>Limite</span>
                        <span> - </span>
                        <span className={styles.tos_desc}>número de Publicações disponíveis que o Utilizador pode publicar no Website/Aplicação durante um período especificado.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_li_title}>Subscrição</span>
                        <span> - </span>
                        <span className={styles.tos_desc}>utilização sem restringimentos que é oferecido ao profissional pelo Tarefas que subscrevem a um plano.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_li_title}>Termos e Condições</span>
                        <span> - </span>
                        <span className={styles.tos_desc}>estes Termos e Condições e os respetivos anexos, que estabelecem as regras de utilização do Website. A versão atual do Termos e Condições está disponível no Website a qualquer momento.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_li_title}>Registo utilizador</span>
                        <span> - </span>
                        <span className={styles.tos_desc}>processo de criação de uma Conta de Utilizador, depois de fornecer os seus dados, aceitar o Termos e Condições e ativar a Conta.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_li_title}>Registo profissional</span>
                        <span> - </span>
                        <span className={styles.tos_desc}>processo de criação de uma Conta de Profissional feito por um Utilizador, depois de fornecer os seus dados, aceitar o Termos e Condições e ativar a Conta.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_li_title}>Anunciante/Utilizador</span>
                        <span> - </span>
                        <span className={styles.tos_desc}>pessoa singular, pessoa colectiva ou entidade organizacional sem personalidade jurídica, com capacidade jurídica plena para a promoção e/ou celebração de transações relativas à Tarefa que tem intenção de anunciar, de acordo com o direito português, e que utiliza o Serviço depois de iniciar a sessão na Conta/fazer login.</span>
                    </li>

                    <li className={styles.tos_li}>
                        <span className={styles.tos_li_title}>Profissional</span>
                        <span> - </span>
                        <span className={styles.tos_desc}>pessoa singular, pessoa colectiva ou entidade organizacional sem personalidade jurídica, com capacidade jurídica plena para a promoção e/ou celebração de transações relativas à subscrição que pretende aceder a diferentes tarefas, publicitar o seu perfil e subscrever-se a conteúdo pago, de acordo com o direito português, e que utiliza o Serviço depois de iniciar a sessão na Conta/fazer login.</span>
                    </li>
                </ol>

                {/* Disposições Gerais */}
                <li className={styles.tos_main_li}>Disposições Gerais</li>

                <p className={styles.tos_title_info}>Estes Termos e Condições fornecem-lhe as regras de utilização do nosso site pt-servicos.pt (“Website”) e da nossa aplicação para dispositivos móveis denominada “TAREFAS” (“Aplicação”) e contêm a informação pré-contratual obrigatória nos termos da lei aplicável.</p>
                <p className={styles.tos_title_info}>Os contratos de prestação de serviços com a TAREFAS são celebrados em português.</p>
                <p className={styles.tos_title_info}>A contratação através desta plataforma é uma contratação eletrónica, nos termos do disposto nos artigos 26.º do Decreto-Lei n.º 7/2004, de 7 de janeiro e 3.º do Decreto-Lei n.º 290-D/99, de 2 de agosto e cumpre o disposto no Decreto-Lei n.º 24/2014, de 14 de fevereiro. Caso não concorde com a celebração do contrato por meios eletrónicos, não deverá utilizar o Website ou a Aplicação. Ao aceitar os presentes Termos e Condições o Utilizador/Profissional aceita e reconhece que:</p>


                <ol className={styles.tos_ol}>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Os Termos e condições de utilização do Website, incluindo as regras de Registo, Anúncio de Tarefas e compra de Subscrições, bem como questões relacionadas com o procedimento de pagamento e reclamação, encontram-se estabelecidos nos Termos e Condições. Qualquer pessoa que utilize o Serviço está obrigada a tomar conhecimento do teor do Termos e Condições.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>A prestação do serviço TAREFAS está dependente da total aceitação destas condições, pelo que qualquer utilizador que não esteja de acordo ou não se comprometa a comportar-se de acordo com estas condições não poderá utilizar o referido serviço.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Qualquer alteração aos presentes Termos e Condições será comunicada num suporte duradouro aos utilizadores dentro de um prazo razoável (de pré-aviso) igual ou não inferior a 15 Dias, salvo se outro prazo legal for aplicável.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Os Visitantes apenas podem utilizar as funções limitadas do Serviço nos termos previstos nos presentes Termos e Condições, respeitando a lei e os princípios de integridade.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Na utilização através da funcionalidade de navegação como Visitante são solicitados apenas os dados imprescindíveis para poder realizar a sua consulta ou pedido. O TAREFAS irá apenas processar os dados pessoais dos Visitantes, de acordo com as disposições da Política de Privacidade e Política de Cookies e tecnologias similares do Website.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Os conteúdos publicados no Serviço, incluindo em particular Anúncios, qualquer que seja a sua forma, isto é texto, gráfico ou vídeo, estão sujeitos à proteção dos direitos de propriedade intelectual, incluindo copyright e direitos de propriedade industrial do TAREFAS, dos Vendedores ou de terceiros. É proibido fazer qualquer utilização destes conteúdos sem o consentimento por escrito das pessoas autorizadas. É proibida qualquer agregação e processamento de dados e outras informações disponíveis no Website tendo em vista a sua partilha com terceiros noutros Websites e fora da Internet. É igualmente proibido o uso do Website e das designações do TAREFAS, incluindo elementos gráficos característicos sem o consentimento do TAREFAS.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O TAREFAS não é uma parte na prestação de uma tarefa feita pelo profissional, assim sendo:</span>
                        <ol className={styles.tos_inner_ol} type="a">
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>O TAREFAS não se responsabiliza pelo comportamento dos anunciantes, ou itens e serviços anunciados por eles para venda como descrito nos seus anúncios. Ao infringir num determinado Anúncio as regras vigentes no TAREFAS, o utilizador assumirá toda e qualquer responsabilidade resultando em danos ou prejuízos perante qualquer entidade, pessoa singular ou colectiva, estando o TAREFAS isento de qualquer tipo de responsabilidade resultante.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>A legalidade do acesso ao serviço/tarefa está dependente do facto de não serem celebrados qualquer tipo de contratos, onerosos ou não, sob a alçada do TAREFAS, pelo que o acesso ao serviço/tarefa é permitido aos utilizadores, independentemente da posse de total capacidade jurídica, por parte destes. Não detendo um carácter mediador de transacções, o TAREFAS não se responsabiliza por qualquer eventualidade resultante da falta de capacidade jurídica dos utilizadores.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>O TAREFAS não se responsabiliza por qualquer dano que ocorra na sequência de uma transacção ou prestação de tarefa, ou comportamento inadequado de uma das partes desta mesma transacção.</span>
                            </li>
                        </ol>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Como parte do Website, é possível:</span>
                        <ol className={styles.tos_inner_ol} type="a">
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>consultar o conteúdo do Website.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>utilizar a Conta e as funcionalidades relacionadas.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>publicar Anúncios dentro dos limites disponíveis a cada utilizador.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>publicitar o seu serviço através da existência da conta profissional que é de livre acesso a qualquer utilizador do website.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>utilizar o serviço de subscrição, que retira os restringimentos à conta de profissional.</span>
                            </li>
                        </ol>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Para utilizar o Website na sua totalidade, é necessário ter ligado à Internet um dispositivo que cumpra os seguintes requisitos, mas não limitado a:</span>
                        <ol className={styles.tos_inner_ol} type="a">
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>ligação ativa à Internet que permita comunicações bidirecionais através do protocolo https, sendo necessário que o endereço de Internet Protocol (IP) seja Português.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>devidamente instalado e configurado, Web browser atualizado que suporte a norma HTML5 e tecnologia de folhas de estilo em cascata (CSS3), p. ex., Google Chrome, Mozilla Firefox, Opera, Microsoft Edge.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>JavaScript e cookies ativados (normalmente ativados por predefinição no browser).</span>
                            </li>
                        </ol>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O Website pode não ser mostrado corretamente em televisores ou telefones Blackberry e Windows.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O TAREFAS envidará todos os esforços no sentido de garantir um funcionamento contínuo do Website. Para garantir uma elevada qualidade e a conformidade dos serviços, e um funcionamento eficiente dos Serviços, sendo o mesmo responsável por qualquer falta de conformidade que: (i) Exista no momento do fornecimento, nos contratos em que seja estipulado um único ato de fornecimento ou uma série de atos individuais de fornecimento, durante o prazo de dois anos, em conformidade com o disposto na Lei; ou; (ii) Ocorra ou se manifeste no período durante o qual os conteúdos ou serviços digitais devam ser fornecidos, nos contratos em que seja estipulado um fornecimento contínuo. O TAREFAS reserva-se, porém, o direito de efectuar paragens no funcionamento do Serviço ou de suspender temporariamente as suas operações por razões técnicas, ou causas fora do controlo do TAREFAS.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Poderão ainda ser alterados os conteúdos ou serviços para além do necessário para os manter em conformidade. Qualquer alteração aos serviços digitais não afetará os serviços previamente adquiridos relativamente à data de produção de efeitos das alterações ou incorrerá em custos para o consumidor. </span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O consumidor tem direito a rescindir o contrato caso a alteração tenha um impacto negativo no acesso ou na utilização dos conteúdos ou serviços, a menos que tal impacto seja apenas menor. Neste caso, o consumidor tem direito a rescindir o contrato, a título gratuito, no prazo de 30 Dias a contar da data de receção da notificação ou do momento em que os conteúdos ou serviços digitais foram alterados, consoante a data que for posterior.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Os anúncios ou publicações devem respeitar, obrigatoriamente, as condições indicadas na secção "Conteúdo e Anúncios" dos Termos e Condições.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Os Utilizadores que comuniquem com outros Utilizadores ou Profissionais através da funcionalidade de chat do Serviço reconhecem que estas conversações não são privadas e que o respetivo conteúdo pode ser acedido, recolhido e lido pelo TAREFAS. Ao aceitar os presentes Termos e Condições, o Utilizador/Profissional aceita e reconhece o direito do TAREFAS consultar e aceder ao conteúdo das conversações mantidas através da funcionalidade de chat do Website, tendo em vista o aumento da segurança e proteção dos Utilizadores, bem como para efeitos de prevenção de fraudes e o aperfeiçoamento do Website. Para mais informações sobre a forma e os motivos pelos quais o TAREFAS acede e analisa o conteúdo das conversações mantidas através das funcionalidades de sala de chat do Serviço.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>As mensagens e respectivos anexos armazenados no Website, através do registo da conta, permanecem no sistema por um período de 4 (quatro) meses.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>As publicações no Serviço são apresentados aos Utilizadores com base em filtros dedicados que permitem a seleção de princípios de ordenação pela data em que foram adicionados. Os filtros utilizados no Serviço permitem:</span>
                        <ol className={styles.tos_inner_ol} type="a">
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>Procurar por um certo tipo de tarefa, região ou os dois em simultâneo</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>Procurar por texto nomes de profissionais, tarefas, regiões e outros</span>
                            </li>
                        </ol>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>As recomendações de Anúncios baseiam-se numa análise de critérios que avaliam a proximidade entre a expressão ou frase procurada pelo Utilizador/Profissional e o título do Anúncio, os seus parâmetros, os filtros de pesquisa aplicados e a categoria mais relevante relacionada com a expressão ou frase. O sistema de recomendação tem em conta os seguintes parâmetros:</span>
                        <ol className={styles.tos_inner_ol} type="a">
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>A correspondência entre o que foi introduzido durante a pesquisa e o conteúdo e título do Anúncio.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>Se o Anúncio se enquadra na sua categoria de pesquisa</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>O tipo de Vendedor (empresa ou particular).</span>
                            </li>
                        </ol>
                    </li>

                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O Serviço também apresenta conteúdos publicitários. Os conteúdos publicitários disponíveis no Serviço são apresentados de acordo com as escolhas do Utilizador/Profissional relativamente à utilização de cookies ou às definições do browser. Se o Utilizador/Profissional tiver consentido na personalização do conteúdo, os conteúdos publicitários apresentados são adaptados às preferências do Utilizador/Profissional com base na sua atividade no Serviço. Se o TAREFAS não tiver obtido o consentimento para a personalização do conteúdo publicitário, o conteúdo apresentado não será personalizado e irá basear-se em criações publicitárias preparadas para a base geral de Utilizadores.</span>
                    </li>
                </ol>

                {/* Contas */}
                <li className={styles.tos_main_li}>Contas</li>
                <ol className={styles.tos_ol}>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Para fazer uso de toda a funcionalidade do Serviço, o Visitante deve registar uma conta e utilizar o Serviço como um Utilizador/Profissional com sessão iniciada. A conta dá ao Utilizador/Profissional a possibilidade de utilizar, entre outras, as seguintes funcionalidades do Website:</span>
                        <ol className={styles.tos_inner_ol} type="a">
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>publicar e gerir Anúncios publicados.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>consultar os Anúncios de outros Utilizadores.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>enviar e receber mensagens para e de outros utilizadores/profissionais.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>enviar e/ou receber mensagens através da sua conta, facilitando a comunicação com outros utilizadores.</span>
                            </li>
                        </ol>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Conforme disposto na nossa Política de Privacidade, para se registar e usar os nossos Serviços, terá que adotar uma das seguintes modalidades de registo:</span>
                        <ol className={styles.tos_inner_ol} type="a">
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>Registo através do seu endereço de e-mail.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>Registo através de Conta Google, caso em que recolhemos o seu nome, apelido e endereço de e-mail.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>Registo através de conta Facebook, caso em que recolhemos o seu nome e apelido, conforme constar da sua conta do Facebook e respectivo perfil. Caso tenha dado permissão ao Facebook através da opção de privacidade na aplicação, poderemos recolher ainda o seu género, idade ou endereço de e-mail, conforme as autorizações que tenha dado.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>enviar e/ou receber mensagens através da sua conta, facilitando a comunicação com outros utilizadores.</span>
                            </li>
                        </ol>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Poderá optar ainda por fornecer adicionalmente os seguintes dados:</span>
                        <ol className={styles.tos_inner_ol} type="a">
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>Número de telemóvel.</span>
                            </li>
                        </ol>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O Utilizador/Profissional apenas pode ser uma pessoa singular com capacidade jurídica total, pessoa coletiva ou unidade organizacional sem personalidade jurídica, à qual o ato confira capacidade jurídica. No caso de pessoas coletivas e unidades organizacionais sem personalidade jurídica, deve criar uma Conta no seu nome, sendo que apenas a pessoa autorizada a agir em nome dessas entidades pode executar todas as atividades no Website</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O Utilizador/Profissional pode ter apenas uma conta no Serviço, pelo que a cada Anunciante ou Visitante apenas pode corresponder um registo. Podemos cancelar e bloquear definitivamente qualquer registo subsequente efetuado pelo mesmo Anunciante ou Visitante, sendo o Anunciante ou Visitante notificado para o efeito</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O disposto no número anterior não é aplicável nas seguintes situações:</span>
                        <ol className={styles.tos_inner_ol} type="a">
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>O Utilizador/Profissional utiliza diferentes contas no âmbito de ser utilizador ou profissional.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>É necessário configurar outra conta devido à falta de possibilidade de acesso à conta (esquecimento da senha).</span>
                            </li>
                        </ol>
                        <span className={styles.tos_desc}>No entanto, todas as exclusões a este respeito serão verificadas e analisadas em detalhes pelo TAREFAS, que tem o direito de suspender a Conta pelo tempo de verificação ou excluir as Contas na ausência de confirmação das circunstâncias que justificam a aplicação das exclusões acima. As exclusões acima não serão aplicáveis se forem utilizadas pelo Utilizador/Profissional única e exclusivamente com o propósito de evitar o pagamento de contas pelos serviços prestados no Website.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O registo da conta requer:</span>
                        <ol className={styles.tos_inner_ol} type="a">
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>o preenchimento do formulário disponível no Website e o fornecimento dos dados nele solicitados, incluindo o respetivo endereço de correio eletrónico e uma palavra-passe única ou a autenticação através de um fornecedor de serviços externo como, por exemplo, o Facebook ou Google.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>a leitura dos Termos e Condições e dos respetivos anexos e a aceitação das respetivas provisões.</span>
                            </li>
                        </ol>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Após o registo, o Anunciante ou Utilizador/Profissional passa a ser titular de um código de acesso à sua conta (login e password), sendo a conta do Anunciante ou Visitante pessoal e intransmissível. O titular da conta é o único responsável pelas ações efetuadas com o seu registo</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Uma vez preenchidos os dados requeridos para o Registo, será enviada uma confirmação de Registo de Conta para o endereço de correio eletrónico indicado pelo Utilizador/Profissional, com uma ligação para ativar a Conta e os Termos e Condições em vigor. O Registo é concluído quando o Utilizador/Profissional ativa a sua Conta. Neste momento, é concluído um contrato de serviços de Conta. Se a ativação não for realizada no prazo de 30 Dias após a receção do correio eletrónico de confirmação do Registo de Conta, a ligação de ativação expira e a Conta não é ativada. O utilizador só poderá voltar a registar-se utilizando o mesmo endereço de correio eletrónico contactando o TAREFAS: pt.tarefas@gmail.com.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O Utilizador/Profissional declara que os dados fornecidos durante o processo de Registo e a utilização do Serviço são verdadeiros, corretos e atualizados e que está autorizado a utilizar tais dados. O utilizador compromete-se a atualizar os dados se os mesmos sofrerem alterações.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Uma pessoa que atue no Website por ou em nome de um Utilizador/Profissional, que seja uma pessoa coletiva ou uma entidade organizacional sem personalidade jurídica, à qual tenha sido conferida capacidade jurídica pela lei, declara que está devidamente autorizada a agir e executar todas as atividades no Website por conta e em nome do Utilizador/Profissional.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O utilizador compromete-se a manter os dados de acesso à conta em segredo e a protegê-los contra o acesso por terceiros não autorizados. O Utilizador/Profissional deverá informar imediatamente o TAREFAS caso tome conhecimento de qualquer acesso não autorizado à sua Conta por terceiros e, se possível, deverá alterá-la imediatamente.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O contrato de serviços de Conta é concluído por um período de tempo indefinido após a ativação da Conta:</span>
                        <ol className={styles.tos_inner_ol} type="a">
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>o direito de eliminar a conta não afetará o direito do Utilizador/Profissional de se retratar ou rescindir o contrato, nos termos previstos da lei e para efeitos destes Termos e Condições.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>É possível eliminar uma conta: (i) selecionando a opção correspondente nas opções de Conta, (ii) enviando uma declaração de resolução para um endereço de correio eletrónico: pt.tarefas@gmail.com.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>depois de o Utilizador/Profissional eliminar a Conta, os restantes acordos entre o TAREFAS e o Utilizador/Profissional respeitantes aos serviços prestados no Website expirarão.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>A rescisão do contrato de Conta tornar-se-á efetiva no momento da sua execução (para o futuro), o que significa que os pagamentos realizados pelo Utilizador/Profissional pelos serviços prestados não serão reembolsáveis. O TAREFAS também não é obrigado a reembolsar o equivalente aos valores não utilizados e quantias já pagas para utilização dos Serviços previamente contratados (p.ex. colocação de destaques).</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>a leitura dos Termos e Condições e dos respetivos anexos e a aceitação das respetivas provisões.</span>
                            </li>
                        </ol>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O TAREFAS poderá rescindir o contrato com o Utilizador/Profissional, se este:</span>
                        <ol className={styles.tos_inner_ol} type="a">
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>não tiver iniciado sessão na Conta durante mais de 24 meses. Neste caso, o Utilizador/Profissional deixará de poder utilizar a Conta eliminada. As informações sobre a rescisão do contrato serão enviadas ao Utilizador/Profissional com uma antecedência mínima de 30 Dias, para o endereço de correio eletrónico indicado durante o Registo. O Utilizador/Profissional poderá expressar a sua vontade de continuar a utilizar a Conta utilizando a funcionalidade disponibilizada para o efeito, devendo o Utilizador/Profissional iniciar sessão na Conta. O direito do TAREFAS de rescindir o contrato em conformidade com esta provisão não limita o direito do Utilizador/Profissional de voltar a registar-se no Serviço. Contudo, o TAREFAS não garante que o nome de Utilizador/Profissional existente, associado à Conta anterior, estará disponível para utilização no novo registo.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>apesar de ser notificado pelo TAREFAS para que ponha fim a alguns atos ou omissões que violem as provisões dos Termos e Condições ou as provisões da lei geralmente aplicável, continuar a agir como lhe é advertido na notificação.</span>
                            </li>
                        </ol>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O TAREFAS pode ainda, a qualquer momento, cancelar ou eliminar, de forma temporária ou permanente, o registo do Utilizador/Profissional ou Profissional se este: (i) não cumprir os presentes Termos e Condições; (ii) ceder a sua posição contratual a terceiros sem a nossa prévia autorização por escrito; e/ou (iii) atuar de forma a acarretar prejuízos para nós, restantes Anunciantes e/ou Visitantes do Site ou da Aplicação. Contudo, qualquer alteração será a título definitivo será comunicada num suporte duradouro aos utilizadores dentro de um prazo razoável de pré-aviso não inferior a 30 Dias</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Para assegurar o funcionamento adequado do Serviço, proteger e garantir a segurança das pessoas que o utilizam, o TAREFAS reserva-se o direito de levar a cabo uma verificação adicional da validade e veracidade dos dados fornecidos pelo Utilizador/Profissional e de solicitar ao Utilizador/Profissional que confirme a sua identidade, as informações contidas no Anúncio ou as informações relacionadas com a transação realizada, da forma determinada pelo TAREFAS</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Os perfis associados a contas de Utilizador/Profissional que sejam ilegais ou violem as provisões do Termos e Condições, em particular: duplicadas, consideradas ofensivos, com conteúdo pornográfico ou erótico, conteúdo que possa ser interpretado como promoção de atividades sexuais ou eróticas em troca de dinheiro, que constituam uma tentativa de fraude ou violem qualquer direito de propriedade intelectual (copyright) serão removidos.</span>
                    </li>
                </ol>

                {/* Regras de publicação de Anúncios */}
                <li className={styles.tos_main_li}>Regras de P de Tarefas/Anúncios</li>
                <ol className={styles.tos_ol}>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O TAREFAS permite ao Utilizador publicar o Anúncio no Website. A Publicação, pelo Utilizador, de um Anúncio no Website tem lugar após o preenchimento do formulário adequado e sob a condição de que o SMS seja verificado. A verificação por SMS é levada a cabo uma vez e consiste no envio de um código de verificação para o número de telefone indicado pelo Utilizador, código esse que o Utilizador introduz seguidamente no formulário, onde um número de telefone é utilizado para a verificação de e-mail e SMS, em uma conta. A verificação por SMS pode ser repetida no âmbito de procedimentos de segurança internos.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Um Anúncio publicado pelo Utilizador no Serviço está parcialmente disponível para todos os utilizadores e visitantes do Website. Detalhes de localização, e-mail e contacto telefónico apenas estarão disponíveis a contas de profissional verificadas e com subscrição activa, apen Com o Anúncio, também será disponibilizado um formulário para permitir aos Profissionais contactar o anunciante e enviar-lhe uma mensagem. O respetivo número de telefone também será disponibilizado ao profissional verificado que visualiza o Anúncio.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>No momento da publicação do Anúncio, o Utilizador concede ao TAREFAS uma licença não exclusiva, territorialmente ilimitada e gratuita, para registar, multiplicar e distribuir a totalidade ou parte do conteúdo dos Anúncios divulgados no Website, bem como aos parceiros do TAREFAS através dos quais a promoção do Serviço seja levada a cabo e, também, em qualquer local através da Internet, incluindo motores de busca (como, por exemplo, o Google) e redes sociais (como, por exemplo, o Facebook). A concessão de uma licença é necessária para uma utilização completa do Serviço. Devido à natureza específica da Internet, o TAREFAS não tem um total controlo sobre a distribuição dos conteúdos publicados ou transmitidos utilizando as funcionalidades do Serviço para outros Utilizadores e não assume qualquer responsabilidade nesta matéria por terceiros, em particular no caso da cópia e distribuição de Anúncios por tais pessoas em Websites e portais não relacionados com o presente Serviço.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O Anúncio é preparado pelo Anunciante, sendo o seu conteúdo da exclusiva responsabilidade do respetivo Anunciante.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O conteúdo de cada Anúncio deverá cumprir os requisitos aqui apresentados:</span>
                        <ol className={styles.tos_inner_ol} type="a">
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>O Anúncio deverá ser redigido em português e não deverá conter palavras habitualmente consideradas vulgares ou ofensivas, informações dúbias ou falsas. Na tarefa do tipo Tradução, o Anúncio também pode ser preparado numa língua estrangeira.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>O Utilizador escolherá um tipo de tarefa que seja adequada, ao qual o Anúncio deverá ser atribuído.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>O conteúdo do Anúncio deve conter uma descrição clara, precisa e completa da tarefa/serviço, incluindo informações verídicas e não enganosas sobre as suas características. É proibido transmitir esta informação sem o Serviço;</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>O conteúdo do Anúncio não pode indicar informações de contacto, podendo as mesmas ser fornecidas apenas nos campos do formulário disponibilizados para o efeito</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>O serviço/tarefa disponibilizada no Anúncio devem estar na posse (titularidade) do Utilizador e/ou localizado em Portugal, incluindo, mas sem limitar a, serviços a prestar em imóveis e veículos automóveis, que terão de estar localizados em território Português</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>Caso o Anunciante opte por colocar fotografias, asseguramos que poderá colocar entre 1 a 5 fotografias por Anúncio, em formato JPG, PNG ou GIF.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>A oferta relativa ao Serviço publicitado pelo Anunciante não obriga à conclusão da respetiva transação.</span>
                            </li>
                        </ol>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Se o Utilizador publicar um Anúncio com o tipo de tarefa errado, o TAREFAS poderá alterar o tipo de tarefa, mas se a alteração resultar na publicação de um Anúncio fora dos Limites, o Anúncio terá de ser eliminado</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Não é permitido apagar, de forma sistemática, anúncios e voltar a colocá-los, uma vez que tal prejudica gravemente a navegabilidade do Website e da Aplicação</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Não é permitido que o mesmo Anúncio seja utilizado pelo Anunciante para, de forma sequencial, divulgar diferentes Serviços ou produtos</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>A publicação de um Anúncio no Website é realizada pelo Utilizador utilizando os botões "NOVA TAREFA" existente em vários zonas do Website</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>A emissão de um Anúncio no Serviço inicia imediatamente após a sua publicação e tem uma duração de 30 (trinta) Dias.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Durante o período de publicação de um Anúncio no Serviço, o Utilizador pode modificar o conteúdo e alguns dos parâmetros do Anúncio e eliminá-lo.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>As Tarefas anunciadas por Utilizadores que sejam ilegais ou violem as provisões do Termos e Condições, em particular: duplicadas, consideradas ofensivos, com conteúdo pornográfico ou erótico, conteúdo que possa ser interpretado como promoção de atividades sexuais ou eróticas em troca de dinheiro, que constituam uma tentativa de fraude ou violem qualquer direito de propriedade intelectual (copyright) serão removidas e a conta posteriormente apagada.</span>
                    </li>
                </ol>

                {/* Pagamentos  */}
                <li className={styles.tos_main_li}>Pagamentos</li>
                <ol className={styles.tos_ol}>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O Profissional será informado de forma visível no Website acerca do preço atual dos planos de Subscrição existentes e selecionados em cada momento. Todos os preços apresentados no Website ou nas tabelas de preços são preços finais.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Os pagamentos da subscrição serão realizados através de cartão de crédito/cartão bancário mediado pelo serviço Stripe.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O Profissional subscrito a um plano de Subscrição poderá alterar o plano se assim desejar, com a cobrança do novo plano a ser feito no final do termo do plano antigo (ou seja, no início do plano novo).</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O Profissional subscrito a um plano de Subscrição poderá cancelar a subscrição, ficando subscrito até ao final do termo do plano que acabára de cancelar.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Em caso da conta ser apagada pelo Profissional, não será reembolsado o valor cobrado pela subscrição selecionado. Esta subscrição será cancelada no final do termo do plano de subscrição selecionada.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Em caso da conta ser apagada pelo TAREFAS, em consequência do Profissional infringir qualquer conduta descrita nos Termos e Condições, não será reembolsado o valor cobrado pela subscrição selecionada. Esta subscrição será cancelada no final do termo do plano de sbscrição selecionado.</span>
                    </li>
                </ol>

                {/* Alterações aos Termos e Condições */}
                <li className={styles.tos_main_li}>Alterações aos Termos e Condições</li>
                <ol className={styles.tos_ol}>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Em caso de alteração às cláusulas gerais dos presentes Termos e Condições do TAREFAS, com exceção das propostas de alteração de redação (que não alterem o seu conteúdo), e no seguimento da notificação do TAREFAS com o mínimo de antecedência de 15 Dias, o Anunciante profissional, caso assim o entenda, terá o direito de resolver o contrato no prazo de 15 Dias após a receção da referida notificação de alteração, salvo se se aplicar ao contrato um prazo mais curto, por exemplo, em aplicação do direito civil nacional.</span>
                    </li>
                </ol>

                {/* Lei aplicável e resolução de litígios */}
                <li className={styles.tos_main_li}>Lei aplicável e resolução de litígios</li>
                <ol className={styles.tos_ol}>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>A lei aplicável ao Website, à Aplicação e aos presentes Termos e Condições é a lei portuguesa</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O Utilizador/Profissional poderá entrar em contato com o TAREFAS, por escrito, sobre os Serviços através do e-mail pt.tarefas@gmail.com:</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Os tribunais portugueses são exclusivamente competentes para dirimir quaisquer litígios relacionados com a utilização do Website e da Aplicação e com os presentes Termos e Condições.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Informa-se os consumidores de que, nos termos e para os efeitos do disposto no artigo 14.º da Lei n.º 24/96, de 31 de Julho, conforme alterada, os conflitos de consumo cujo valor não exceda a alçada dos tribunais de primeira instância (i.e., € 5.000,00), estão sujeitos a arbitragem necessária ou mediação quando, por opção expressa do consumidor, sejam submetidos à apreciação de tribunal arbitral adstrito aos centros de arbitragem de conflitos de consumo legalmente autorizados.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Os Utilizadores do Serviço, incluindo pessoas singulares ou coletivas que tenham denunciado conteúdos ilegais, aos quais são dirigidas decisões relacionadas com o bloqueio ou a suspensão de conteúdos disponíveis no Serviço, têm o direito de escolher qualquer organismo extrajudicial de resolução de litígios que tenha recebido um certificado emitido pelo Coordenador dos Serviços Digitais.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}></span>
                    </li>
                </ol>

                {/* Disposições Finais */}
                <li className={styles.tos_main_li}>Disposições Finais</li>
                <ol className={styles.tos_ol}>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O TAREFAS reserva-se o direito de alterar os Termos e Condições, quando se verifique uma das seguintes situações:</span>
                        <ol className={styles.tos_inner_ol} type="a">
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>a necessidade de melhorar a segurança do Utilizador/Profissional.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>a necessidade de melhorar o funcionamento do Website, sendo que alterações efetuadas nesta base não resultarão num aumento ou introdução de taxas adicionais em relação às taxas já cobradas (pagas) e permitirão uma maior utilização do Website.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>a necessidade de combater abusos relacionados com a utilização do Website.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>alteração das condições de prestação da subscrição ou retirada de um plano de subcrição em específico, sendo que as alterações efetuadas nesta base não afetarão a subscrição adquirida em momento anterior à entrada em vigor das alterações</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>O serviço/tarefa disponibilizada no Anúncio devem estar na posse (titularidade) do Utilizador e/ou localizado em Portugal, incluindo, mas sem limitar a, serviços a prestar em imóveis e veículos automóveis, que terão de estar localizados em território Português</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>a introdução de um novo plano de Sibscrição, bem como a introdução de funcionalidades adicionais do Website, ambos de utilização voluntária.</span>
                            </li>
                            <li className={styles.tos_inner_li}>
                                <span className={styles.tos_desc}>alteração na legislação aplicável que tenha um impacto direto no conteúdo destes Termos e Condições.</span>
                            </li>
                        </ol>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O Utilizador/Profissional será informado de cada alteração através da publicação de informação no Website e por via eletrónica.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>As alterações entram em vigor na data indicada pelo TAREFAS, num prazo não inferior a 15 Dias a contar da data de notificação da alteração aos Termos e Condições, salvo disposição em contrário prevista na legislação aplicável.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Aplicar-se-ão as provisões atuais destes Termos e Condições às subscrições que se encontrem ativas antes da data de entrada em vigor dos novos Termos e Condições.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Para efeitos de execução do Serviço, o TAREFAS reserva-se o direito de introduzir novos serviços e funcionalidades, que podem ser precedidos de testes de produtos, sem prejuízo dos direitos adquiridos dos Utilizadores/Profissionais.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Salvo estipulação diferente pela lei, a lei aplicável aos contratos entre o Utilizador/Profissional e o TAREFAS será a lei portuguesa. A escolha da lei portuguesa não priva o Consumidor da proteção que lhe é proporcionada ao abrigo de provisões que não possam ser derrogadas contratualmente em virtude da lei aplicável em caso de ausência de escolha.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>O não exercício, ou o exercício tardio ou parcial, de qualquer direito que nos assista ao abrigo destes Termos e Condições, em nenhum caso poderá significar a renúncia a esse direito, ou acarretar a sua caducidade, pelo que o mesmo se manterá válido e eficaz, não obstante o seu não exercício.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>Caso alguma das cláusulas destes Termos e Condições de Utilização venha a ser julgada nula ou vier a ser anulada, tal não afetará a validade das restantes cláusulas nem a validade dos restantes Termos e Condições de Utilização, que se considerarão automaticamente reduzidos nos termos do artigo 292.º do Código Civil.</span>
                    </li>
                    <li className={styles.tos_li}>
                        <span className={styles.tos_desc}>É completamente proibida a utilização da nossa marca sem a nossa aprovação.</span>
                    </li>
                </ol>
                
            </ol>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <img className={styles.text_brand} src={logo_text}/>
            </div>
            
        </div>
    )
}

export default Tos