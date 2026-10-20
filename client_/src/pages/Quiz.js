import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  ProgressBar,
  Badge,
  Alert,
} from "react-bootstrap";
import {
  Clock,
  Home,
  Activity,
  AlertTriangle,
  Users,
  PawPrint,
  GraduationCap,
  Heart,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ShieldAlert,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FIND_PET_ROUTE } from "../utils/consts";

const questions = [
  {
    id: 1,
    title: "Сколько часов в день вас обычно нет дома?",
    subtitle: "Питомцы по-разному переносят одиночество. Честный ответ поможет избежать стресса для животного.",
    icon: Clock,
    options: [
      {
        id: "under_4",
        label: "Меньше 4 часов",
        desc: "Работаю удалённо, свободный график или дома всегда кто-то есть",
        weights: { dog: 3, puppy: 3, active: 2 },
      },
      {
        id: "4_to_8",
        label: "4–8 часов",
        desc: "Стандартный рабочий день с перерывом",
        weights: { dog: 1, cat: 2, calm: 2 },
      },
      {
        id: "8_to_12",
        label: "8–12 часов",
        desc: "Много работы, частые дела в городе",
        weights: { cat: 4, independent: 4, calm: 3 },
      },
      {
        id: "over_12",
        label: "Больше 12 часов",
        desc: "Ненормированный график, командировки, ранний уход и поздний возврат",
        weights: { independent: 5, volunteer: true },
      },
    ],
  },
  {
    id: 2,
    title: "Где вы живёте?",
    subtitle: "Размер жилья и тип собственности влияют на комфорт питомца и безопасность проживания.",
    icon: Home,
    options: [
      {
        id: "house",
        label: "Дом с участком / Просторная квартира",
        desc: "Много места, закрытая территория или 3+ комнат",
        weights: { dog: 3, active: 2, family: 2 },
      },
      {
        id: "standard_flat",
        label: "Обычная 1–2 комнатная квартира",
        desc: "Стандартная городская квартира со всеми удобствами",
        weights: { cat: 2, compact: 2, calm: 1 },
      },
      {
        id: "studio_rent",
        label: "Квартира-студия / Съемное жилье",
        desc: "Небольшая площадь или необходимость согласования с арендодателем",
        weights: { cat: 3, compact: 4, independent: 2 },
      },
    ],
  },
  {
    id: 3,
    title: "Какой у вас уровень активности в свободное время?",
    subtitle: "Совпадение по темпераменту — главный секрет гармоничной дружбы с питомцем.",
    icon: Activity,
    options: [
      {
        id: "very_active",
        label: "Обожаю долгие прогулки, бег, походы",
        desc: "Активно провожу выходные, люблю спорт на открытом воздухе",
        weights: { dog: 4, active: 4 },
      },
      {
        id: "moderate",
        label: "Умеренные прогулки по району",
        desc: "Спокойный шаг по парку утром и вечером по 30–45 минут",
        weights: { dog: 2, family: 2, calm: 1 },
      },
      {
        id: "calm_home",
        label: "В основном отдыхаю дома, люблю тишину",
        desc: "Уютные вечера с книгой, сериалами и чашкой чая",
        weights: { cat: 4, calm: 4, independent: 2 },
      },
    ],
  },
  {
    id: 4,
    title: "Есть ли у вас или членов семьи аллергия на шерсть?",
    subtitle: "Безопасность здоровья вашей семьи — залог того, что хвостик не вернётся в приют.",
    icon: ShieldAlert,
    options: [
      {
        id: "allergy_yes",
        label: "Да, есть подтверждённая реакция или подозрения",
        desc: "Чихание, зуд или слезоточивость при контакте с животными",
        weights: { allergy: true },
      },
      {
        id: "allergy_no",
        label: "Нет / Не замечено",
        desc: "Ни у кого в семье нет признаков аллергии на кошек и собак",
        weights: { allergy: false },
      },
      {
        id: "allergy_unsure",
        label: "Не знаем наверняка / не проверяли",
        desc: "Давно не контактировали близко с животными",
        weights: { allergyTestAdvised: true },
      },
    ],
  },
  {
    id: 5,
    title: "Есть ли дома дети?",
    subtitle: "Некоторым животным требуется повышенное терпение и социализация для комфорта малышей.",
    icon: Users,
    options: [
      {
        id: "no_kids",
        label: "Нет, живём взрослым составом",
        desc: "Только совершеннолетние или студенты",
        weights: { independent: 1 },
      },
      {
        id: "older_kids",
        label: "Дети старше 10 лет",
        desc: "Ребёнок понимает границы животного и готов помогать с уходом",
        weights: { family: 2, dog: 1, hasKids: true },
      },
      {
        id: "toddlers",
        label: "Малыши до 7 лет",
        desc: "Нужен максимально спокойный, стрессоустойчивый и добрый питомец",
        weights: { family: 4, calm: 2, kidsNotice: true, hasKids: true },
      },
    ],
  },
  {
    id: 6,
    title: "Есть ли дома другие животные?",
    subtitle: "Важно подобрать компаньона, готового мирно делить территорию.",
    icon: PawPrint,
    options: [
      {
        id: "no_pets",
        label: "Нет, это будет единственный любимец",
        desc: "Всё внимание и забота достанутся ему",
        weights: { any: true },
      },
      {
        id: "has_cat",
        label: "Да, дома живёт кошка",
        desc: "Нужен лояльный к кошкам хвостик",
        weights: { catFriendly: true, cat: 1, hasAnimals: true },
      },
      {
        id: "has_dog",
        label: "Да, дома живёт собака",
        desc: "Нужен дружелюбный к сородичам питомец",
        weights: { dogFriendly: true, dog: 1, hasAnimals: true },
      },
      {
        id: "small_pets",
        label: "Грызуны, птицы или аквариум",
        desc: "Нужно животное без сильного охотничьего инстинкта",
        weights: { smallPetNotice: true, hasAnimals: true },
      },
    ],
  },
  {
    id: 7,
    title: "Был ли у вас ранее опыт содержания питомцев?",
    subtitle: "Опыт помогает справиться с адаптацией, но приюты всегда готовы обучить новичков.",
    icon: GraduationCap,
    options: [
      {
        id: "pro",
        label: "Да, большой опыт содержания и воспитания",
        desc: "Уже воспитывал животных, знаю особенности ветеринарии и дрессировки",
        weights: { experienced: true },
      },
      {
        id: "medium",
        label: "Был небольшой опыт / жили животные в детстве",
        desc: "Понимаю базовый уход, но готов учиться новому",
        weights: { calm: 1 },
      },
      {
        id: "beginner",
        label: "Новичок, это мой первый собственный питомец",
        desc: "Ищу спокойного, контактного хвостика без сложных поведенческих проблем",
        weights: { beginner: true, calm: 2 },
      },
    ],
  },
  {
    id: 8,
    title: "Кого вы сами больше хотите сердцем?",
    subtitle: "Ваше искреннее желание — решающий голос при определении идеального друга.",
    icon: Heart,
    options: [
      {
        id: "heart_dog",
        label: "Очень хочу собаку 🐶",
        desc: "Мечтаю о прогулках, преданных глазах и совместных тренировках",
        weights: { dog: 6 },
      },
      {
        id: "heart_cat",
        label: "Мечтаю о котике 🐱",
        desc: "Хочу мурчащий комочек, грацию и уютные домашние вечера",
        weights: { cat: 6 },
      },
      {
        id: "heart_open",
        label: "Пока не определился, доверяю тесту 🐾",
        desc: "Готов принять того, кто идеально впишется в мой образ жизни",
        weights: { neutral: true },
      },
    ],
  },
];

const archetypes = {
  dog_active: {
    key: "dog_active",
    title: "Верный компаньон для прогулок",
    badge: "Активный хвостик",
    emoji: "🐶",
    tagline: "Энергичная, преданная собака (1–3 года), готовая к приключениям и долгим прогулкам.",
    description:
      "Ваш образ жизни и свободное время идеально подходят для жизнерадостной собаки. Вы сможете стать лучшей командой: вместе бегать по утрам, исследовать парки Самары и разучивать команды. В приютах много молодых собак, которые прямо сейчас ждут своего человека с таким же активным сердцем!",
    queryParams: {
      type: 1, // Собака
      age: "young", // 1–3 года
      city: "Самара",
    },
    filterLabel: "Собаки 1–3 года (Самара)",
  },
  cat_calm: {
    key: "cat_calm",
    title: "Кот-философ (диванный уют)",
    badge: "Хранитель покоя",
    emoji: "🐱",
    tagline: "Взрослый спокойный кот или кошечка (от 2–3 лет), ценящие домашний уют и тишину.",
    description:
      "Вам идеально подходит самостоятельный мурлыкающий компаньон. Он будет с удовольствием встречать вас после рабочего дня, мурчать на коленях во время чтения или просмотра фильмов и не потребует ранних подъемов в дождь. Взрослые кошки уже приучены к лотку и ценят человеческое тепло как никто другой.",
    queryParams: {
      type: 2, // Кошка
      age: "adult", // Старше 3 лет
      city: "Самара",
    },
    filterLabel: "Взрослые кошки (Самара)",
  },
  family_friend: {
    key: "family_friend",
    title: "Золотой друг для всей семьи",
    badge: "Семейный любимец",
    emoji: "🐾",
    tagline: "Социализированный, дружелюбный и терпеливый питомец, обожающий общение.",
    description:
      "Для вашего дома с детьми и питомцами ключевое качество — устойчивая психика и добродушие. Вам нужен компаньон, который ласково относится к детям, деликатно играет и легко адаптируется к семейному шуму. В приютах волонтеры специально отмечают таких животных с открытым золотым характером.",
    queryParams: {
      type: 1, // Собака (или универсальный)
      category: 1, // Ищет дом
      city: "Самара",
      kids: 1,
    },
    filterLabel: "Питомцы для семьи (ладят с детьми)",
  },
  dog_compact: {
    key: "dog_compact",
    title: "Компактный хвостик для квартиры",
    badge: "Городской компаньон",
    emoji: "🐕",
    tagline: "Небольшая собака средних лет, адаптированная к жизни в квартире и городскому ритму.",
    description:
      "В условиях квартиры-студии или арендованного жилья идеальным спутником станет компактная, воспитанная собачка небольшого или среднего размера. Она не займет много места, легко освоится в транспорте и на улице, а её содержание не вызовет проблем с соседями или арендодателями.",
    queryParams: {
      type: 1, // Собака
      age: "adult",
      city: "Самара",
    },
    filterLabel: "Небольшие собаки для квартиры (Самара)",
  },
  independent_pet: {
    key: "independent_pet",
    title: "Самостоятельный независимый пушистик",
    badge: "Автономный друг",
    emoji: "🕊️",
    tagline: "Взрослое, ненавязчивое животное, спокойно проводящее день в одиночестве.",
    description:
      "Если вас часто нет дома более 8–10 часов, брать щенка или котенка рискованно: малыши тяжело переносят разлуку. Зато взрослый, мудрый кот или независимая собака средних лет прекрасно выспятся за день, бережно сохранят квартиру и встретят вас радостным мурчанием без лишнего стресса.",
    queryParams: {
      type: 2, // Кошка
      age: "adult",
      city: "Самара",
    },
    filterLabel: "Самостоятельные котики от 3 лет (Самара)",
  },
};

const Quiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / totalQuestions) * 100);

  // Выбор варианта ответа
  const handleSelectOption = (option) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: option,
    };
    setAnswers(updatedAnswers);

    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      calculateResult(updatedAnswers);
    }
  };

  // Шаг назад
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Перезапуск теста
  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setResult(null);
  };

  // Вычисление архетипа и практических советов
  const calculateResult = (allAnswers) => {
    let dogScore = 0;
    let catScore = 0;
    let activeScore = 0;
    let calmScore = 0;
    let familyScore = 0;
    let compactScore = 0;
    let independentScore = 0;

    let hasAllergy = false;
    let needsAllergyTest = false;
    let hasToddlers = false;
    let isBeginner = false;
    let isOver12Hours = false;
    let hasSmallPets = false;
    let hasKids = false;
    let hasAnimals = false;

    Object.values(allAnswers).forEach((opt) => {
      const w = opt.weights || {};
      if (w.dog) dogScore += w.dog;
      if (w.cat) catScore += w.cat;
      if (w.active) activeScore += w.active;
      if (w.calm) calmScore += w.calm;
      if (w.family) familyScore += w.family;
      if (w.compact) compactScore += w.compact;
      if (w.independent) independentScore += w.independent;

      if (w.hasKids) hasKids = true;
      if (w.hasAnimals) hasAnimals = true;

      if (w.allergy === true) hasAllergy = true;
      if (w.allergyTestAdvised) needsAllergyTest = true;
      if (w.kidsNotice) hasToddlers = true;
      if (w.beginner) isBeginner = true;
      if (w.volunteer) isOver12Hours = true;
      if (w.smallPetNotice) hasSmallPets = true;
    });

    // Определение архетипа
    let selectedArchetypeKey = "cat_calm";

    if (isOver12Hours) {
      selectedArchetypeKey = "independent_pet";
    } else if (hasToddlers || familyScore >= 4) {
      selectedArchetypeKey = "family_friend";
    } else if (compactScore >= 4 && dogScore >= catScore) {
      selectedArchetypeKey = "dog_compact";
    } else if (activeScore >= 3 && dogScore >= catScore) {
      selectedArchetypeKey = "dog_active";
    } else if (calmScore >= 3 || catScore > dogScore) {
      selectedArchetypeKey = independentScore >= 4 ? "independent_pet" : "cat_calm";
    } else {
      selectedArchetypeKey = "dog_active";
    }

    // Формирование персональных советов
    const tips = [];

    // Совет по графику и занятости
    if (isOver12Hours) {
      tips.push({
        type: "warning",
        title: "График больше 12 часов вне дома",
        text: "В одиночестве собака может страдать и выть, а щенок не сможет научиться туалету. Рекомендуем присмотреться к паре взрослых кошек (они развлекут друг друга) либо попробовать себя в роли автоволонтёра приюта ZooHub по выходным!",
      });
    } else if (independentScore >= 3) {
      tips.push({
        type: "info",
        title: "Совет по режиму дня",
        text: "Так как вас нет дома 8+ часов, обратите внимание на взрослых питомцев от 2 лет. Они спокойно спят во время рабочего дня и не портят мебель от скуки.",
      });
    } else {
      tips.push({
        type: "success",
        title: "Идеальный баланс времени",
        text: "Вы проводите достаточно времени дома, поэтому хвостик получит максимум внимания, социализации и заботы.",
      });
    }

    // Совет по аллергии
    if (hasAllergy) {
      tips.push({
        type: "danger",
        title: "Внимание к аллергии!",
        text: "Перед тем как взять животное, обязательно сдайте развёрнутую аллергопанель на шерсть и эпителий, а также проведите 2–3 часа в гостях в приюте или котокафе. Это защитит вас и спасёт питомца от повторного стресса при возврате.",
      });
    } else if (needsAllergyTest) {
      tips.push({
        type: "warning",
        title: "Проверка на аллергию",
        text: "Если давно не жили с животными, съездите в приют ZooHub на день открытых дверей — погуляйте и погладьте подопечных, чтобы исключить скрытую чувствительность.",
      });
    }

    // Совет по детям или опыту
    if (hasToddlers) {
      tips.push({
        type: "info",
        title: "Дети и питомец",
        text: "Для семьи с малышами выбирайте спокойных животных от 1.5–2 лет, чей характер уже известен кураторам приюта. Научите ребёнка не трогать питомца во время сна и еды.",
      });
    } else if (isBeginner) {
      tips.push({
        type: "info",
        title: "Совет новичку",
        text: "Кураторы приютов Самары с радостью подскажут повадки животного, подарят памятку по адаптации и будут на связи в первые недели дома.",
      });
    } else if (hasSmallPets) {
      tips.push({
        type: "info",
        title: "Соседство с грызунами и птицами",
        text: "Выбирайте питомца со спокойным темпераментом и оборудуйте надёжные клетки/вольеры на высоте для безопасности пернатых и пушистых соседей.",
      });
    }

    setResult({
      archetype: archetypes[selectedArchetypeKey],
      tips,
      hasAllergy,
      isOver12Hours,
      hasKids: hasToddlers || hasKids,
      hasAnimals,
    });
  };

  // Переход в каталог с готовыми query-параметрами
  const handleGoToCatalog = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!result || !result.archetype) {
      navigate(FIND_PET_ROUTE);
      return;
    }

    const { queryParams } = result.archetype;
    const search = new URLSearchParams();

    if (queryParams.type) search.set("type", queryParams.type);
    if (queryParams.age) search.set("age", queryParams.age);
    if (queryParams.city) search.set("city", queryParams.city);
    if (queryParams.category) search.set("category", queryParams.category);

    // Добавляем теги «Важно для дома», если актуально для архетипа или ответов
    if (queryParams.kids || result.hasKids || result.archetype.key === "family_friend") {
      search.set("kids", "1");
    }
    if (queryParams.animals || result.hasAnimals) {
      search.set("animals", "1");
    }

    navigate(`${FIND_PET_ROUTE}?${search.toString()}`);
  };

  return (
    <section className="py-5 bg-light min-vh-100">
      <div className="container py-2" style={{ maxWidth: "860px" }}>
        {!result ? (
          /* Экран прохождения теста */
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white p-3 p-md-4">
            <Card.Body>
              {/* Шапка теста */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Badge
                  bg="warning"
                  text="dark"
                  className="px-3 py-2 rounded-pill fw-bold"
                >
                  Вопрос {currentStep + 1} из {totalQuestions}
                </Badge>
                <span className="small text-muted fw-semibold">
                  Готово на {progressPercent}%
                </span>
              </div>

              {/* Прогресс-бар */}
              <ProgressBar
                now={progressPercent}
                variant="warning"
                className="mb-4 rounded-pill"
                style={{ height: "8px" }}
              />

              {/* Заголовок вопроса */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  {React.createElement(currentQuestion.icon, {
                    size: 24,
                    className: "text-warning flex-shrink-0",
                  })}
                  <h4 className="fw-bold mb-0 text-dark">
                    {currentQuestion.title}
                  </h4>
                </div>
                {currentQuestion.subtitle && (
                  <p className="text-muted small ms-md-4 mb-0">
                    {currentQuestion.subtitle}
                  </p>
                )}
              </div>

              {/* Карточки-варианты */}
              <div className="d-flex flex-column gap-3 mb-4">
                {currentQuestion.options.map((option) => {
                  const isSelected =
                    answers[currentQuestion.id]?.id === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSelectOption(option)}
                      className={`p-3 p-md-4 rounded-4 border text-start cursor-pointer transition-all ${
                        isSelected
                          ? "border-warning bg-warning-subtle shadow-sm"
                          : "border-light-subtle bg-white hover-shadow"
                      }`}
                      style={{
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = "#ffc107";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = "#dee2e6";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold text-dark fs-6 mb-1">
                            {option.label}
                          </div>
                          {option.desc && (
                            <div className="text-muted small">
                              {option.desc}
                            </div>
                          )}
                        </div>
                        <div
                          className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ms-3 ${
                            isSelected
                              ? "bg-warning text-dark"
                              : "border text-transparent"
                          }`}
                          style={{ width: "26px", height: "26px" }}
                        >
                          <CheckCircle2 size={16} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Навигационные кнопки */}
              <div className="d-flex justify-content-between align-items-center pt-2">
                <Button
                  variant="outline-secondary"
                  className="rounded-3 px-3 py-2 border-0 text-muted"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft size={18} className="me-1" />
                  Назад
                </Button>

                <Button
                  variant="link"
                  className="text-muted small text-decoration-none"
                  onClick={handleRestart}
                >
                  <RotateCcw size={14} className="me-1" />
                  Начать сначала
                </Button>
              </div>
            </Card.Body>
          </Card>
        ) : (
          /* Экран результатов теста */
          <div className="d-flex flex-column gap-4">
            {/* Карточка архетипа */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white text-center p-4 p-md-5">
              <Card.Body className="p-0">
                <div
                  className="mx-auto mb-3 d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "88px",
                    height: "88px",
                    background: "#fff3cd",
                    fontSize: "44px",
                  }}
                >
                  {result.archetype.emoji}
                </div>

                <div className="mb-2">
                  <Badge
                    bg="warning"
                    text="dark"
                    className="px-3 py-2 rounded-pill fw-bold fs-6"
                  >
                    {result.archetype.badge}
                  </Badge>
                </div>

                <h2 className="fw-bold text-dark mb-2">
                  {result.archetype.title}
                </h2>

                <p className="text-muted fw-semibold mb-3 fs-6">
                  {result.archetype.tagline}
                </p>

                <p
                  className="text-secondary mx-auto mb-4"
                  style={{ maxWidth: "680px", lineHeight: "1.7" }}
                >
                  {result.archetype.description}
                </p>

                {/* Главная кнопка перехода в каталог с готовыми фильтрами */}
                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <Button
                    variant="warning"
                    size="lg"
                    className="fw-bold px-4 py-3 rounded-4 shadow-sm text-dark d-flex align-items-center justify-content-center gap-2"
                    onClick={handleGoToCatalog}
                  >
                    <span>Посмотреть подходящих питомцев в приютах Самары</span>
                    <ArrowRight size={20} />
                  </Button>

                  <Button
                    variant="outline-secondary"
                    size="lg"
                    className="rounded-4 px-4 py-3 fw-semibold text-muted"
                    onClick={handleRestart}
                  >
                    <RotateCcw size={18} className="me-2" />
                    Пройти заново
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Блок практических советов эксперта (Кинолог / Фелинолог) */}
            <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
              <Card.Body className="p-0">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Sparkles size={22} className="text-warning" />
                  <h4 className="fw-bold mb-0 text-dark">
                    Советы кинолога и фелинолога ZooHub
                  </h4>
                </div>
                <p className="text-muted small mb-4">
                  На основе ваших ответов мы подготовили 3 персональные рекомендации,
                  чтобы адаптация нового члена семьи прошла легко и без стресса.
                </p>

                <div className="d-flex flex-column gap-3">
                  {result.tips.map((tip, idx) => (
                    <Alert
                      key={idx}
                      variant={
                        tip.type === "danger"
                          ? "danger"
                          : tip.type === "warning"
                          ? "warning"
                          : "light"
                      }
                      className="border-0 shadow-sm rounded-4 mb-0 p-3 p-md-4"
                      style={{
                        backgroundColor:
                          tip.type === "danger"
                            ? "#f8d7da"
                            : tip.type === "warning"
                            ? "#fff3cd"
                            : "#f8f9fa",
                      }}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div className="pt-1">
                          {tip.type === "danger" ? (
                            <ShieldAlert size={22} className="text-danger" />
                          ) : tip.type === "warning" ? (
                            <AlertTriangle size={22} className="text-warning" />
                          ) : (
                            <Info size={22} className="text-primary" />
                          )}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1 text-dark">
                            {tip.title}
                          </h6>
                          <div className="text-secondary small" style={{ lineHeight: "1.6" }}>
                            {tip.text}
                          </div>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default Quiz;
