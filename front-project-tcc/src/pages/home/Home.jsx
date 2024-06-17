import Banner from "../../components/banner/Banner";
import InnerTitle from "../../components/inner_title/InnerTitle";
import Card from "../../components/card/Card";
import OnboardingCard from "../../components/onboarding_card/OnboardingCard";

import {
  MdLocalHospital,
  MdSchool,
  MdPsychologyAlt,
  MdGroups,
} from "react-icons/md";
import style from "./style.module.css";

export default function Home() {
  const cardsData = [
    {
      icon: (
        <MdLocalHospital
          style={{
            width: "48px",
            height: "48px",
            color: "var(--pattern-yellow)",
          }}
        />
      ),
      bgColor: "secondaryYellow",
      title: "Odontologia",
      description:
        "Oferecemos dentro do campi atendimentos odontológicos. Nossos serviços incluem atendimentos de urgência, restaurações, limpeza, extrações e encaminhamentos para tratamentos especializados.",
    },
    {
      icon: (
        <MdSchool
          style={{
            width: "48px",
            height: "48px",
            color: "var(--pattern-yellow)",
          }}
        />
      ),
      bgColor: "secondaryYellow",
      title: "Pedagogia",
      description:
        "O setor pedagógico do NUAPE oferece o suporte necessário para o seu sucesso acadêmico. Propomos uma avaliação de necessidades, orientação de estudos e oficinas para ajudá-lo a desenvolver habilidades de aprendizagem.",
    },
    {
      icon: (
        <MdPsychologyAlt
          style={{
            width: "48px",
            height: "48px",
            color: "var(--pattern-yellow)",
          }}
        />
      ),
      bgColor: "secondaryYellow",
      title: "Psicologia",
      description:
        "Estamos aqui para apoiar seu bem-estar emocional e acadêmico. Disponibilizamos avaliação de necessidades, adaptação acadêmica, suporte para dificuldades de concentração, orientação profissional e acompanhamento para alunos em tratamento.",
    },
    {
      icon: (
        <MdGroups
          style={{
            width: "48px",
            height: "48px",
            color: "var(--pattern-yellow)",
          }}
        />
      ),
      bgColor: "secondaryYellow",
      title: "Serviço social",
      description:
        "Nosso objetivo é ajudar você a acessar, permanecer e concluir seus estudos, promovendo sua emancipação e formação educacional. Oferecemos o apoio e a orientação individual ou em grupos para lidar com diversas situações da vida e do contexto social.",
    },
  ];

  const onboardingData = [
    {
      link_img: "/images/onboarding/image-instructions-3.svg",
      title: "Realize seu login na plataforma",
      description:
        "Antes de tudo, é importante realizar seu login na plataforma. Após estar logado, clique em “Agendamentos”, no cabeçalho da página ou no botão 'Agendar sessão' no início da página.",
      progress: 1,
    },
    {
      link_img: "/images/onboarding/image-instructions-1.svg",
      title: "Escolha o profissional",
      description:
        "Na página de agendamentos, após decidir qual área do núcleo você precisa contatar, encontrará uma lista de profissionais disponíveis dentro de cada departamento. Escolha o profissional desejado e clique em seu nome para ver seus os horários disponíveis.",
      progress: 2,
    },
    {
      link_img: "/images/onboarding/image-instructions-2.svg",
      title: "Finalize o agendamento",
      description:
        "Depois de escolher o profissional e a data, clique no horário disponível desejado para agendar sua sessão. Em alguns minutos você receberá um e-mail de confirmação, e pronto. Agora sua sessão está marcada!",
      progress: 3,
    },
  ];
  return (
    <>
      <main>
        <Banner />
        <div id="homeCardContainer">
          <InnerTitle
            title="Quem nós somos"
            description="O Núcleo de Acompanhamento Psicopedagógico e Assistência Estudantil da UTFPR é um espaço dedicado ao bem-estar e desenvolvimento integral dos alunos. Nosso compromisso é oferecer suporte e orientação para que os estudantes alcancem seu potencial acadêmico e pessoal, promovendo um ambiente universitário inclusivo e acolhedor."
          />
          <div className={style.homeCardsContainer}>
            {cardsData.map((card, index) => (
              <Card
                key={index}
                bgColor={card.bgColor}
                title={card.title}
                description={card.description}
              >
                {card.icon}
              </Card>
            ))}
          </div>
        </div>

        <div id="onboardingCardContainer">
          <InnerTitle
            title="Como realizar um agendamento"
            description="Estamos aqui para tornar esse processo o mais simples possível para você. Seja você um estudante calouro ou veterano, este guia prático irá orientá-lo em cada passo, sem complicação, para agendar uma sessão com qualquer profissional do núcleo."
          />
          <div className={style.homeOnboardingCards}>
            {onboardingData.map((onboarding, index) => (
              <OnboardingCard
                key={index}
                link_img={onboarding.link_img}
                title={onboarding.title}
                description={onboarding.description}
                progress={onboarding.progress}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
