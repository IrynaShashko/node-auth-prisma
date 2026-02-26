import prisma from "./src/lib/prisma.js";
import bcrypt from "bcryptjs";

const reviewsData = [
  {
    comment:
      "Ти найкращий масажист у моєму житті Маріє! ❤️ Всіх до кого я потрапляю я порівнюю саме з тобою! бо твій професіоналізм і чуттєвість - для мене еталон. Обіймаю",
    rating: 5,
    user: {
      id: "mgQ-q-qOJip1vsH6Jsd7Q",
      name: "podobedyulia",
    },
  },
  {
    comment:
      "Маша! Я скучаю і думаю про тебе щотижня! Моя спина не знала кращих рук за твої і вона не може без тебе🥲, якраз позавчора цілий день про тебе думала.❤️",
    rating: 5,
    user: {
      id: "2NhOR7OWH5VZfxGgg9BU_",
      name: "melluni",
    },
  },
  {
    comment:
      "Масажист - вогінь! 🔥 Я, як людина з сидячою роботою, відвідував багато різних масажів. Але Марія прям крута) Прям круто робить боляче)",
    rating: 5,
    user: {
      id: "5CRWzSmv23diGqxU2x4bB",
      name: "zinchenko.photography",
    },
  },
  {
    comment:
      "Всім відомо, що наші невиражені емоції накопичуються в нашому тілі. Я часто маю затиск і болі в шиї, а сеанси з Марією для мене не просто масаж, а сеанси психотерапії 😅.",
    rating: 5,
    user: {
      id: "uIr1qOi9owRvnMbz8uV9l",
      name: "julia_danza_ri",
    },
  },
  {
    comment:
      "Машуля, свою спину довіряю тепер тільки тобі! Ти справжній професіонал свого діла! Чекаю🙌🏻",
    rating: 5,
    user: {
      id: "GFACbyXnUoLUQ_LwMy1fI",
      name: "i_am_evgeniia",
    },
  },
  {
    comment:
      "Найкращий масажист! Результат відчула вже після першого разу. В Марії ідеальна сила натиску і супер техніка.",
    rating: 5,
    user: {
      id: "YqJ0QJAXZOhvUALBrT5YD",
      name: "marichkamikitska",
    },
  },
  {
    comment:
      "Маріє, дякую тобі за те, що ти є) Масаж пушка бомба ракєта. Кожного разу відчуваю себе більш живою.",
    rating: 5,
    user: {
      id: "-BoxN2hDuC5o_ezu8sY4Q",
      name: "ginger_elve",
    },
  },
  {
    comment:
      "Марія повернула до життя мою спину і руки після пологів. Наразі відчуваю себе набагато краще.",
    rating: 5,
    user: {
      id: "QMMuVME5fY49y8wrPxVpC",
      name: "pelme6ko",
    },
  },
  {
    comment:
      "Дивовижна дівчина, дивовижний майстер своєї справи, поєднання тонкого душевного відчуття та таланту.",
    rating: 5,
    user: {
      id: "O53ARBZ9P28OxgxSC7Enf",
      name: "Ангеліна",
    },
  },
  {
    comment:
      "Моя спина, шия та плечі кажуть Дякую! Після масажів у Марії набагато покращилось самопочуття.",
    rating: 5,
    user: {
      id: "jLFHNdX3ZZ2qBQdt_ZN5i",
      name: "wandering.wanderess",
    },
  },
];

async function main() {
  console.log("Start seeding...");

  for (const item of reviewsData) {
    const hashedPassword = await bcrypt.hash("12345678", 10);
    const user = await prisma.user.upsert({
      where: { id: item.user.id },
      update: {},
      create: {
        id: item.user.id,
        name: item.user.name,
        email: `${item.user.id}@example.com`,
        password: `${hashedPassword}`,
      },
    });
    await prisma.review.create({
      data: {
        rating: item.rating,
        comment: item.comment,
        userId: user.id,
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
